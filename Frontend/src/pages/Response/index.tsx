import React, { memo, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import {
  Button,
  Stack,
  Text,
  Center,
  Box,
  Spinner,
  useToast,
  Divider,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { getFormBySlug } from "@apis/form";
import Inputs from "@components/atoms/Inputs";
import { zodResolver } from "@hookform/resolvers/zod";
import convertToZodSchema from "@utils/convertToZodSchema";
import { responseForm } from "@apis/response";
import { getActivity } from "@apis/activity";
import { FieldTypes } from "@interfaces/FormDraft";

interface ResponseProps {
  isPreview?: boolean;
}

const Response: React.FC<ResponseProps> = memo(({ isPreview = false }) => {
  const params = useParams<{ slug: string; activity_id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const bg = useColorModeValue("gray.50", "gray.700");
  const bgWrapper = useColorModeValue("gray.200", "gray.900");

  const activity_id = location.state?.activity_id as string | undefined;

  const {
    data: form,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["form", params.slug ?? ""],
    queryFn: getFormBySlug,
  });

  const {
    data: answer,
    isLoading: isLoadingAnswer,
    isError: isErrorAnswer,
  } = useQuery({
    queryKey: ["activity", params.activity_id ?? "", "edit"],
    queryFn: getActivity,
    enabled: !!params.activity_id,
    select: (data) => {
      return data.form_draft.fields.reduce((acc, field) => {
        if (!field.value) return;
        acc[field.id] = field.value;

        if (field.type === FieldTypes.file) {
          acc[field.id] = field.value?.name;
        }

        if (field.predefined === FieldTypes.teachers) {
          acc[field.id] = Array.isArray(field.value)
            ? field.value.map((el) => el._id)
            : field?.value._id;
        }

        return acc;
      }, {});
    },
  });

  const methods = useForm({
    resolver: zodResolver(convertToZodSchema(form?.published?.fields ?? [])),
    defaultValues: answer,
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = methods;

  console.log(errors);

  useEffect(() => {
    reset(answer);
  }, [answer, reset]);

  const { mutateAsync, isPending: isSubmitting } = useMutation({
    mutationFn: responseForm,
    onSuccess: () => {
      toast({
        title: `Formulário respondido com sucesso`,
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
        title: `Erro ao responder formulário`,
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!form) return;
      await mutateAsync({
        form,
        edit_id: params.activity_id,
        activity_id,
        data,
      });
    } catch (error) {
      console.log("Form validation failed:", error);
    }
  });

  if (isLoading || isLoadingAnswer) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isError || isErrorAnswer) {
    return (
      <Center h="100vh" flexDirection="column">
        <Text>Formulário não encontrado ou não está mais disponível</Text>
        <Text>
          <Button colorScheme="blue" onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </Text>
      </Center>
    );
  }

  if (form?.type !== "created" && !activity_id) {
    return (
      <Center h="100vh">
        <Box>
          <Text>Formulário sem atividade</Text>
          <Text>
            <Button colorScheme="blue" onClick={() => navigate(-1)}>
              Voltar
            </Button>
          </Text>
        </Box>
      </Center>
    );
  }

  return (
    <Box p={4} minH="100vh" bg={bgWrapper}>
      <Button colorScheme="blue" onClick={() => navigate(-1)}>
        Voltar
      </Button>
      <Center>
        <Box bg={bg} w="xl" p={4} borderRadius="md" boxShadow="md">
          <Box mb={4}>
            <Text fontSize="2xl" fontWeight="bold">
              {form?.name}
            </Text>
            <Text>{form?.description}</Text>
            <Divider my={4} />
          </Box>
          <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              <Flex direction="column" align="center" justify="center" gap="3">
                <Inputs fields={form?.published?.fields ?? []} />

                <Stack direction="row" justifyContent="flex-end" mt={4}>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isSubmitting}
                    isDisabled={isPreview || !isDirty}
                  >
                    Enviar
                  </Button>
                </Stack>
              </Flex>
            </form>
          </FormProvider>
        </Box>
      </Center>
    </Box>
  );
});

export default Response;
