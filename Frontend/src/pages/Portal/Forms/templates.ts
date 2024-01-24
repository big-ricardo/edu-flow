import { IField } from "@interfaces/Form";

type Template = {
  type?: "created" | "interaction" | "available";
  fields: IField[];
};

const created: Template = {
  type: "created",
  fields: [
    {
      id: "{{activity_name}}",
      type: "text",
      required: true,
      visible: true,
      system: true,
      label: "Nome da atividade",
      predefined: null,
    },
    {
      id: "{{activity_description}}",
      type: "textarea",
      required: true,
      visible: true,
      system: true,
      label: "Descrição da atividade",
      predefined: null,
    },
    {
      id: "{{activity_mastermind}}",
      type: "multiselect",
      required: true,
      visible: true,
      system: true,
      predefined: "teachers",
      label: "Orientador",
    },
    {
      id: "{{activity_submastermind}}",
      type: "multiselect",
      required: false,
      visible: true,
      system: true,
      predefined: "teachers",
      label: "Coorientador",
    },
  ],
};

const interaction: Template = {
  type: "interaction",
  fields: [],
};

const available: Template = {
  type: "available",
  fields: [],
};

const templates: {
  [key: string]: Template;
} = {
  created,
  interaction,
  available,
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
