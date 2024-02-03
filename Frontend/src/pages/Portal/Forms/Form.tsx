import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { createOrUpdateForm, getForm } from "@apis/form";
import getTemplate from "./templates";
import { FaArrowLeft, FaEye, FaPen, FaSave, FaTrashAlt } from "react-icons/fa";
import FormEdit from "./components/Forms";
import formSchema, { formFormSchema } from "./schema";
import Preview from "./components/Preview";

export default function Form() {
  const toast = useToast();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [isPreview, setPreview] = useState<boolean>(false);

  const type = searchParams.get("type") as
    | "created"
    | "interaction"
    | "available";

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
    formState: { isDirty, isValid },
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

  if (isError) {
    return (
      <Center h="100vh" w="100%">
        <Heading>Erro ao carregar formulário</Heading>
      </Center>
    );
  }

  return (
    <Flex w="100%" h="100%" direction="column" pb="10rem">
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
            isDisabled={!isDirty}
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
                <FormEdit
                  {...{ isEditing, isCreated, isLoading }}
                  formType={type}
                />
              )}
            </CardBody>
          </Card>
        </FormProvider>
      </Flex>
    </Flex>
  );
}
