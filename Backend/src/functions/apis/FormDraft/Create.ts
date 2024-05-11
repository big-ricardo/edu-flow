import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import { FieldTypes, IFormDraft } from "../../../models/client/FormDraft";
import FormRepository from "../../../repositories/Form";
import FormDraftRepository from "../../../repositories/FormDraft";

const handler: HttpHandler = async (conn, req) => {
  const formData = req.body as IFormDraft;
  const { id } = req.params;

  const formRepository = new FormRepository(conn);
  const formDraftRepository = new FormDraftRepository(conn);

  const form = await formRepository.findOne({
    where: {
      _id: id,
    },
  });

  if (!form) {
    return res.notFound("Form not found");
  }

  const newVersion = await formDraftRepository.count({
    parent: id,
  });

  const formDraft = await formDraftRepository.create({
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
          describe: schema.string().nullable().optional(),
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
          validation: schema.object().shape({
            min: schema.number().nullable().optional(),
            max: schema.number().nullable().optional(),
            pattern: schema.string().nullable().optional(),
          }),
        })
      ),
    }),
  }))
  .configure({
    name: "FormDraftCreate",
    permission: "formDraft.create",
    options: {
      methods: ["POST"],
      route: "form-draft/{id}",
    },
  });
