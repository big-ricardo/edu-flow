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
  Divider,
  Flex,
  Heading,
  Spinner,
  Tag,
  useToast,
  Text as Typography,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import Text from "@components/atoms/Inputs/Text";
import { createOrUpdateWorkflow, getWorkflow } from "@apis/workflows";
import Switch from "@components/atoms/Inputs/Switch";
import { getWorkflowDrafts } from "@apis/workflowDraft";
import { FaEdit } from "react-icons/fa";

const statusSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
  active: z.boolean().default(true),
});

type StatusFormSchema = z.infer<typeof statusSchema>;

const statusWorkflow = {
  draft: "Rascunho",
  published: "Publicado",
};

function convertDateTime(date: string) {
  const d = new Date(date);
  return Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    minute: "2-digit",
    hour: "2-digit",
  }).format(d);
}

export default function Workflow() {
  const toast = useToast();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const queryClient = useQueryClient();

  const isEditing = !!params?.id;
  const id = params?.id ?? "";

  const { data: workflow, isLoading } = useQuery({
    queryKey: ["workflow", id],
    queryFn: getWorkflow,
    enabled: isEditing,
  });

  const { data: workflowDrafts, isLoading: isLoadingDrafts } = useQuery({
    queryKey: ["workflow-draft", id],
    queryFn: getWorkflowDrafts,
    enabled: isEditing,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createOrUpdateWorkflow,
    onSuccess: (data) => {
      toast({
        title: `Workflow ${isEditing ? "editada" : "criada"} com sucesso`,
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      navigate(`/portal/workflow/${data._id}`);
    },
    onError: () => {
      toast({
        title: `Erro ao ${isEditing ? "editar" : "criar"} workflow`,
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
    defaultValues: workflow ?? {},
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync(isEditing ? { ...data, _id: id } : data);
  });

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    if (workflow) {
      reset(workflow);
    }
  }, [workflow, reset]);

  const handleNewDraft = useCallback(() => {
    navigate(`/portal/workflow-draft/${id}`);
  }, [navigate, id]);

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
          maxW="600px"
        >
          <CardHeader>
            <Box textAlign="center" fontSize="lg" fontWeight="bold">
              {isEditing ? "Editar" : "Criar"} Workflow
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

            <Switch
              input={{
                id: "active",
                label: "Ativo",
              }}
            />

            <Flex justify="flex-end" gap="4">
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
                isDisabled={!isDirty}
              >
                {isEditing ? "Editar" : "Criar"}
              </Button>
            </Flex>

            <Flex
              mt="8"
              justify="center"
              align="start"
              direction="column"
              gap="5"
            >
              {isEditing && <Heading fontSize={"x-large"}>Versões</Heading>}
              <Divider />

              {isLoadingDrafts && <Spinner />}

              <Flex direction="column" gap="5" wrap="wrap" w="100%">
                {!workflowDrafts?.workflows?.length && isEditing && (
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    onClick={handleNewDraft}
                  >
                    Criar rascunho
                  </Button>
                )}

                {workflowDrafts?.workflows?.map((draft) => (
                  <Flex
                    key={draft._id}
                    border="1px solid"
                    borderColor="gray.600"
                    p="4"
                    borderRadius="8"
                    direction="column"
                    gap="1"
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                      direction="row"
                      gap="4"
                      borderColor={
                        draft.status === "draft" ? "blue.500" : "gray.500"
                      }
                      w="100%"
                    >
                      <Tag
                        colorScheme={
                          draft.status === "draft" ? "gray" : "green"
                        }
                      >
                        {statusWorkflow[draft.status]}
                      </Tag>
                      <Typography size="sm">Versão #{draft.version}</Typography>
                      <Typography fontSize="sm">
                        {convertDateTime(draft.createdAt)}
                      </Typography>
                      <Button
                        colorScheme="blue"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigate(`/portal/workflow-draft/${id}/${draft._id}`);
                        }}
                      >
                        <FaEdit />
                      </Button>
                    </Flex>
                    <Divider />
                    <Typography fontSize="sm">
                      Criado por: {draft.owner?.name ?? "Anônimo"}
                    </Typography>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      </FormProvider>
    </Flex>
  );
}
