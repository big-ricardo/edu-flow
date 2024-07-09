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
import { getActivity, setUserEvaluations } from "@apis/activity";
import ActivityDetails from "@components/organisms/ActivityDetails";
import InputUser from "@components/atoms/Inputs/InputUser";
import ActivityProvider from "@contexts/ActivityContext";

const activitySchema = z.object({
  users: z.array(
    z.object({
      _id: z.string().optional(),
      name: z
        .string()
        .min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
      email: z.string().email(),
      matriculation: z.string().optional(),
      isExternal: z.boolean().optional(),
      institute: z.object({
        _id: z.string().optional(),
        name: z.string(),
        active: z.boolean().default(true),
        acronym: z.string(),
        university: z.object({
          _id: z.string().optional(),
          name: z.string(),
          acronym: z.string(),
        }),
      }),
    })
  ),
});

type ActivityFormSchema = z.infer<typeof activitySchema>;

export default function ActivityBoardDefinition() {
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string, evaluation_id: string }>();
  const id = params.id ?? "";

  const { data: activity, isLoading } = useQuery({
    queryKey: ["activity", id],
    queryFn: getActivity,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: setUserEvaluations,
    onSuccess: () => {
      toast({
        title: "Atividade salvada com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
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
      await mutateAsync({
        activity: id,
        evaluation: params.evaluation_id ?? "",
        data,
      });
    }
  });

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    if (activity) {
      reset();
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
      <ActivityProvider>
        <ActivityDetails
          activity={activity}
          minWidth={"50%"}
          overflowY={"auto"}
        />
      </ActivityProvider>
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
              Definição de Avaliadores
            </Box>
          </CardHeader>
          <CardBody display="flex" flexDirection="column" gap="4">
            <InputUser
              input={{
                id: "users",
                label: "Adicione os avaliadores",
                created: true,
                 multi: true
              }}
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
