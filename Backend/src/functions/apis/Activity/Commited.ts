import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Activity, { IActivityState } from "../../../models/Activity";
import User from "../../../models/User";
import mongoose from "mongoose";

interface IActivityUpdate {
  name: string;
  description: string;
  users: string[];
  masterminds: string[];
  sub_masterminds: string[];
}

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };

  const activity = new Activity(conn).model();
  const user = new User(conn).model();

  const activityData = await activity.findById(id);

  if (!activityData) {
    return res.error(404, {}, "Activity not found");
  }

  const { name, description, users, masterminds, sub_masterminds } =
    req.body as IActivityUpdate;

  const teacher = await Promise.all(
    masterminds.map(async (mastermindId) => {
      if (!mongoose.Types.ObjectId.isValid(mastermindId)) {
        return false;
      }

      const userExists = await user.exists({
        _id: mastermindId,
        role: "teacher",
      });

      return userExists;
    }),
  );

  if (teacher.includes(false)) {
    return res.error(400, {}, "Invalid mastermind id");
  }

  const subMastermind = await Promise.all(
    sub_masterminds.map(async (subMastermindId) => {
      if (!mongoose.Types.ObjectId.isValid(subMastermindId)) {
        return false;
      }

      const userExists = await user.exists({
        _id: subMastermindId,
        role: "teacher",
      });

      return userExists;
    }),
  );

  if (subMastermind.includes(false)) {
    return res.error(400, {}, "Invalid sub mastermind id");
  }

  const userData = await user.find({ _id: { $in: users } });

  if (userData.length !== users.length) {
    return res.error(400, {}, "Invalid user id");
  }

  const activityUpdated = await activity.findByIdAndUpdate(
    id,
    {
      name,
      description,
      users,
      masterminds: masterminds.map((mastermind) => ({
        accepted: false,
        user: mastermind,
      })),
      sub_masterminds: sub_masterminds.map((subMastermind) => ({
        accepted: false,
        user: subMastermind,
      })),
      state: IActivityState.committed,
    },
    { new: true },
  );

  return res.success(activityUpdated);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      id: schema.string().required(),
    }),
    body: schema.object({
      name: schema.string().required(),
      description: schema.string().required(),
      users: schema.array(schema.string()).required(),
      masterminds: schema.array(schema.string()).required(),
      sub_masterminds: schema.array(schema.string()).required(),
    }),
  }))
  .configure({
    name: "ActivityCommitted",
    options: {
      methods: ["PUT"],
      route: "activity-committed/{id}",
    },
  });
