import { memo, useCallback, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import Text from "@components/atoms/Inputs/Text";
import Switch from "@components/atoms/Inputs/Switch";
import DraftItem from "@components/molecules/DraftItem";
import { getFormDrafts } from "@apis/formDraft";
import { createOrUpdateForm, getForm, getFormForms } from "@apis/form";
import TextArea from "@components/atoms/Inputs/TextArea";
import Select from "@components/atoms/Inputs/Select";
import Can from "@components/atoms/Can";
import { FaArrowLeft } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const statusSchema = z
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
    active: z.boolean().default(true),
    description: z
      .string()
      .max(255, "O tamanho máximo é 255 caracteres")
      .min(3, "Minimo 3 letras"),
    institute: z.string().optional().nullable(),
    pre_requisites: z.object({
      form: z.string().nullable().default(null),
      status: z.string().nullable().default(null),
    }),
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
  );

type StatusFormSchema = z.infer<typeof statusSchema>;

export default function Workflow() {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const queryClient = useQueryClient();

  const isEditing = !!params?.id;
  const id = params?.id ?? "";

  const { data: form, isLoading } = useQuery({
    queryKey: ["form", id],
    queryFn: getForm,
    enabled: isEditing,
  });

  const { data: formsData, isLoading: isLoadingForms } = useQuery({
    queryKey: ["forms", "forms"],
    queryFn: getFormForms,
    retryOnMount: false,
    staleTime: 1000 * 60 * 60,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createOrUpdateForm,
    onSuccess: (data) => {
      toast({
        title: t(`form.${isEditing ? "updated" : "created"}`),
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      navigate(`/portal/form/${data._id}`);
    },
    onError: () => {
      toast({
        title: t("form.error"),
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    },
  });

  const methods = useForm<StatusFormSchema>({
    resolver: zodResolver(statusSchema),
    defaultValues: form ?? {},
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
  } = methods;

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

  const formType = watch("type");
  const isCreated = formType === "created";

  return (
    <Flex w="100%" my="6" mx="auto" px="6" justify="center">
      <FormProvider {...methods}>
        <Card
          as="form"
          onSubmit={onSubmit}
          borderRadius={8}
          h="fit-content"
          w="100%"
          maxW="600px"
        >
          <Button variant="ghost" onClick={() => navigate(-1)} w="fit-content">
            <FaArrowLeft />
          </Button>
          <CardHeader>
            <Box textAlign="center" fontSize="lg" fontWeight="bold">
              {t(`form.${isEditing ? "edit" : "create"}`)}
            </Box>
          </CardHeader>
          <CardBody display="flex" flexDirection="column" gap="4">
            <Text
              input={{
                id: "name",
                label: t("common.fields.name"),
                required: true,
              }}
            />

            <Switch
              input={{
                id: "active",
                label: t("common.fields.active"),
                required: true,
              }}
            />

            <Text
              input={{
                id: "slug",
                label: t("common.fields.slug"),
                required: true,
              }}
            />
            <Flex gap="4">
              <Select
                input={{
                  id: "type",
                  label: t("common.fields.type"),
                  required: true,
                  options: [
                    { label: t("form.type.created"), value: "created" },
                    { label: t("form.type.interaction"), value: "interaction" },
                    { label: t("form.type.evaluation"), value: "evaluated" },
                  ],
                  isDisabled: isEditing,
                }}
              />

              {isCreated && (
                <Select
                  input={{
                    id: "initial_status",
                    label: t("common.fields.initialStatus"),
                    required: true,
                    options: formsData?.status ?? [],
                  }}
                  isLoading={isLoadingForms}
                />
              )}
            </Flex>

            <Flex gap="4">
              {isCreated && (
                <>
                  <Select
                    input={{
                      id: "workflow",
                      label: t("common.fields.workflow"),
                      required: true,
                      options: formsData?.workflows ?? [],
                    }}
                    isLoading={isLoadingForms}
                  />
                  <Select
                    input={{
                      id: "institute",
                      label: t("common.fields.institute"),
                      options: formsData?.institutes ?? [],
                    }}
                    isLoading={isLoadingForms}
                  />
                </>
              )}
            </Flex>

            <TextArea
              input={{
                id: "description",
                label: t("common.fields.description"),
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
                  describe: "Data de abertura do formulário",
                }}
              />

              <Text
                input={{
                  id: "period.close",
                  label: "Fechamento",
                  placeholder: "Fechamento",
                  type: "date",
                  describe: "Data de fechamento do formulário",
                }}
              />
            </Flex>

            <Box>
              <Divider my={4} />
              <Heading fontSize={"large"} mb={4}>
                {t("common.fields.pre_requisites.title")}
              </Heading>
              <p>{t("common.fields.pre_requisites.description")}</p>

              <Flex gap="4" mt={4}>
                <Select
                  input={{
                    id: "pre_requisites.form",
                    label: t("common.fields.pre_requisites.form"),
                    options:
                      formsData?.forms.filter((f) => f.value !== id) ?? [],
                  }}
                  isLoading={isLoadingForms}
                />
                <Select
                  input={{
                    id: "pre_requisites.status",
                    label: t("common.fields.pre_requisites.status"),
                    options: formsData?.status ?? [],
                  }}
                  isLoading={isLoadingForms}
                />
              </Flex>
            </Box>

            <Flex justify="flex-end" gap="4">
              <Button
                mt={4}
                colorScheme="gray"
                variant="outline"
                onClick={handleCancel}
              >
                {t("form.cancel")}
              </Button>
              <Can permission={isEditing ? "form.update" : "form.create"}>
                <Button
                  mt={4}
                  colorScheme="blue"
                  isLoading={isPending || isLoading}
                  type="submit"
                  isDisabled={!isDirty}
                >
                  {t("form.submit")}
                </Button>
              </Can>
            </Flex>

            <Can permission="formDraft.view">
              {isEditing && <FormVersions id={id} formType={formType} />}
            </Can>
          </CardBody>
        </Card>
      </FormProvider>
    </Flex>
  );
}

interface FormVersionsProps {
  id: string;
  formType: string;
}

const FormVersions: React.FC<FormVersionsProps> = memo(({ id, formType }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: formDrafts, isLoading: isLoadingDrafts } = useQuery({
    queryKey: ["form-drafts", id],
    queryFn: getFormDrafts,
  });

  const handleNewDraft = useCallback(() => {
    navigate(`/portal/form-draft/${id}`, {
      state: { formType },
    });
  }, [navigate, id, formType]);

  const handleEditDraft = useCallback(
    (draftId: string) => {
      navigate(`/portal/form-draft/${id}/${draftId}`, {
        state: { formType },
      });
    },
    [navigate, id, formType]
  );
  return (
    <Flex mt="8" justify="center" align="center" direction="column" gap="5">
      <Heading fontSize={"x-large"}>{t("form.drafts")}</Heading>
      <Divider />

      {isLoadingDrafts && <Spinner />}

      <Flex direction="column" gap="5" wrap="wrap" w="100%">
        {!formDrafts?.forms?.length && (
          <Can permission="formDraft.create">
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={handleNewDraft}
              isLoading={isLoadingDrafts}
            >
              {t("form.newDraft")}
            </Button>
          </Can>
        )}

        {formDrafts?.forms?.map((draft) => (
          <DraftItem key={draft._id} draft={draft} onEdit={handleEditDraft} />
        ))}
      </Flex>
    </Flex>
  );
});
