import React, { memo, useCallback, useEffect, useState } from "react";
import {
  FormProvider,
  UseFieldArrayInsert,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  CardBody,
  Center,
  Divider,
  Flex,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Text from "@components/atoms/Inputs/Text";
import Select from "@components/atoms/Inputs/Select";
import { createOrUpdateForm, getForm, getFormForms } from "@apis/form";
import TextArea from "@components/atoms/Inputs/TextArea";
import FieldArray from "@components/molecules/FieldArray";
import getTemplate from "./templates";
import {
  FaArrowLeft,
  FaEye,
  FaPen,
  FaPlus,
  FaSave,
  FaTrashAlt,
} from "react-icons/fa";
import Inputs from "@components/atoms/Inputs";
import IForm from "@interfaces/Form";

const formSchema = z
  .object({
    name: z.string(),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: "Slug inválido, utilize apenas letras e números e -",
      })
      .min(3),
    status: z.enum(["draft", "published"]).default("draft"),
    initial_status: z.string().optional().nullable(),
    type: z.enum(["created", "interaction", "available"]),
    workflow: z.string().optional().nullable(),
    period: z.object({
      open: z.string().nullable(),
      close: z.string().nullable(),
    }),
    description: z.string().max(255),
    fields: z
      .array(
        z.object({
          id: z.string().min(3),
          label: z.string().min(3),
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
          ]),
          required: z.boolean().optional().default(false),
          value: z.string().optional().nullable(),
          visible: z.boolean().optional().default(true),
          system: z.boolean().optional().default(false),
          predefined: z
            .enum(["teachers", "students", "institutions"])
            .nullable()
            .default(null),
          options: z
            .array(
              z.object({ label: z.string().min(3), value: z.string().min(3) }),
            )
            .nullable()
            .optional(),
        }),
      )
      .min(1, "É necessário ter pelo menos um campo"),
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
    },
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
    },
  )
  .refine(
    (data) => {
      const selectFields = data.fields.filter((field) =>
        ["select", "multiselect"].includes(field.type),
      );

      return selectFields.every(
        (field) => field?.predefined ?? field.options?.length,
      );
    },
    {
      message: "É necessário selecionar uma opção",
      path: ["fields"],
    },
  );

export type formFormSchema = z.infer<typeof formSchema>;

export default function Form() {
  const toast = useToast();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [isPreview, setPreview] = useState<boolean>(false);

  const type = searchParams.get("type");

  const isEditing = !!params?.id;
  const id = params?.id ?? "";

  const {
    data: form,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["form", id],
    queryFn: getForm,
    enabled: isEditing,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createOrUpdateForm,
    onSuccess: () => {
      toast({
        title: `Formulário ${isEditing ? "editada" : "criada"} com sucesso`,
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["statuses"] });
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: `Erro ao ${isEditing ? "editar" : "criar"} formulário`,
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
    },
  });

  const methods = useForm<formFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: form ?? getTemplate(type),
  });

  const {
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: { errors, isDirty, isValid },
  } = methods;

  const formType = watch("type");
  const isCreated = formType === "created";
  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync(isEditing ? { ...data, _id: id } : data);
  });

  const handleCancel = useCallback(() => {
    reset(form);
  }, [form, reset]);

  const handlePreview = useCallback(() => {
    setPreview((prev) => !prev);
  }, [setPreview]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    if (form) {
      reset(form);
    }
  }, [form, reset]);

  useEffect(() => {}, [errors]);

  if (isError) {
    return (
      <Center h="100vh" w="100%">
        <Heading>Erro ao carregar formulário</Heading>
      </Center>
    );
  }

  return (
    <Flex w="100%" h="100%" direction="column">
      <Card
        w="100%"
        display="flex"
        direction="row"
        borderRadius={0}
        justifyContent="space-between"
        alignItems="center"
        p="2"
        position="sticky"
        top="0"
        zIndex="sticky"
      >
        <Flex direction="row" gap="3" alignItems="center">
          <Heading size="md" fontWeight="bold">
            {isEditing ? "Editar" : "Criar"} Formulário
          </Heading>
          <Button
            colorScheme="blue"
            onClick={handleBack}
            variant="ghost"
            size="sm"
            title="Voltar"
          >
            <FaArrowLeft />
          </Button>
        </Flex>

        <Flex gap="2" align="center">
          <Button
            colorScheme="red"
            onClick={handleCancel}
            variant="outline"
            size="sm"
            title="Descartar Alterações"
          >
            <FaTrashAlt />
          </Button>

          <Button
            colorScheme="blue"
            onClick={handlePreview}
            variant="outline"
            isDisabled={!isValid}
            size="sm"
            title={isPreview ? "Editar" : "Preview"}
          >
            {isPreview ? <FaPen /> : <FaEye />}
          </Button>

          <Button
            colorScheme="green"
            isLoading={isPending}
            isDisabled={!isDirty || !isValid}
            onClick={onSubmit}
            size="sm"
          >
            <FaSave /> &nbsp; Salvar Alterações
          </Button>
        </Flex>
      </Card>

      <Flex w="100%" my="6" mx="auto" px="6" justify="center">
        <FormProvider {...methods}>
          <Card
            as="form"
            onSubmit={onSubmit}
            borderRadius={8}
            h="fit-content"
            w="100%"
            maxW="1000px"
          >
            <CardBody display="flex" flexDirection="column" gap="4">
              {isPreview ? (
                <Preview form={getValues()} />
              ) : (
                <FormEdit {...{ isEditing, isCreated, isLoading }} />
              )}
            </CardBody>
          </Card>
        </FormProvider>
      </Flex>
    </Flex>
  );
}

interface PreviewProps {
  form: Omit<IForm, "_id">;
}

const Preview: React.FC<PreviewProps> = memo(({ form }) => {
  return (
    <React.Fragment>
      <Heading>{form.name}</Heading>
      <span>{form.description}</span>
      <Divider />
      <Inputs fields={form.fields} />
    </React.Fragment>
  );
});

interface FormEditProps {
  isEditing: boolean;
  isCreated: boolean;
}

const FormEdit: React.FC<FormEditProps> = memo(({ isEditing, isCreated }) => {
  const { control } = useFormContext<formFormSchema>();

  const { data: formsData, isLoading: isLoadingForms } = useQuery({
    queryKey: ["forms", "forms"],
    queryFn: getFormForms,
    retryOnMount: false,
    staleTime: 1000 * 60 * 60,
  });

  const { fields, insert, remove, swap } = useFieldArray({
    control,
    name: "fields",
  });

  return (
    <React.Fragment>
      <Heading size="md">Configurações</Heading>
      <Divider />

      <Text
        input={{
          id: "name",
          label: "Nome",
          placeholder: "Nome",
          required: true,
        }}
      />

      <Text
        input={{
          id: "slug",
          label: "Digite um sluf único para o formulário",
          placeholder: "Slug",
          required: true,
        }}
      />

      <Flex gap="4">
        {isEditing && (
          <Select
            input={{
              id: "status",
              label: "Status",
              placeholder: "Status",
              required: true,
              options: [
                { label: "Rascunho", value: "draft" },
                { label: "Publicado", value: "published" },
              ],
            }}
            isLoading={isLoadingForms}
          />
        )}

        {isCreated && (
          <Select
            input={{
              id: "workflow",
              label: "Workflow",
              placeholder: "Workflow Acionado",
              required: true,
              options: formsData?.workflows ?? [],
            }}
            isLoading={isLoadingForms}
          />
        )}
      </Flex>

      <Flex gap="4">
        <Select
          input={{
            id: "type",
            label: "Tipo",
            placeholder: "Tipo",
            required: true,
            options: [
              { label: "Criação de Atividade", value: "created" },
              { label: "Interação com Atividade", value: "interaction" },
              { label: "Avaliação de Atividade", value: "available" },
            ],
            isDisabled: true,
          }}
        />

        {isCreated && (
          <Select
            input={{
              id: "initial_status",
              label: "Status inicial da atividade",
              placeholder: "Status inicial",
              required: true,
              options: formsData?.status ?? [],
            }}
            isLoading={isLoadingForms}
          />
        )}
      </Flex>

      <TextArea
        input={{
          id: "description",
          label: "Descrição",
          placeholder: "Descrição",
          required: true,
        }}
      />

      <Flex gap="4" mb="5">
        <Text
          input={{
            id: "period.open",
            label: "Abertura",
            placeholder: "Abertura",
            type: "date",
          }}
        />

        <Text
          input={{
            id: "period.close",
            label: "Fechamento",
            placeholder: "Fechamento",
            type: "date",
          }}
        />
      </Flex>

      <Heading size="md">Campos do formulário</Heading>
      <Divider />

      <ButtonAdd insert={insert} />

      {fields.map((field, index) => (
        <Flex key={field.id} direction="column" gap="4">
          <FieldArray
            field={field}
            index={index}
            remove={remove}
            swap={swap}
            isEnd={index === fields.length - 1}
          />
          <ButtonAdd insert={insert} index={index} length={fields.length} />
        </Flex>
      ))}
    </React.Fragment>
  );
});

interface ButtonAddProps {
  insert: UseFieldArrayInsert<formFormSchema, "fields">;
  index?: number;
  length?: number;
}

const ButtonAdd: React.FC<ButtonAddProps> = ({
  insert,
  index = 0,
  length = 0,
}) => {
  const handleAddField = useCallback(() => {
    insert(
      index + 1,
      {
        id: `field-${length}`,
        label: "",
        placeholder: "",
        type: "text",
        required: false,
        system: false,
        value: "",
        visible: true,
        predefined: null,
      },
      { shouldFocus: true },
    );
  }, [insert, index, length]);

  return (
    <Button
      colorScheme="blue"
      variant="outline"
      size="sm"
      onClick={handleAddField}
      title="Adicionar campo"
      w="fit-content"
      margin="auto"
    >
      <FaPlus />
    </Button>
  );
};
