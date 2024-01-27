import { Flex, Box, Heading, useToast, Spinner } from "@chakra-ui/react";
import Text from "@components/atoms/Inputs/Text";
import MdxEditor from "@components/organisms/EmailTemplate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { createOrUpdateEmail, getEmail } from "@apis/email";

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
  } = methods;

  const onSave = useCallback(
    async (htmlTemplate: string) => {
      handleSubmit(async (data) => {
        await mutateAsync({
          ...data,
          _id: isEditing ? id : undefined,
          htmlTemplate,
        });
      })();
    },
    [handleSubmit, mutateAsync, id, isEditing]
  );

  useEffect(() => {}, [errors]);

  return (
    <Flex justify="center" align="center" w="100%">
      <FormProvider {...methods}>
        <Box w="100%" h="100%" p="4">
          <Heading size="md" mb="5">
            {isEditing ? "Editar" : "Criar"} Email
          </Heading>

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

          <Box mt="4">
            {isLoading ? (
              <Spinner />
            ) : (
              <MdxEditor
                onSave={onSave}
                data={email?.htmlTemplate}
                isPending={isPending}
              />
            )}
          </Box>
        </Box>
      </FormProvider>
    </Flex>
  );
};

export default EmailTemplate;
