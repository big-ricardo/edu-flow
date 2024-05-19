import React, { useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Box,
  useToast,
  Card,
  CardBody,
  Hide,
  Text,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import useAuth from "@hooks/useAuth";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import InputText from "@components/atoms/Inputs/Text";
import Password from "@components/atoms/Inputs/Password";
import { login } from "@apis/auth";
import Icon from "@components/atoms/Icon";
import SwitchTheme from "@components/molecules/SwitchTheme";

const schema = z.object({
  acronym: z
    .string()
    .min(2, "A sigla deve ter no mínimo 2 caracteres")
    .trim()
    .transform((v) => v.toLowerCase().replace(/ /g, "")),
  matriculation: z.string().min(6, "A matrícula deve ter no mínimo 6 dígitos"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 dígitos"),
});

type FormData = z.infer<typeof schema>;

const Login: React.FC = () => {
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = methods;

  const toast = useToast({
    position: "top-right",
    variant: "left-accent",
    isClosable: true,
  });
  const [, setAuth] = useAuth();
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: login,
    onSuccess: ({ data }) => {
      toast({
        title: "Login realizado com sucesso",
        status: "success",
        duration: 9000,
        isClosable: true,
        icon: <FaCheckCircle />,
      });
      setAuth(data.token);
      navigate("/portal");
    },
    onError: (error: AxiosError<{ message: string; statusCode: number }>) => {
      toast({
        title: "Erro ao fazer login",
        description: error?.response?.data?.message ?? error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
        icon: <FaExclamationCircle />,
      });
    },
  });

  const handleForgotPassword = useCallback(() => {
    navigate("/auth/forgot-password");
  }, [navigate]);

  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync(data);
  });

  return (
    <Box
      p={4}
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-around"
      height="100vh"
      bg={"bg.page"}
    >
      <FormProvider {...methods}>
        <Hide below="md">
          <Flex direction="column" gap="4" alignItems="center">
            <Flex alignItems="center" justifyContent="center">
              <Icon w="150px" />
            </Flex>

            <Text
              fontSize="2xl"
              fontWeight="bold"
              textAlign="center"
              color="text.primary"
            >
              Bem-vindo ao Edu Flow
            </Text>
            <Text
              fontSize="sm"
              textAlign="center"
              color="text.secondary"
              maxW="400px"
            >
              Faça login para acessar o sistema de gestão acadêmica
            </Text>
            <SwitchTheme />
          </Flex>
        </Hide>

        <Card
          p={[4,10]}
          w={{ base: "100%", md: "450px" }}
          boxShadow="lg"
          bg={"bg.card"}
        >
          <CardBody>
            <Hide above="md">
              <Flex alignItems="center" justifyContent="center" gap="4">
                <Icon w="60px" />
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  textAlign="center"
                  color="text.primary"
                >
                  Bem-vindo ao Edu Flow
                </Text>
              </Flex>
              <Divider my="5" />
            </Hide>

            <form onSubmit={onSubmit}>
              <Flex direction="column" gap="4">
                <InputText
                  input={{
                    id: "acronym",
                    label: "Domínio",
                    placeholder: "Insira o domínio",
                  }}
                />

                <InputText
                  input={{
                    id: "matriculation",
                    label: "Matrícula",
                    placeholder: "Insira a matrícula",
                  }}
                />

                <Password
                  input={{
                    id: "password",
                    label: "Senha",
                    placeholder: "Insira a senha",
                  }}
                />

                <Button
                  mt={4}
                  type="submit"
                  isLoading={isPending}
                  colorScheme="blue"
                >
                  Entrar
                </Button>
              </Flex>
            </form>

            <Box mt={4}>
              <Text
                as="span"
                color="blue.500"
                cursor="pointer"
                fontSize="sm"
                textDecor={"underline"}
                onClick={handleForgotPassword}
              >
                Esqueceu a senha?
              </Text>
            </Box>
          </CardBody>
        </Card>
      </FormProvider>
    </Box>
  );
};

export default Login;
