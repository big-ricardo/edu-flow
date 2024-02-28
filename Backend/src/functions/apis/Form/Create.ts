import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import Form, { IForm } from "../../../models/Form";
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
      active: schema.boolean().default(true),
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
      description: schema.string().optional().nullable().default(""),
      published: schema.string().optional().nullable().default(null),
    }),
  }))
  .configure({
    name: "FormCreate",
    options: {
      methods: ["POST"],
      route: "form",
    },
  });
