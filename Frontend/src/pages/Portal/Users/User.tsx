import { useCallback, useEffect } from "react";
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
  Flex,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import Text from "@components/atoms/Inputs/Text";
import Switch from "@components/atoms/Inputs/Switch";
import Select from "@components/atoms/Inputs/Select";
import { createOrUpdateUser, getUser, getUserForms } from "@apis/users";
import Password from "@components/atoms/Inputs/Password";
import { IUserRoles } from "@interfaces/User";
import Can from "@components/atoms/Can";

const Schema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
    matriculation: z
      .string()
      .max(15, { message: "Matrícula deve ter no máximo 15 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    roles: z.array(z.nativeEnum(IUserRoles)),
    isExternal: z.boolean().optional().default(false),
    institute: z.string(),
    active: z.boolean(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    university_degree: z.enum(["mastermind", "doctor"]).optional().nullable(),
  })
  .refine(
    (data) => !data.isExternal || (data.isExternal && !data.matriculation),
    {
      message: "Matrícula não é necessária para usuários externos",
      path: ["matriculation"],
    }
  )
  .refine(
    (data) =>
      !data.roles.includes(IUserRoles.teacher) ||
      (data.roles.includes(IUserRoles.teacher) && data.university_degree),
    {
      message: "Titulação é obrigatória para professores",
      path: ["university_degree"],
    }
  )
  .refine(
    (data) => !data.password || (data.password && data.password.length >= 6),
    {
      message: "Senha precisa ter no mínimo 6 caracteres",
      path: ["password"],
    }
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

type UniversityFormInputs = z.infer<typeof Schema>;

export default function User() {
  const toast = useToast();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const queryClient = useQueryClient();

  const isEditing = !!params?.id;
  const id = params?.id ?? "";

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: getUser,
    enabled: isEditing,
  });

  const { data: formsData, isLoading: isLoadingForms } = useQuery({
    queryKey: ["forms", "user"],
    queryFn: getUserForms,
    retryOnMount: false,
    staleTime: 1000 * 60 * 60,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createOrUpdateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      toast({
        title: `Usuário ${isEditing ? "editada" : "criada"} com sucesso`,
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: `Erro ao ${isEditing ? "editar" : "criar"} Usuário`,
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
    },
  });

  const methods = useForm<UniversityFormInputs>({
    resolver: zodResolver(Schema),
    defaultValues: user ?? {
      isExternal: false,
      active: true,
    },
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = methods;

  const isTeacher = watch("roles")?.includes(IUserRoles.teacher);
  const isExternal = watch("isExternal");

  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync(isEditing ? { ...data, _id: id } : data);
  });

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    if (user) {
      reset({
        ...user,
        institute: user.institute._id,
      });
    }
  }, [user, reset]);

  useEffect(() => {}, [errors]);

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
              {isEditing ? "Editar" : "Criar"} Usuário
            </Box>
          </CardHeader>
          <CardBody display="flex" flexDirection="column" gap="4">
            <Flex justify="space-between" gap="4" direction={["column", "row"]}>
              <Text
                input={{
                  id: "name",
                  label: "Nome",
                  placeholder: "Nome",
                  required: true,
                }}
              />
              <Switch input={{ id: "active", label: "Ativo" }} />
            </Flex>
            <Flex justify="space-between" gap="4" direction={["column", "row"]}>
              {!isExternal && (
                <Text
                  input={{
                    id: "matriculation",
                    label: "Matrícula",
                    placeholder: "Matrícula",
                    required: true,
                  }}
                />
              )}
              <Select
                input={{
                  id: "roles",
                  label: "Perfil",
                  placeholder: "Perfil",
                  required: true,
                  options: formsData?.roles ?? [],
                }}
                isLoading={isLoadingForms}
                isMulti
              />
              <Select
                input={{
                  id: "institute",
                  label: "Instituto",
                  placeholder: "Instituto",
                  required: true,
                  options: formsData?.institutes ?? [],
                }}
                isLoading={isLoadingForms}
              />
            </Flex>
            <Flex justify="space-between" gap="4" direction={["column", "row"]}>
              <Text
                input={{
                  id: "email",
                  label: "Email",
                  placeholder: "Email",
                  required: true,
                }}
              />

              <Switch input={{ id: "isExternal", label: "Externo" }} />

              {isTeacher && (
                <Select
                  input={{
                    id: "university_degree",
                    label: "Titulação",
                    placeholder: "Titulação",
                    options: [
                      {
                        label: "Mestrado",
                        value: "mastermind",
                      },
                      {
                        label: "Doutorado",
                        value: "doctor",
                      },
                    ],
                  }}
                />
              )}
            </Flex>

            <Flex justify="space-between" gap="4" direction={["column", "row"]}>
              <Password
                input={{
                  id: "password",
                  label: "Senha",
                  placeholder: "Senha",
                }}
              />

              <Password
                input={{
                  id: "confirmPassword",
                  label: "Confirmar Senha",
                  placeholder: "Confirmar Senha",
                }}
              />
            </Flex>

            <Flex mt="8" justify="flex-end" gap="4">
              <Button
                mt={4}
                colorScheme="gray"
                variant="outline"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Can permission={isEditing ? "user.update" : "user.create"}>
                <Button
                  mt={4}
                  colorScheme="blue"
                  isLoading={isPending || isLoading}
                  type="submit"
                >
                  {isEditing ? "Editar" : "Criar"}
                </Button>
              </Can>
            </Flex>
          </CardBody>
        </Card>
      </FormProvider>
    </Flex>
  );
}
