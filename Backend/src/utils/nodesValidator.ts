import { NodeTypes } from "../models/client/WorkflowDraft";

const nodeValidator = (type: string, schema: typeof import("yup")) => {
  if (type === NodeTypes.SendEmail) {
    return schema.object().shape({
      to: schema.array().of(schema.string()).required(),
      name: schema.string().required(),
      email_id: schema.string().required(),
      visible: schema.boolean().required(),
    });
  }
  if (type === NodeTypes.ChangeStatus) {
    return schema.object().shape({
      name: schema.string().required(),
      status_id: schema.string().required(),
      visible: schema.boolean().required(),
    });
  }

  if (type === NodeTypes.SwapWorkflow) {
    return schema.object().shape({
      name: schema.string().required(),
      workflow_id: schema.string().required(),
      visible: schema.boolean().required(),
    });
  }

  if (type === NodeTypes.Interaction) {
    return schema.object().shape({
      name: schema.string().required(),
      form_id: schema.string().required(),
      to: schema.string().required(),
      visible: schema.boolean().required(),
    });
  }
};

export default nodeValidator;
