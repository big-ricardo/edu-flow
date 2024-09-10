import Http, { HttpHandler } from "../../../middlewares/http";
import res from "../../../utils/apiResponse";
import { IForm } from "../../../models/client/Form";
import moment from "moment";
import FormRepository from "../../../repositories/Form";

const handler: HttpHandler = async (conn, req) => {
  const { id } = req.params;
  const { period, ...formData } = req.body as IForm;

  const formRepository = new FormRepository(conn);

  const form = await formRepository.findByIdAndUpdate({
    id,
    data: {
      ...formData,
      period: {
        open: period.open ? moment.utc(period.open).toDate() : null,
        close: period.close ? moment.utc(period.close).toDate() : null,
      },
    },
  });

  form.save();

  return res.created(form);
};

export default new Http(handler)
  .setSchemaValidator((schema) => ({
    params: schema.object({
      id: schema.string().required(),
    }),
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
        open: schema.date().required().nullable(),
        close: schema.date().required().nullable(),
      }),
      active: schema.boolean().required().default(true),
      workflow: schema.string().when("type", ([type], schema) => {
        if (type === "created") {
          return schema.required();
        }
        return schema.nullable().default(null);
      }),
      description: schema.string().optional().nullable().default(""),
      published: schema.string().optional().nullable().default(null),
      institute: schema.string().nullable().default(null),
      pre_requisites: schema.object().shape({
        form: schema.string().nullable().default(null),
        status: schema.string().nullable().default(null),
      }),
    }),
  }))
  .configure({
    name: "FormUpdate",
    permission: "form.update",
    options: {
      methods: ["PUT"],
      route: "form/{id}",
    },
  });
