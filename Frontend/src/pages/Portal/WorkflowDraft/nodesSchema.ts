import { NodeTypes } from "@interfaces/WorkflowDraft";
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
    conditional: z
      .array(
        z.object({
          field: z.string().min(1, { message: "Selecione um campo" }),
          value: z.string().min(1, { message: "Valor é obrigatório" }),
          operator: z.enum(["==", "!=", ">", "<", ">=", "<="]),
        })
      )
      .optional(),
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
      notUseGrade: z.boolean().default(true),
      weight: z.coerce
        .number()
        .min(0, { message: "Peso mínimo é 0" })
        .max(100, { message: "Peso máximo é 100" }),
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

export const workflowSchema = z.object({
  edges: z.array(
    z.object({
      id: z.string(),
      source: z.string(),
      target: z.string(),
      sourceHandle: z.enum(["default-source", "alternative-source"]),
    })
  ),
  nodes: z.array(
    z.object({
      id: z.string(),
      type: z
        .enum([
          "send_email",
          "change_status",
          "circle",
          "swap_workflow",
          "interaction",
          "evaluated",
        ])
        .optional(),
      data: z.union([
        schemas[NodeTypes.SendEmail],
        schemas[NodeTypes.ChangeStatus],
        schemas[NodeTypes.Circle],
        schemas[NodeTypes.SwapWorkflow],
        schemas[NodeTypes.Interaction],
        schemas[NodeTypes.Evaluated],
      ]),
      position: z.object({ x: z.number(), y: z.number() }),
      deletable: z.boolean().optional(),
    })
  ),
});

export type WorkflowFormInputs = z.infer<typeof workflowSchema>;
