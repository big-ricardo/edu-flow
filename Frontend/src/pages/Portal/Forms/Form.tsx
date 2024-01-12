import { useCallback, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import { useNavigate, useParams } from "react-router-dom";
import Text from "@components/atoms/Inputs/Text";
import Select from "@components/atoms/Inputs/Select";
import { createOrUpdateForm, getForm, getFormForms } from "@apis/form";
import TextArea from "@components/atoms/Inputs/TextArea";
import FieldArray from "@components/molecules/FieldArray";

const formSchema = z.object({
  name: z.string(),
  status: z.enum(["draft", "published"]).default("draft"),
  initial_status: z.string().optional(),
  type: z.enum(["created", "interaction", "available"]),
  period: z.object({ open: z.string(), close: z.string() }).optional(),
  description: z.string().max(255),
  fields: z
    .array(
      z.object({
        name: z.string(),
        type: z.enum([
          "text",
          "number",
          "email",
          "password",
          "textarea",
          "checkbox",
          "radio",
          "select",
          "date",
          "file",
          "teachers",
        ]),
        required: z.boolean().optional(),
        value: z.string().optional(),
        visible: z.boolean(),
        options: z
          .array(z.object({ label: z.string(), value: z.string() }))
          .optional(),
      })
    )
    .min(1, "É necessário ter pelo menos um campo"),
});

export type formFormSchema = z.infer<typeof formSchema>;

export default function Form() {
  const toast = useToast();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const queryClient = useQueryClient();

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
        title: `Erro ao ${isEditing ? "editar" : "criar"} status`,
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<formFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: form ?? {},
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const isCreated = watch("type") === "created";

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
      <Card
        as="form"
        onSubmit={onSubmit}
        borderRadius={8}
        h="fit-content"
        w="100%"
        maxW="600px"
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
            register={register}
            errors={errors}
          />

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
              control={control}
              errors={errors}
            />
          )}

          <Flex gap="4">
            <Select
              input={{
                id: "type",
                label: "Tipo",
                placeholder: "Tipo",
                required: true,
                options: [
                  { label: "Criado", value: "created" },
                  { label: "Interativo", value: "interaction" },
                  { label: "Disponível", value: "available" },
                ],
              }}
              control={control}
              errors={errors}
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
                control={control}
                errors={errors}
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
            register={register}
            errors={errors}
          />

          <Flex gap="4" mb="5">
            <Text
              input={{
                id: "period.open",
                label: "Abertura",
                placeholder: "Abertura",
                type: "date",
              }}
              register={register}
              errors={errors}
            />

            <Text
              input={{
                id: "period.close",
                label: "Fechamento",
                placeholder: "Fechamento",
                type: "date",
              }}
              register={register}
              errors={errors}
            />
          </Flex>

          <Heading size="md">Campos</Heading>
          <Divider />

          {fields.map((field, index) => (
            <FieldArray
              field={field}
              index={index}
              register={register}
              control={control}
              remove={remove}
              errors={errors}
              haveOptions={["select", "radio", "checkbox"].includes(watch(`fields.${index}.type`))}
            />
          ))}

          <Button
            type="button"
            onClick={() =>
              append({
                name: "",
                type: "text",
                required: false,
                value: "",
                visible: true,
              })
            }
            colorScheme="blue"
          >
            Adicionar campo
          </Button>

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
            >
              {isEditing ? "Editar" : "Criar"}
            </Button>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
}
