import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  useToast,
  Card,
  CardBody,
  Hide,
  Text,
  FormHelperText,
  IconButton,
} from "@chakra-ui/react";
import { useMutation } from "react-query";
import api from "@services/api";
import useAuth from "@hooks/useAuth";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaLock,
  FaLockOpen,
} from "react-icons/fa";
import Req from "@interfaces/Req";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  cpf: z
    .string()
    .length(11, "O CPF deve ter 11 dígitos")
    .regex(/^\d+$/, "Insira apenas números no CPF"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 dígitos"),
});

type FormData = z.infer<typeof schema>;

interface LoginResponse {
  token: string;
}

const login = async (data: FormData) => {
  const response = await api.post<Req<LoginResponse>>("/auth/login", data);
  return response.data.data;
};

const Login: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const toast = useToast();
  const [, setAuth] = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordVisibility = () => setShowPassword((prev) => !prev);
  const { mutateAsync, isLoading } = useMutation(login, {
    onSuccess: (data) => {
      setAuth(data.token);
      toast({
        title: "Login realizado com sucesso",
        description: "Sucesso",
        duration: 2500,
        isClosable: true,
        status: "success",
        position: "top-right",
        icon: <FaCheckCircle />,
      });
      navigate("/portal");
    },
    onError: (error: AxiosError<Req<LoginResponse>>) => {
      toast({
        title: "Erro ao realizar login",
        description: error?.response?.data?.message ?? "Erro ao realizar login",
        duration: 2500,
        isClosable: true,
        status: "error",
        position: "top-right",
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
    >
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
      <Card p="10" w={{ base: "100%", md: "450px" }}>
        <CardBody>
          <form onSubmit={onSubmit}>
            <FormControl id="cpf" mt={4} isInvalid={!!errors.cpf}>
              <FormLabel>CPF</FormLabel>
              <Input {...register("cpf")} />

              {errors.cpf && (
                <FormHelperText color="red">
                  {errors.cpf.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              id="password"
              mt={4}
              isInvalid={!!errors.password}
              position="relative"
            >
              <FormLabel>Senha</FormLabel>
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
              />
              <IconButton
                bg="transparent !important"
                variant="ghost"
                aria-label={showPassword ? "Mask password" : "Show password"}
                icon={showPassword ? <FaLockOpen /> : <FaLock />}
                onClick={handlePasswordVisibility}
                position="absolute"
                right="0"
                zIndex={2}
              />

              {errors.password && (
                <FormHelperText color="red">
                  {errors.password.message}
                </FormHelperText>
              )}
            </FormControl>
            <Button
              mt={4}
              colorScheme="teal"
              type="submit"
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Login;
