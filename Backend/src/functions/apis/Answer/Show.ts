import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import AnswerRepository from "../../../repositories/Answer";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params as { id: string };

  const answerRepository = new AnswerRepository(conn);

  const form = await answerRepository.findById({ id });

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
    permission: "answer.read",
    options: {
      methods: ["GET"],
      route: "answer/{id}",
    },
  });
