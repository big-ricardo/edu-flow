import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import ActivityRepository from "../../../repositories/Activity";
import FilterQueryBuilder, {
  WhereEnum,
} from "../../../utils/filterQueryBuilder";
import { IUserRoles } from "../../../models/client/User";

interface Query {
  page?: number;
  limit?: number;
  name?: string;
  protocol?: string;
  status?: string;
  finished_at?: boolean;
}

const filterQueryBuilder = new FilterQueryBuilder(
  {
    name: WhereEnum.ILIKE,
    status: {
      type: WhereEnum.ILIKE,
      alias: "status.name",
    },
    protocol: WhereEnum.ILIKE,
    finished_at: WhereEnum.CUSTOM,
  },
  {
    finished_at: (value) => ({
      $ne: value === "true" ? null : undefined,
    }),
  }
);

const handler: HttpHandler = async (conn, req) => {
  const { page = 1, limit = 10, ...filters } = req.query as Query;
  const isAdmin = req.user.roles.includes(IUserRoles.admin);

  const activityRepository = new ActivityRepository(conn);

  const where = filterQueryBuilder.build(filters);

  console.log("where", where);

  const activities = await activityRepository.find({
    skip: (page - 1) * limit,
    where: isAdmin
      ? where
      : {
          ...where,
          $and: [
            {
              $or: [
                {
                  "users._id": req.user.id,
                },
                {
                  "sub_masterminds._id": req.user.id,
                },
                {
                  "masterminds.user._id": req.user.id,
                },
              ],
            },
          ],
        },
    limit,
    select: {
      name: 1,
      protocol: 1,
      status: 1,
      users: 1,
    },
  });

  const total = await activityRepository.count({ where });
  const totalPages = Math.ceil(total / limit);

  return res.success({
    activities,
    pagination: {
      page: Number(page),
      total,
      totalPages,
      count: activities.length + (page - 1) * limit,
    },
  });
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    query: schema
      .object({
        page: schema
          .number()
          .optional()
          .transform((v) => Number(v))
          .default(1)
          .min(1),
        limit: schema
          .number()
          .optional()
          .transform((v) => Number(v)),
        name: schema.string().min(3).max(255).optional().default(undefined),
        status: schema.string().min(3).max(255).optional().default(undefined),
        protocol: schema.string().min(3).max(255).optional().default(undefined),
        finished: schema.boolean().optional().default(false),
      })
      .optional(),
  }))
  .configure({
    name: "ActivityList",
    permission: "activity.view",
    options: {
      methods: ["GET"],
      route: "activities",
    },
  });
