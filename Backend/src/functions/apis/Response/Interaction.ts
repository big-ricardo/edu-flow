import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Activity, {
  IActivityAccepted,
  IActivityStepStatus,
} from "../../../models/client/Activity";
import Form from "../../../models/client/Form";
import FormDraft, {
  FieldTypes,
  IValue,
} from "../../../models/client/FormDraft";
import moment from "moment";
import uploadFileToBlob, { FileUploaded } from "../../../services/upload";
import User, { IUserRoles } from "../../../models/client/User";
import Status from "../../../models/client/Status";
import { ObjectId } from "mongoose";
import { Types } from "mongoose";
import { NodeTypes } from "../../../models/client/WorkflowDraft";
import { setHeapSnapshotNearHeapLimit } from "v8";
import sendNextQueue from "../../../utils/sendNextQueue";
import {
  extraOutputsInteractionProcess,
  sendToQueue,
} from "../../../utils/sbusOutputs";

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

  const form = await new Form(conn)
    .model()
    .findOne({
      _id: req.params.form_id,
      active: true,
      published: { $exists: true },

      $and: [
        {
          $or: [
            {
              "period.open": null,
            },
            {
              $and: [
                {
                  "period.open": {
                    $lte: moment.utc().toDate(),
                  },
                },
                {
                  "period.close": {
                    $gte: moment.utc().toDate(),
                  },
                },
              ],
            },
          ],
        },
      ],
    })
    .select({
      initial_status: 1,
      published: 1,
    });

  if (!form) {
    return res.notFound("Form not found");
  }

  const formDraft = await new FormDraft(conn).model().findById(form.published);

  if (!formDraft) {
    return res.notFound("Form draft not found");
  }

  const activity = await new Activity(conn)
    .model()
    .findById(req.params.activity_id);

  if (!activity) {
    return res.notFound("Activity not found");
  }

  for (const field of formDraft.fields) {
    let value = rest[field.id];
    let mapped: IValue = null;

    if (!value || (Array.isArray(value) && !value.length)) {
      field.value = value;
      continue;
    }

    if (field.type === FieldTypes.File && typeof value === "object") {
      const file: File = value as File;

      const uploaded = await uploadFileToBlob(
        req.user.id,
        file?.name,
        file?.mimeType,
        file?.base64
      ).catch((err) => {
        throw err;
      });

      if (!uploaded) {
        return res.badRequest("Error on upload file");
      }

      mapped = uploaded;
    }

    if (field.type === FieldTypes.Teacher && Array.isArray(value)) {
      const teachers = await new User(conn)
        .model()
        .find({
          _id: {
            $in: value.map((val) => val?._id).filter((val) => val),
          },
        })
        .select({
          password: 0,
        });

      mapped = value.map((val) => {
        if (typeof val === "string") {
          return teachers.find((teacher) => String(teacher._id) === val);
        }

        if (typeof val === "object") {
          if (val?._id) {
            return teachers.find((teacher) => String(teacher._id) === val._id);
          }

          return {
            ...val,
            isExternal: true,
            _id: new Types.ObjectId(),
          };
        }
      });
    }

    field.value = mapped || value;
  }

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
