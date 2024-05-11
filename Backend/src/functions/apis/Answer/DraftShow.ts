import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import AnswerRepository from "../../../repositories/Answer";

const handler: HttpHandler = async (conn, req) => {
  const { form_id } = req.params as { form_id: string };

  const answerRepository = new AnswerRepository(conn);

  const answer = await answerRepository.findOne({
    where: {
      form: form_id,
      submitted: false,
    },
  })

  return res.success(answer);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      form_id: schema.string().required(),
    }),
  }))
  .configure({
    name: "AnswerDraftShow",
    permission: "answer.read",
    options: {
      methods: ["GET"],
      route: "form/{form_id}/answer",
    },
  });
