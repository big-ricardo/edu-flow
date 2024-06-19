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
  Text,
  Flex,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import InputText from "@components/atoms/Inputs/Text";
import { forgotPassword } from "@apis/auth";

const schema = z.object({
  acronym: z
    .string()
    .min(2, "A sigla deve ter no mínimo 2 caracteres")
    .trim()
    .transform((v) => v.toLowerCase().replace(/ /g, "")),
  email: z.string().email("Insira um email válido"),
});

type FormData = z.infer<typeof schema>;

const ForgotPassword: React.FC = () => {
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = methods;

  const toast = useToast({
    position: "top-right",
    variant: "left-accent",
    isClosable: true,
  });

  const navigate = useNavigate();

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast({
        title: "Email enviado com sucesso",
        status: "success",
        duration: 9000,
        isClosable: true,
        icon: <FaCheckCircle />,
      });
    },
    onError: (error: AxiosError<{ message: string; statusCode: number }>) => {
      toast({
        title: "Erro ao recuperar senha",
        description: error?.response?.data?.message ?? error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
        icon: <FaExclamationCircle />,
      });
    },
  });

  const handleBackLogin = useCallback(() => {
    navigate("/");
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
      justifyContent="center"
      height="100vh"
      gap="10"
      bg={"bg.page"}
    >
      <FormProvider {...methods}>
        <Card
          p={[4, 8]}
          w={{ base: "100%", md: "450px" }}
          boxShadow="lg"
          bg={"bg.card"}
        >
          <CardBody>
            <form onSubmit={onSubmit}>
              {isSuccess && (
                <Alert status="success" mb={4}>
                  <AlertIcon />
                  Acesse seu email para recuperar a senha
                </Alert>
              )}

              <Flex direction="column" gap="4">
                <InputText
                  input={{
                    id: "acronym",
                    label: "Domínio",
                    placeholder: "insira o domínio",
                  }}
                />

                <InputText
                  input={{
                    id: "email",
                    label: "Email",
                    placeholder: "Insira o email",
                  }}
                />

                <Button
                  mt={4}
                  type="submit"
                  isLoading={isPending}
                  colorScheme="blue"
                >
                  Recuperar senha
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
                onClick={handleBackLogin}
              >
                Voltar para login
              </Text>
            </Box>
          </CardBody>
        </Card>
      </FormProvider>
    </Box>
  );
};

export default ForgotPassword;
