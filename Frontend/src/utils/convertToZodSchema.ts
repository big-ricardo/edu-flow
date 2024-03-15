import { z } from "zod";
import { IField } from "@interfaces/FormDraft";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

async function getBase64(file: File) {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

//@ts-ignore
export default function convertToZodSchema(fields: IField[]): z.ZodObject<any> {
  const schemaObject: {
    [key: string]: ReturnType<
      | typeof z.string
      | typeof z.number
      | typeof z.date
      | typeof z.array
      | typeof z.any
      | typeof z.boolean
    >;
  } = {};

  fields.forEach((field) => {
    //@ts-ignore
    let fieldSchema: z.ZodType<any, any, any>;

    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "textarea":
        fieldSchema = z.string();
        break;
      case "number":
        fieldSchema = z.coerce.number();
        break;
      case "checkbox":
        fieldSchema = z.boolean();
        break;
      case "select":
      case "radio":
      case "multiselect":
        if (field.options) {
          fieldSchema = z.enum([
            "",
            ...field.options.flatMap((option) =>
              "options" in option
                ? option.options.map((o) => o.value)
                : option.value
            ),
          ]);
        } else {
          fieldSchema = z.string(); // Fallback to string if options are not provided
        }
        break;
      case "date":
        fieldSchema = z.date();
        break;
      case "evaluated":
        fieldSchema = z.string(); // Not sure how to handle this type, fallback to string
        break;
      case "file":
        fieldSchema = z
          .any()
          .refine(
            (files) => !files.length || files?.[0]?.size <= MAX_FILE_SIZE,
            `Max file size is 5MB.`
          )
          .refine(
            (files) =>
              !files.length || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            ".jpg, .jpeg, .png and .webp .pdf files are accepted."
          )
          .transform(async (files: FileList) => {
            if (!files.length) {
              return [];
            }

            const base64 = await getBase64(files[0]);
            return {
              name: files[0].name,
              size: files[0].size,
              type: files[0].type,
              file: base64,
            };
          });
        break;
      default:
        fieldSchema = z.string(); // Fallback to string for unknown types
    }

    if (field.validation) {
      if (field.type === "number") {
        if (field.validation.min !== undefined) {
          fieldSchema = fieldSchema.refine(
            (value) => !value || value >= (field?.validation?.min ?? 0),
            {
              message: `O valor deve ser maior ou igual a ${field.validation.min}`,
            }
          );
        }
        if (field.validation.max !== undefined) {
          fieldSchema = fieldSchema.refine(
            (value) => !value || value <= (field?.validation?.max ?? 0),
            {
              message: `O valor deve ser menor ou igual a ${field.validation.max}`,
            }
          );
        }
      }
      if (field.validation?.pattern && field.type === "text") {
        fieldSchema = fieldSchema.refine(
          (value) => new RegExp(field?.validation?.pattern ?? "").test(value),
          {
            message: `O valor não corresponde ao padrão esperado ${field.validation.pattern}`,
          }
        );
      }
    }

    // Make field optional if not required
    if (!field.required) {
      fieldSchema = fieldSchema.optional();
    }

    schemaObject[field.id] = fieldSchema;
  });

  return z.object(schemaObject);
}
