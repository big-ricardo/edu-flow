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
import {
  committedActivity,
  getActivity,
  getActivityForms,
} from "@apis/activity";
import TextArea from "@components/atoms/Inputs/TextArea";
import ActivityDetails from "@components/organisms/ActivityDetails";

const activitySchema = z.object({
  _id: z.string(),
  name: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
  description: z
    .string()
    .min(3, { message: "Descrição deve ter no mínimo 3 caracteres" }),
  users: z
    .array(z.string())
    .nonempty({ message: "Selecione pelo menos um aluno" }),
  sub_masterminds: z.array(z.string()),
});

type ActivityFormSchema = z.infer<typeof activitySchema>;

export default function ActivityCommit() {
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const id = params.id ?? "";

  const { data: activity, isLoading } = useQuery({
    queryKey: ["activity", id],
    queryFn: getActivity,
  });

  const { data: formData, isLoading: isLoadingForms } = useQuery({
    queryKey: ["activity", "forms"],
    queryFn: getActivityForms,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: committedActivity,
    onSuccess: () => {
      toast({
        title: "Atividade salvada com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["activity", id] });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: `Erro ao salvar atividade`,
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
    },
  });

  const methods = useForm<ActivityFormSchema>({
    resolver: zodResolver(activitySchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const response = confirm(
      "Deseja confirmar a atividade? Essa ação não poderá ser desfeita"
    );

    if (response) {
      await mutateAsync(data);
    }
  });

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    if (activity) {
      reset({
        ...activity,
        users: activity.users.map((user) => user._id),
        sub_masterminds: activity.sub_masterminds.map(
          (subMastermind) => subMastermind._id
        ),
      });
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
          position="sticky"
          top="5"
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
                id: "sub_masterminds",
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
                Confirmar Atividade
              </Button>
            </Flex>
          </CardBody>
        </Card>
      </FormProvider>
    </Flex>
  );
}
