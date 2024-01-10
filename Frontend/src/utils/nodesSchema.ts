import { NodeTypes } from "@interfaces/Workflow";
import { z } from "zod";

type NodeSchemas = {
  [K in NodeTypes]: z.ZodType;
};

const schemas: NodeSchemas = {
  [NodeTypes.SendEmail]: z.object({
    name: z.string().min(3, { message: "Nome é obrigatório" }),
    email: z.string().min(3, { message: "Selecione um template de email" }),
    to: z
      .array(z.string())
      .min(1, { message: "Selecione peo menos 1 destinatario" }),
    visible: z.boolean().default(true),
  }),
  [NodeTypes.ChangeStatus]: z.object({
    name: z.string().min(3, { message: "Nome é obrigatório" }),
    status: z.string().min(3, { message: "Selecione um status" }),
    visible: z.boolean().default(true),
  }),
  [NodeTypes.Circle]: z.object({
    name: z.string().min(3, { message: "Nome é obrigatório" }),
    active: z.boolean().default(true),
    visible: z.boolean().default(false),
  }),
};

export type SchemaTypes = keyof typeof schemas;

export type BlockFormInputs = {
  [K in SchemaTypes]: z.infer<(typeof schemas)[K]>;
}[SchemaTypes];

export default schemas;
