import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Answer from "../../../models/client/Answer";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };

  const form = await new Answer(conn).model().findById(id);

  if (!form) {
    return res.notFound("Answer not found");
  }

  return res.success(form);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      id: schema.string().required(),
    }),
  }))
  .configure({
    name: "AnswerShow",
    options: {
      methods: ["GET"],
      route: "answer/{id}",
    },
  });
