import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import AnswerRepository from "../../../repositories/Answer";

const handler: HttpHandler = async (conn, req) => {
  const { form_id, activity_id } = req.params as { form_id: string, activity_id?: string };

  const answerRepository = new AnswerRepository(conn);

  const answer = await answerRepository.findOne({
    where: {
      user: req.user.id,
      form: form_id,
      submitted: false,
      activity: activity_id ?? null,
    },
  })

  return res.success(answer);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      form_id: schema.string().required(),
      activity_id: schema.string().optional().nullable(),
    }),
  }))
  .configure({
    name: "AnswerDraftShow",
    permission: "answer.read",
    options: {
      methods: ["GET"],
      route: "form/{form_id}/answer/{activity_id?}",
    },
  });
