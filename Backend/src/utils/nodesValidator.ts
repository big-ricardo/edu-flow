import { NodeTypes } from "../models/Workflow";

const nodeValidator = (type: string, schema: typeof import("yup")) => {
  if (type === NodeTypes.SendEmail) {
    return schema.object().shape({
      to: schema.array().of(schema.string()).required(),
      visible: schema.boolean().required(),
      name: schema.string().required(),
      email: schema.string().required(),
    });
  }
  if (type === NodeTypes.ChangeStatus) {
    return schema.object().shape({
      status: schema.string().required(),
    });
  }

  if (type === NodeTypes.Circle) {
    return schema.object().shape({
      name: schema.string().required(),
      visible: schema.boolean().required(),
      active: schema.boolean(),
    });
  }

  if (type === "request_answer") {
    return schema.object().shape({
      form_id: schema.string().required(),
      answers: schema.array().of(schema.string()).required(),
      fieldForm: schema
        .array()
        .of(
          schema.object().shape({
            form_id: schema.string().required(),
            field_id: schema.string().required().nullable(),
          })
        )
        .required()
        .nullable(),
    });
  }
};

export default nodeValidator;
