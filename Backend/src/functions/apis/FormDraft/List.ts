import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import FormDraft from "../../../models/FormDraft";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params;

  const forms = await new FormDraft(conn)
    .model()
    .find({ parent: id })
    .populate("owner", {
      name: 1,
      _id: 1,
    })
    .select({
      name: 1,
      status: 1,
      version: 1,
      createdAt: 1,
    })
    .sort({ createdAt: -1 });

  return res.success({
    forms,
  });
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      id: schema.string().required(),
    }),
  }))
  .configure({
    name: "FormsDraftList",
    options: {
      methods: ["GET"],
      route: "form-drafts/{id}",
    },
  });
