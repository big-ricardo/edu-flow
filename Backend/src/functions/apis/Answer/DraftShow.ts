import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import AnswerRepository from "../../../repositories/Answer";

const handler: HttpHandler = async (conn, req) => {
  const { form_id } = req.params as { form_id: string };

  const answerRepository = new AnswerRepository(conn);

  const answer = (await answerRepository.find({
    where: {
      form: form_id,
      submitted: false,
    },
  })).at(0);

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
    options: {
      methods: ["GET"],
      route: "form/{form_id}/answer",
    },
  });
