import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import moment from "moment";
import FormRepository from "../../../repositories/Form";
import { IForm } from "../../../models/client/Form";

const handler: HttpHandler = async (conn, req) => {
  const { period, ...formData } = req.body as IForm;

  const formRepository = new FormRepository(conn);

  const form = await formRepository.create({
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
      institute: schema.string().nullable().default(null),
    }),
  }))
  .configure({
    name: "FormCreate",
    permission: "form.create",
    options: {
      methods: ["POST"],
      route: "form",
    },
  });
