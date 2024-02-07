import { NodeTypes } from "@interfaces/Workflow";
import { z } from "zod";

type NodeSchemas = {
  [K in NodeTypes]: z.ZodType;
};

const schemas: NodeSchemas = {
  [NodeTypes.SendEmail]: z.object({
    name: z.string().min(3, { message: "Nome é obrigatório" }),
    email_id: z.string().min(3, { message: "Selecione um template de email" }),
    to: z
      .array(z.string())
      .min(1, { message: "Selecione pelo menos 1 destinatario" }),
    visible: z.boolean().default(true),
  }),
  [NodeTypes.ChangeStatus]: z.object({
    name: z.string().min(3, { message: "Nome é obrigatório" }),
    status_id: z.string().min(3, { message: "Selecione um status" }),
    visible: z.boolean().default(true),
  }),
  [NodeTypes.Circle]: z.object({
    name: z.string().min(3, { message: "Nome é obrigatório" }),
    active: z.boolean().default(true),
    visible: z.boolean().default(false),
  }),
  [NodeTypes.SwapWorkflow]: z.object({
    name: z.string().min(3, { message: "Nome é obrigatório" }),
    workflow_id: z.string().min(3, { message: "Selecione um workflow" }),
    visible: z.boolean().default(false),
  }),
  [NodeTypes.Interaction]: z.object({
    name: z.string().min(3, { message: "Nome é obrigatório" }),
    to: z.string().min(1, { message: "Selecione pelo menos 1 destinatario" }),
    form_id: z.string().min(1, { message: "Selecione um formulário" }),
    visible: z.boolean().default(true),
  }),
  [NodeTypes.Evaluated]: z
    .object({
      name: z.string().min(3, { message: "Nome é obrigatório" }),
      form_id: z.string().min(3, { message: "Selecione um formulário" }),
      visible: z.boolean().default(true),
      isDeferred: z.boolean().default(true),
      average: z.coerce
        .number()
        .min(0, { message: "Avaliação mínima é 0" })
        .max(10, { message: "Avaliação máxima é 10" }),
      to: z.array(z.string()).optional(),
    })
    .refine(
      (data) => {
        if (data.isDeferred === false) {
          return !!data.to?.length;
        }
        return true;
      },
      {
        message: "É necessário selecionar pelo menos um destinatário",
        path: ["to"],
      }
    ),
};

export type SchemaTypes = keyof typeof schemas;

export type BlockFormInputs = {
  [K in SchemaTypes]: z.infer<(typeof schemas)[K]>;
}[SchemaTypes];

export default schemas;

export const validateNode = (type: NodeTypes, data: BlockFormInputs) => {
  const schema = schemas[type];

  return schema.safeParse(data).success;
};
