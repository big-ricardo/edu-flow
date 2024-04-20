import React from "react";
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
  useColorModeValue,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import useAuth from "@hooks/useAuth";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import InputText from "@components/atoms/Inputs/Text";
import Password from "@components/atoms/Inputs/Password";
import { login } from "@apis/auth";

const schema = z.object({
  acronym: z
    .string()
    .min(2, "A sigla deve ter no mínimo 2 caracteres")
    .trim()
    .transform((v) => v.toLowerCase().replace(/ /g, "")),
  cpf: z
    .string()
    .length(11, "O CPF deve ter 11 dígitos")
    .regex(/^\d+$/, "Insira apenas números no CPF"),
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

  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync(data);
  });

  return (
    <Box
      p={4}
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      gap="10"
      bg={useColorModeValue("gray.200", "gray.900")}
    >
      <FormProvider {...methods}>
        <Hide below="md">
          <Text
            variant="title"
            w={{ base: "30%", xl: "40%" }}
            fontSize="5xl"
            fontWeight="semibold"
          >
            Faça o login para acessar sua conta
          </Text>
        </Hide>
        <Card p="10" w={{ base: "100%", md: "450px" }} boxShadow="lg">
          <CardBody>
            <form onSubmit={onSubmit}>
              <InputText
                input={{
                  id: "acronym",
                  label: "Sigla",
                  placeholder: "Sigla",
                }}
              />

              <InputText
                input={{
                  id: "cpf",
                  label: "CPF",
                  placeholder: "CPF",
                }}
              />

              <Password
                input={{
                  id: "password",
                  label: "Senha",
                  placeholder: "Senha",
                }}
              />

              <Button
                mt={4}
                colorScheme="teal"
                type="submit"
                isLoading={isPending}
              >
                Entrar
              </Button>
            </form>
          </CardBody>
        </Card>
      </FormProvider>
    </Box>
  );
};

export default Login;
