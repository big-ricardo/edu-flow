import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import ActivityRepository from "../../../repositories/Activity";
import FilterQueryBuilder, {
  WhereEnum,
} from "../../../utils/filterQueryBuilder";
import FormRepository from "../../../repositories/Form";
import { ObjectId } from "mongoose";

interface Query {
  page?: number;
  limit?: number;
  name?: string;
  protocol?: string;
  status?: string;
  form?: string | ObjectId;
  date_type?: "createdAt" | "finished_at";
  start_date?: string;
  end_date?: string;
}

const filterQueryBuilder = new FilterQueryBuilder(
  {
    name: WhereEnum.ILIKE,
    status: {
      type: WhereEnum.ILIKE,
      alias: "status.name",
    },
    protocol: WhereEnum.ILIKE,
    createdAt: WhereEnum.CUSTOM,
    finished_at: WhereEnum.CUSTOM,
    form: {
      type: WhereEnum.EQUAL,
      alias: "form",
    },
  },
  {
    createdAt: (value) => ({
      $gte: new Date(value.split(",")[0]),
      $lte: value.split(",")[1] ? new Date(value.split(",")[1]) : new Date(),
    }),
    finished_at: (value) => ({
      $gte: value ? new Date(value.split(",")[0]) : null,
      $lte: value.split(",")[1] ? new Date(value.split(",")[1]) : new Date(),
    }),
  }
);

const handler: HttpHandler = async (conn, req) => {
  const {
    page = 1,
    limit = 10,
    date_type,
    start_date,
    end_date,
    ...filters
  } = req.query as Query;

  if (filters?.form) {
    const formRepository = new FormRepository(conn);
    const form = await formRepository.findById({
      id: filters.form,
      select: {
        name: 1,
      },
    });

    if (!form) {
      return res.notFound("Form does not exist");
    }

    filters.form = form._id;
  }

  const activityRepository = new ActivityRepository(conn);
  const where = filterQueryBuilder.build({
    ...filters,
    ...(date_type &&
      start_date &&
      end_date && {
        [date_type]: `${start_date},${end_date}`,
      }),
  });

  console.log(where);

  const activitiesPromise = activityRepository.find({
    skip: (page - 1) * limit,
    where,
    limit,
    select: {
      name: 1,
      protocol: 1,
      status: 1,
      users: 1,
      form: 1,
      createdAt: 1,
      finished_at: 1,
    },
  });

  // Dados extras para o dashboard
  const statusCountsPromise = activityRepository.aggregate([
    { $match: where },
    { $group: { _id: "$status.name", count: { $sum: 1 } } },
  ]);

  const formTypeCountsPromise = activityRepository.aggregate([
    { $match: where },
    {
      $lookup: {
        from: "forms",
        localField: "form",
        foreignField: "_id",
        as: "form",
      },
    },
    { $unwind: "$form" },
    { $group: { _id: "$form.name", count: { $sum: 1 } } },
  ]);

  const openActivitiesCountPromise = activityRepository.count({
    where: {
      ...where,
      finished_at: {
        $eq: null,
      },
    },
  });

  // Contagem de atividades fechadas (finished_at != null)
  const closedActivitiesCountPromise = activityRepository.count({
    where: {
      ...where,
      finished_at: { $ne: null },
    },
  });

  const countByMastermindPromise = await activityRepository.aggregate([
    { $match: where },
    // Desestrutura a array de masterminds
    { $unwind: "$masterminds" },

    // Agrupa por mastermind e status
    {
      $group: {
        _id: {
          mastermind: "$masterminds.user._id", // ID do mastermind
          status: "$status.name", // Nome do status
        },
        count: { $sum: 1 }, // Conta o número de atividades
      },
    },

    // Opção para pegar mais detalhes do mastermind, como nome e email
    {
      $lookup: {
        from: "users", // Nome da collection de usuários
        localField: "_id.mastermind",
        foreignField: "_id",
        as: "mastermindDetails",
      },
    },

    // Desestrutura o array de mastermindDetails
    { $unwind: "$mastermindDetails" },

    // Formata a saída para exibir o nome do mastermind e o status
    {
      $project: {
        _id: 0,
        mastermindId: "$_id.mastermind",
        mastermindName: "$mastermindDetails.name",
        status: "$_id.status",
        count: 1,
      },
    },
  ]);

  const [
    activities,
    statusCounts,
    formTypeCounts,
    openActivitiesCount,
    closedActivitiesCount,
    countByMastermind,
  ] = await Promise.all([
    activitiesPromise,
    statusCountsPromise,
    formTypeCountsPromise,
    openActivitiesCountPromise,
    closedActivitiesCountPromise,
    countByMastermindPromise,
  ]);

  const total = await activityRepository.count({ where });
  const totalPages = Math.ceil(total / limit);

  return res.success({
    activities,
    statusCounts,
    formTypeCounts,
    openActivitiesCount,
    closedActivitiesCount,
    countByMastermind,
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
        page: schema.number().optional().default(1).min(1),
        limit: schema.number().optional(),
        name: schema.string().min(3).max(255).optional(),
        status: schema.string().min(3).max(255).optional(),
        protocol: schema.string().min(3).max(255).optional(),
        form: schema.string().optional(),
        date_type: schema
          .mixed()
          .oneOf(["createdAt", "finished_at"])
          .optional(),
        start_date: schema.string().optional(),
        end_date: schema.string().optional(),
      })
      .optional(),
  }))
  .configure({
    name: "ActivityDashboard",
    permission: "activity.view",
    options: {
      methods: ["GET"],
      route: "activities/dashboard",
    },
  });
