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
import Select from "@components/atoms/Inputs/Select";
import { getActivity, getActivityForms } from "@apis/activity";
import { createOrUpdateStatus } from "@apis/status";
import TextArea from "@components/atoms/Inputs/TextArea";
import ActivityDetails from "@components/organisms/ActivityDetails";

const statusSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
  type: z.enum(["done", "progress", "canceled"]),
});

type StatusFormSchema = z.infer<typeof statusSchema>;

export default function ActivityProcess() {
  const toast = useToast();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const queryClient = useQueryClient();

  const isEditing = !!params?.id;
  const id = params?.id ?? "";

  const { data: activity, isLoading } = useQuery({
    queryKey: ["activity", id],
    queryFn: getActivity,
    enabled: isEditing,
  });

  const { data: formData, isLoading: isLoadingForms } = useQuery({
    queryKey: ["activity", "forms"],
    queryFn: getActivityForms,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createOrUpdateStatus,
    onSuccess: () => {
      toast({
        title: `ActivityProcess ${
          isEditing ? "editada" : "criada"
        } com sucesso`,
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
        title: `Erro ao ${isEditing ? "editar" : "criar"} status`,
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
    },
  });

  const methods = useForm<StatusFormSchema>({
    resolver: zodResolver(statusSchema),
    defaultValues: activity ?? {},
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync(isEditing ? { ...data, _id: id } : data);
  });

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    if (activity) {
      reset(activity);
    }
  }, [activity, reset]);

  useEffect(() => {}, [errors]);

  return (
    <Flex
      w="100%"
      my="6"
      mx="auto"
      px="6"
      justify="center"
      direction="row"
      gap={9}
    >
      <ActivityDetails
        activity={activity}
        minWidth={"50%"}
        overflowY={"auto"}
      />
      <FormProvider {...methods}>
        <Card
          as="form"
          onSubmit={onSubmit}
          borderRadius={8}
          h="fit-content"
          w="100%"
          maxW="600px"
        >
          <CardHeader>
            <Box textAlign="center" fontSize="lg" fontWeight="bold">
              Confirmação de Atividade
            </Box>
          </CardHeader>
          <CardBody display="flex" flexDirection="column" gap="4">
            <Text
              input={{
                id: "name",
                label: "Nome",
                placeholder: "Nome",
                required: true,
              }}
            />

            <TextArea
              input={{
                id: "description",
                label: "Descrição",
                placeholder: "Descrição",
                required: true,
              }}
            />

            <Select
              input={{
                id: "masterminds",
                label: "Orientadores",
                placeholder: "Selecione os orientadores",
                required: true,
                options: formData?.teachers ?? [],
              }}
              isLoading={isLoadingForms}
              isMulti
            />
            <Select
              input={{
                id: "sub-masterminds",
                label: "Co-Orientadores",
                placeholder: "Selecione os co-orientadores",
                required: false,
                options: formData?.teachers ?? [],
              }}
              isLoading={isLoadingForms}
              isMulti
            />

            <Select
              input={{
                id: "users",
                label: "Alunos",
                placeholder: "Selecione os alunos",
                required: true,
                options: formData?.students ?? [],
              }}
              isLoading={isLoadingForms}
              isMulti
            />

            <Flex mt="8" justify="flex-end" gap="4">
              <Button
                mt={4}
                colorScheme="gray"
                variant="outline"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button
                mt={4}
                colorScheme="blue"
                isLoading={isPending || isLoading}
                type="submit"
              >
                {isEditing ? "Editar" : "Criar"}
              </Button>
            </Flex>
          </CardBody>
        </Card>
      </FormProvider>
    </Flex>
  );
}
