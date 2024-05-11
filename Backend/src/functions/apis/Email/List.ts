import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Email from "../../../models/client/Email";
import EmailRepository from "../../../repositories/Email";

interface Query {
  page?: number;
  limit?: number;
}

export const handler: HttpHandler = async (conn, req, context) => {
  const { page = 1, limit = 10 } = req.query as Query;
  const emailRepository = new EmailRepository(conn);

  const emails = await emailRepository.find({
    skip: (page - 1) * limit,
    limit,
  });

  const total = await new Email(conn).model().countDocuments();
  const totalPages = Math.ceil(total / limit);

  return res.success({
    emails,
    pagination: {
      page: Number(page),
      total,
      totalPages,
      count: emails.length + (page - 1) * limit,
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
      })
      .optional(),
  }))
  .configure({
    name: "EmailList",
    permission: "email.update",
    options: {
      methods: ["GET"],
      route: "emails",
    },
  });
