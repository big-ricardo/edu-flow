import { IField } from "@interfaces/FormDraft";

type Template = {
  type?: "created" | "interaction" | "evaluated";
  fields: IField[];
};

const created: Template = {
  type: "created",
  fields: [
    {
      id: "name",
      type: "text",
      required: true,
      visible: true,
      system: true,
      label: "Nome da atividade",
      predefined: null,
      value: null,
    },
    {
      id: "description",
      type: "textarea",
      required: true,
      visible: true,
      system: true,
      label: "Descrição da atividade",
      predefined: null,
      value: null,
    },
    {
      id: "masterminds",
      type: "teacher",
      required: true,
      visible: true,
      system: true,
      predefined: "teachers",
      label: "Orientador",
      value: null,
    },
    {
      id: "submastermind",
      type: "teacher",
      required: false,
      visible: true,
      system: true,
      predefined: "teachers",
      label: "Coorientador",
      value: null,
    },
  ],
};

const interaction: Template = {
  type: "interaction",
  fields: [],
};

const evaluated: Template = {
  type: "evaluated",
  fields: [],
};

const templates: {
  [key: string]: Template;
} = {
  created,
  interaction,
  evaluated,
};

const keys = Object.keys(templates);

export default function getTemplate(
  templateId: string | undefined | null
): Template | object {
  if (!templateId) return {};

  if (!keys.includes(templateId)) {
    console.warn(`Template ${templateId} not found`);
    return {};
  }

  return templates[templateId];
}
