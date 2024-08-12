import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import { ObjectId, Types } from "mongoose";
import {
  extraOutputsEvaluationProcess,
  sendToQueue,
} from "../../../utils/sbusOutputs";
import FormRepository from "../../../repositories/Form";
import FormDraftRepository from "../../../repositories/FormDraft";
import ActivityRepository from "../../../repositories/Activity";
import { IFormType } from "../../../models/client/Form";
import { IActivityStepStatus } from "../../../models/client/Activity";
import UserRepository from "../../../repositories/User";
import BlobUploader from "../../../services/upload";
import AnswerRepository from "../../../repositories/Answer";
import ResponseUseCases from "../../../use-cases/Response";

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

const WEIGHT = 10;

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
        type: IFormType.Evaluated,
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

  await responseUseCases.processFormFields(rest);

  const activeEvaluation = activity.evaluations.findIndex(
    (evaluation) => !evaluation.finished
  );

  if (activeEvaluation === -1) {
    return res.badRequest("No active evaluation");
  }

  const evaluation = activity.evaluations[activeEvaluation];

  const myAnswer = evaluation.answers.findIndex(
    (answer) => String(answer.user._id) === String(req.user.id)
  );

  if (myAnswer === -1) {
    return res.badRequest("You already answered this interaction");
  }

  const grade = responseUseCases.getGrade() / WEIGHT;

  evaluation.answers[myAnswer].data = formDraft.toObject();
  evaluation.answers[myAnswer].status = IActivityStepStatus.finished;
  evaluation.answers[myAnswer].grade = parseFloat(grade.toFixed(2));

  const isAllAnswered = evaluation.answers.every(
    (answer) => answer.status === IActivityStepStatus.finished
  );

  if (isAllAnswered) {
    sendToQueue({
      context,
      message: {
        activity_id: activity._id.toString(),
        activity_workflow_id: evaluation.activity_workflow_id.toString(),
        activity_step_id: evaluation.activity_step_id.toString(),
        client: conn.name,
      },
      queueName: "evaluation_process",
    });
  }

  const answerRepository = new AnswerRepository(conn);

  await answerRepository.updateMany({
    where: {
      form: form._id,
      user: req.user.id,
    },
    data: {
      submitted: true,
    },
  });

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
    name: "ResponseEvaluation",
    permission: "response.create",
    options: {
      methods: ["POST"],
      route: "response/{form_id}/evaluated/{activity_id}",
      extraOutputs: [extraOutputsEvaluationProcess],
    },
  });
