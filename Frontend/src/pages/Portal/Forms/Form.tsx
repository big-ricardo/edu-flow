import { useCallback, useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  Flex,
  Heading,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Text from "@components/atoms/Inputs/Text";
import Select from "@components/atoms/Inputs/Select";
import { createOrUpdateForm, getForm, getFormForms } from "@apis/form";
import TextArea from "@components/atoms/Inputs/TextArea";
import FieldArray from "@components/molecules/FieldArray";
import getTemplate from "./templates";
import { FaPlus } from "react-icons/fa";

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
    initial_status: z.string().optional(),
    type: z.enum(["created", "interaction", "available"]),
    workflow: z.string().optional(),
    period: z.object({
      open: z.string().nullable(),
      close: z.string().nullable(),
    }),
    description: z.string().max(255),
    fields: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
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
          required: z.boolean().optional(),
          value: z.string().optional().nullable(),
          visible: z.boolean(),
          system: z.boolean().optional(),
          predefined: z
            .enum(["teachers", "students", "institutions"])
            .nullable()
            .default(null),
          options: z
            .array(z.object({ label: z.string(), value: z.string() }))
            .optional(),
        })
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
  .refine((data) => {
    const selectFields = data.fields.filter((field) =>
      ["select", "multiselect"].includes(field.type)
    );

    return selectFields.every(
      (field) => field?.predefined ?? field.options?.length
    );
  });

export type formFormSchema = z.infer<typeof formSchema>;

export default function Form() {
  const toast = useToast();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const type = searchParams.get("type");

  const isEditing = !!params?.id;
  const id = params?.id ?? "";

  const { data: formsData, isLoading: isLoadingForms } = useQuery({
    queryKey: ["form", "forms"],
    queryFn: getFormForms,
    retryOnMount: false,
    staleTime: 1000 * 60 * 60,
  });

  const { data: form, isLoading } = useQuery({
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
    control,
    reset,
    watch,
    formState: { errors, isDirty },
  } = methods;

  const { fields, insert, remove, swap } = useFieldArray({
    control,
    name: "fields",
  });

  const formType = watch("type");
  const isCreated = formType === "created";

  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync(isEditing ? { ...data, _id: id } : data);
  });

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    if (form) {
      reset(form);
    }
  }, [form, reset]);

  useEffect(() => {}, [errors]);

  if (isLoadingForms) {
    return (
      <Center w="100%" h="100%">
        <Spinner />
      </Center>
    );
  }

  return (
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
          <CardHeader>
            <Box textAlign="center" fontSize="lg" fontWeight="bold">
              {isEditing ? "Editar" : "Criar"} Formulário
            </Box>
          </CardHeader>
          <CardBody display="flex" flexDirection="column" gap="4">
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

            {fields.map((field, index) => (
              <Flex key={field.id} direction="column" gap="4">
                <FieldArray
                  field={field}
                  index={index}
                  remove={remove}
                  swap={swap}
                  haveOptions={[
                    "select",
                    "multiselect",
                    "radio",
                    "checkbox",
                  ].includes(watch(`fields.${index}.type`))}
                  isSelect={["select", "multiselect"].includes(
                    watch(`fields.${index}.type`)
                  )}
                  isPredefined={!!watch(`fields.${index}.predefined`)}
                />
                <Button
                  type="button"
                  onClick={() =>
                    insert(
                      index + 1,
                      {
                        id: `field-${fields.length}`,
                        label: "",
                        placeholder: "",
                        type: "text",
                        required: false,
                        value: "",
                        visible: true,
                        predefined: null,
                      },
                      { shouldFocus: true }
                    )
                  }
                  colorScheme="blue"
                  mx="auto"
                  size="sm"
                  variant="outline"
                >
                  <FaPlus />
                </Button>
              </Flex>
            ))}

            <Flex mt="8" justify="flex-end" gap="4">
              <Button
                mt={4}
                colorScheme="gray"
                variant="outline"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button
                mt={4}
                colorScheme="blue"
                isLoading={isPending || isLoading}
                type="submit"
                isDisabled={!isDirty}
              >
                {isEditing ? "Editar" : "Criar"}
              </Button>
            </Flex>
          </CardBody>
        </Card>
      </FormProvider>
    </Flex>
  );
}
