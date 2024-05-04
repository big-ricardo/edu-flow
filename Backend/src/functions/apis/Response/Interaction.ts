import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import {
  IActivityStepStatus,
} from "../../../models/client/Activity";
import { IFormType } from "../../../models/client/Form";
import {
  FieldTypes,
  IValue,
} from "../../../models/client/FormDraft";
import uploadFileToBlob from "../../../services/upload";
import { Types, ObjectId } from "mongoose";
import {
  extraOutputsInteractionProcess,
  sendToQueue,
} from "../../../utils/sbusOutputs";
import FormRepository from "../../../repositories/Form";
import FormDraftRepository from "../../../repositories/FormDraft";
import ActivityRepository from "../../../repositories/Activity";
import UserRepository from "../../../repositories/User";
import ResponseUseCases from "../../use-cases/Response";
import BlobUploader from "../../../services/upload";

interface File {
  name: string;
  mimeType: string;
  base64: string;
}

interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
}

type DtoCreated = {} & {
  [key: string]: File | string | Array<string> | IUser | Array<IUser>;
};

const handler: HttpHandler = async (conn, req, context) => {
  const rest = req.body as DtoCreated;

  const formRepository = new FormRepository(conn);
  const formDraftRepository = new FormDraftRepository(conn);
  const activityRepository = new ActivityRepository(conn);
  const userRepository = new UserRepository(conn);

  const form = (
    await formRepository.findOpenForms({
      where: {
        _id: req.params.form_id,
        type: IFormType.Interaction,
      },
    })
  )[0];

  if (!form) {
    return res.notFound("Form not found");
  }

  const formDraft = await formDraftRepository.findById({ id: form.published });

  if (!formDraft) {
    return res.notFound("Form draft not found");
  }

  const activity = await activityRepository.findById({
    id: req.params.activity_id,
  });

  if (!activity) {
    return res.notFound("Activity not found");
  }

  const responseUseCases = new ResponseUseCases(
    formDraft,
    new BlobUploader(req.user.id),
    userRepository
  );

  await responseUseCases.processFormFields(rest).catch((err) => {
    return res.badRequest(err);
  });

  const activeInteraction = activity.interactions.findIndex(
    (interaction) => !interaction.finished
  );

  if (activeInteraction === -1) {
    return res.badRequest("No active interaction");
  }

  const interaction = activity.interactions[activeInteraction];

  const myAnswer = interaction.answers.findIndex(
    (answer) => String(answer.user._id) === String(req.user.id)
  );

  if (myAnswer === -1) {
    return res.badRequest("You already answered this interaction");
  }

  interaction.answers[myAnswer].data = formDraft.toObject();
  interaction.answers[myAnswer].status = IActivityStepStatus.finished;

  const isAllAnswered = interaction.answers.every(
    (answer) => answer.status === IActivityStepStatus.finished
  );

  if (isAllAnswered) {
    interaction.finished = true;

    sendToQueue({
      context,
      message: {
        activity_id: activity._id.toString(),
        activity_workflow_id: interaction.activity_workflow_id.toString(),
        activity_step_id: interaction.activity_step_id.toString(),
        client: conn.name,
      },
      queueName: "interaction_process",
    });
  }

  activity.save();

  return res.created(activity);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object().shape({
      form_id: schema.string().required(),
      activity_id: schema.string().required(),
    }),
    body: schema.object().shape({}),
  }))
  .configure({
    name: "ResponseInteraction",
    options: {
      methods: ["POST"],
      route: "response/{form_id}/interaction/{activity_id}",
      extraOutputs: [extraOutputsInteractionProcess],
    },
  });
