import { z } from "zod";

const formsZodSchema = z
  .object({
    status: z.enum(["draft", "published"]).default("draft"),
    type: z.enum(["created", "interaction", "evaluated"]),
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
            weight: z.coerce
              .number()
              .min(1, "Peso mínimo é 1")
              .max(10, "Peso máximo é 10")
              .optional(),
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
              if (data.predefined) return true;

              return !!data.options?.length;
            }
            return true;
          }, "É necessário adicionar pelo menos uma opção")
      )
      .nonempty("Crie pelo menor um campo"),
  })
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
