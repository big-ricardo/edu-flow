import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Activity from "../../../models/client/Activity";
import User, { IUser, IUserRoles } from "../../../models/client/User";
import ActivityRepository from "../../../repositories/Activity";

const handler: HttpHandler = async (conn, req) => {
  const { id, evaluation_id } = req.params as {
    id: string;
    evaluation_id: string;
  };
  const { users: usersForm } = req.body as {
    users: Pick<IUser, "_id" | "isExternal" | "email">[];
  };

  const activityRepository = new ActivityRepository(conn);

  const activity = await activityRepository.findById({
    id,
  });

  if (!activity) return res.notFound("Atividade não encontrada");

  const evaluation = activity.evaluations.id(evaluation_id);

  if (!evaluation) return res.notFound("Avaliação não encontrada");

  const users = await Promise.all(
    usersForm.map(async (sub) => {
      if (sub.isExternal) {
        const externalUser = await new User(conn).model().findOne({
          email: sub.email,
        });
        if (!externalUser) {
          const newUser = await new User(conn).model().create({
            ...sub,
            roles: [IUserRoles.teacher],
            password: "password",
            isExternal: true,
          });

          return newUser.toObject();
        }

        return externalUser.toObject();
      }

      const user = await new User(conn).model().findById(sub._id).select({
        password: 0,
      });

      return user.toObject();
    })
  );

  users.forEach((user) => {
    evaluation.answers.push({
      user: user,
      data: null,
      status: "idle",
    });
  });
  evaluation.not_defined_board = false;
  await activity.save();

  return res.success(activity.toObject());
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      id: schema.string().required(),
      evaluation_id: schema.string().required(),
    }),
    body: schema.object({
      users: schema.array(
        schema.object({
          _id: schema.string().optional(),
          isExternal: schema.boolean().required(),
          email: schema.string().optional(),
        })
      ),
    }),
  }))
  .configure({
    name: "ActivityBoardDefinition",
    permission: "activity.board-definition",
    options: {
      methods: ["PUT"],
      route: "activity/{id}/board-definition/{evaluation_id}",
    },
  });
