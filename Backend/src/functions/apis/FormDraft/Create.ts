import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import FormDraft, {
  FieldTypes,
  IFormDraft,
  IFormStatus,
} from "../../../models/FormDraft";
import Form from "../../../models/Form";

const handler: HttpHandler = async (conn, req) => {
  const formData = req.body as IFormDraft;
  const { id } = req.params;

  const form = await new Form(conn).model().exists({ _id: id });

  if (!form) {
    return res.notFound("Form not found");
  }

  const newVersion = await new FormDraft(conn).model().countDocuments({
    parent: id,
  });

  const formDraft = await new FormDraft(conn).model().create({
    ...formData,
    parent: id,
    owner: req.user.id,
    version: newVersion + 1,
  });

  formDraft.save();

  return res.created(formDraft);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      id: schema.string().required(),
    }),
    body: schema.object().shape({
      status: schema.string().required().oneOf(Object.values(IFormStatus)),
      fields: schema.array().of(
        schema.object().shape({
          id: schema
            .string()
            .required()
            .matches(/(\{\{[a-z]+\.[a-z]+\}\})|([a-z]+(?:-[a-z]+)*)|([a-z]+)/),
          type: schema.string().required().oneOf(Object.values(FieldTypes)),
          value: schema.string().nullable(),
          visible: schema.boolean().default(true),
          required: schema.boolean().required(),
          options: schema
            .array()
            .of(
              schema.object().shape({
                label: schema.string().required(),
                value: schema.string().required(),
              })
            )
            .when("type", ([type], schema) => {
              if (["select", "radio", "checkbox"].includes(type)) {
                return schema.required(
                  "options is required for select, radio and checkbox fields"
                );
              }
              return schema.nullable().default(null);
            }),
        })
      ),
    }),
  }))
  .configure({
    name: "FormDraftCreate",
    options: {
      methods: ["POST"],
      route: "form-draft/{id}",
    },
  });
