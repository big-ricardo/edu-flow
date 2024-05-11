import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import FormRepository from "../../../repositories/Form";
import FormDraftRepository from "../../../repositories/FormDraft";
import { IFormDraft } from "../../../models/client/FormDraft";

const handler: HttpHandler = async (conn, req) => {
  const { status } = req.body as Pick<IFormDraft, "status">;
  const { id } = req.params;

  const formDraftRepository = new FormDraftRepository(conn);
  const formRepository = new FormRepository(conn);

  const formDraft = await formDraftRepository.findByIdAndUpdate({
    id,
    data: {
      status,
    },
  });

  await formDraftRepository.updateMany({
    where: { parent: formDraft.parent, _id: { $ne: formDraft._id } },
    data: {
      status: "draft",
    },
  });

  const form = await formRepository.findByIdAndUpdate({
    id: formDraft.parent,
    data: {
      published: formDraft._id,
    },
  });

  formDraft.save();
  form.save();

  return res.created(formDraft);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object().shape({
      id: schema.string().required(),
    }),
    body: schema.object().shape({
      status: schema.string().oneOf(["draft", "published"]).optional(),
    }),
  }))
  .configure({
    name: "FormPublish",
    permission: "formDraft.publish",
    options: {
      methods: ["PATCH"],
      route: "form-draft/{id}",
    },
  });
