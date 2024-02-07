import { z } from "zod";

const formsZodSchema = z
  .object({
    name: z.string().min(3, "Nome precisa ter pelo menos 3 caracteres"),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: "Slug inválido, utilize apenas letras e números e -",
      })
      .min(3, "Slug precisa ter pelo menos 3 caracteres"),
    status: z.enum(["draft", "published"]).default("draft"),
    initial_status: z.string().optional().nullable(),
    type: z.enum(["created", "interaction", "evaluated"]),
    workflow: z.string().optional().nullable(),
    period: z.object({
      open: z.string().nullable(),
      close: z.string().nullable(),
    }),
    description: z
      .string()
      .max(255, "O tamanho máximo é 255 caracteres")
      .min(3, "Minimo 3 letras"),
    refine: z.string().optional().nullable(),
    fields: z
      .array(
        z
          .object({
            id: z.string().min(3, "ID precisa ter pelo menos 3 caracteres"),
            label: z
              .string()
              .min(3, "Label precisa ter min 3 caracteres")
              .max(100, "Label precisa ter no máximo 100 caracteres"),
            placeholder: z.string().optional(),
            type: z.enum([
              "text",
              "number",
              "email",
              "password",
              "textarea",
              "checkbox",
              "radio",
              "select",
              "multiselect",
              "date",
              "file",
              "evaluated",
            ]),
            required: z.boolean().optional().default(false),
            value: z.string().optional().nullable(),
            visible: z.boolean().optional().default(true),
            system: z.boolean().optional().default(false),
            weight: z.coerce.number().min(1, "Peso mínimo é 1").max(10, "Peso máximo é 10").optional(),
            predefined: z
              .enum(["teachers", "students", "institutions"])
              .nullable()
              .default(null),
            options: z
              .array(
                z.object({
                  label: z
                    .string()
                    .min(3, "Label precisa ter pelo menos 3 caracteres"),
                  value: z
                    .string()
                    .min(3, "Valor precisa ter pelo menos 3 caracteres"),
                })
              )
              .nullable()
              .optional(),
          })
          .refine((data) => {
            if (data.type === "select" || data.type === "multiselect") {
              return !!data.options?.length;
            }
            return true;
          }, "É necessário adicionar pelo menos uma opção")
      )
      .nonempty("Crie pelo menor um campo"),
  })
  .refine(
    (data) => {
      if (data.type === "created") {
        return !!data.workflow;
      }
      return true;
    },
    {
      message: "É necessário selecionar um workflow",
      path: ["workflow"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "created") {
        return !!data.initial_status;
      }
      return true;
    },
    {
      message: "É necessário selecionar um status inicial",
      path: ["initial_status"],
    }
  )
  .refine(
    (data) => {
      const isEvaluation = data.type === "evaluated";

      if (!isEvaluation) return true;

      return data.fields.some((field) => field.type === "evaluated");
    },
    {
      message: "É necessário adicionar um campo de avaliação",
      path: ["fields"],
    }
  )
  .refine(
    (data) => {
      const isEvaluation = data.type === "evaluated";

      if (!isEvaluation) return true;

      const evaluatedFields = data.fields.filter(
        (field) => field.type === "evaluated"
      );

      return evaluatedFields.every((field) => field.weight);
    },
    {
      message: "É necessário adicionar um peso para cada campo de avaliação",
      path: ["fields"],
    }
  )
  .refine(
    (data) => {
      const isEvaluation = data.type === "evaluated";

      if (!isEvaluation) return true;

      const sum = data.fields.reduce((acc, field) => {
        if (field.type === "evaluated") {
          return field?.weight ? acc + field.weight : acc;
        }
        return acc;
      }, 0);

      return sum === 10;
    },
    {
      message: "É necessário que a soma dos pesos seja igual a 10",
      path: ["fields"],
    }
  );

export default formsZodSchema;

export type formFormSchema = z.infer<typeof formsZodSchema>;
