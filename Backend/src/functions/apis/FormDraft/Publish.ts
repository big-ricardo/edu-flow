import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import FormDraft, { IFormDraft } from "../../../models/FormDraft";
import Form from "../../../models/Form";

const handler: HttpHandler = async (conn, req) => {
  const { status } = req.body as Pick<IFormDraft, "status">;
  const { id } = req.params;

  const formDraft = await new FormDraft(conn).model().findByIdAndUpdate(
    id,
    {
      status,
    },
    { new: true }
  );

  await new FormDraft(conn).model().updateMany(
    { parent: formDraft.parent, _id: { $ne: formDraft._id } },
    {
      status: "draft",
    }
  );

  const form = await new Form(conn).model().findByIdAndUpdate(
    formDraft.parent,
    {
      published: formDraft._id,
    },
    { new: true }
  );

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
    options: {
      methods: ["PATCH"],
      route: "form-draft/{id}",
    },
  });
