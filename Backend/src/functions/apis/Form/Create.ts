import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Form, { FieldTypes, IForm } from "../../../models/Form";
import moment from "moment";

const handler: HttpHandler = async (conn, req) => {
  const { period, ...formData } = req.body as IForm;

  const form = await new Form(conn).model().create({
    ...formData,
    period: {
      open: period.open ? moment.utc(period.open).toDate() : null,
      close: period.close ? moment.utc(period.close).toDate() : null,
    },
  });

  form.save();

  return res.created(form);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    body: schema.object().shape({
      name: schema.string().required().min(3).max(255),
      slug: schema
        .string()
        .required()
        .min(3)
        .max(30)
        .matches(/^[a-z0-9-]+$/),
      type: schema
        .string()
        .required()
        .oneOf(["created", "interaction", "evaluated"]),
      initial_status: schema.string().when("type", ([type], schema) => {
        if (type === "created") {
          return schema.required();
        }
        return schema.nullable().default(null);
      }),
      period: schema.object().shape({
        open: schema.string().optional().nullable(),
        close: schema.string().when("period.open", ([open], schema) => {
          if (open) {
            return schema.required();
          }
          return schema.nullable().default(null);
        }),
      }),
      workflow: schema.string().when("type", ([type], schema) => {
        if (type === "created") {
          return schema.required();
        }
        return schema.nullable().default(null);
      }),
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
    name: "FormCreate",
    options: {
      methods: ["POST"],
      route: "form",
    },
  });
