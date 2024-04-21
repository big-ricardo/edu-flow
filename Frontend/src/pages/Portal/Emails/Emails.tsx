import {
  Flex,
  Box,
  Heading,
  useToast,
  Card,
  Spinner,
  Button,
} from "@chakra-ui/react";
import Text from "@components/atoms/Inputs/Text";
import MdxEditor from "@components/organisms/EmailTemplate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { createOrUpdateEmail, getEmail } from "@apis/email";
import EmailTemplateHook from "@components/organisms/EmailTemplate/hook";
import { FaArrowLeft, FaSave, FaTrashAlt } from "react-icons/fa";

const emailSchema = z.object({
  slug: z
    .string()
    .regex(/^[A-Za-z]+([A-za-z0-9]+)+(-[A-Za-z0-9]+)*$/)
    .min(3, { message: "Nome deve ter no mínimo 3 caracteres" })
    .max(50, { message: "Nome deve ter no máximo 50 caracteres" }),
  subject: z
    .string()
    .min(3, { message: "Titulo deve ter no mínimo 3 caracteres" })
    .max(50, { message: "Titulo deve ter no máximo 50 caracteres" }),
});

type EmailFormSchema = z.infer<typeof emailSchema>;

const EmailTemplate: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const queryClient = useQueryClient();

  const isEditing = !!params?.id;
  const id = params?.id ?? "";
  const { data: email, isLoading } = useQuery({
    queryKey: ["email", id],
    queryFn: getEmail,
    enabled: isEditing,
  });

  const { handleSave } = EmailTemplateHook({
    html: email?.htmlTemplate,
    css: email?.cssTemplate,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createOrUpdateEmail,
    onSuccess: () => {
      toast({
        title: `Email ${isEditing ? "editada" : "criada"} com sucesso`,
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: `Erro ao ${isEditing ? "editar" : "criar"} email`,
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
    },
  });

  const methods = useForm<EmailFormSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: email ?? {},
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const htmlTemplate = handleSave();

    await mutateAsync({
      ...data,
      htmlTemplate: htmlTemplate.html,
      cssTemplate: htmlTemplate.css.toString(),
      _id: isEditing ? id : undefined,
    });
  });

  useEffect(() => {}, [errors]);

  useEffect(() => {
    reset(email);
  }, [email, reset]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleCancel = useCallback(() => {
    reset(email);
  }, [reset, email]);

  return (
    <Flex justify="center" align="center" w="100%" direction="column">
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
            {isEditing ? "Editar" : "Criar"} Email
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
            colorScheme="green"
            onClick={onSubmit}
            size="sm"
            isLoading={isPending}
          >
            <FaSave /> &nbsp; Salvar Alterações
          </Button>
        </Flex>
      </Card>

      <FormProvider {...methods}>
        <Box w="100%" h="100%" p="4">
          <Text
            input={{
              id: "slug",
              label: "Slug",
              placeholder: "Insira um nome de identificação",
            }}
          />

          <Text
            input={{
              id: "subject",
              label: "Assunto",
              placeholder: "Insira um assunto pro email",
            }}
          />

          <Box mt="4">{isLoading ? <Spinner /> : <MdxEditor />}</Box>
        </Box>
      </FormProvider>
    </Flex>
  );
};

export default EmailTemplate;
