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
  CardProps,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getStatus, createOrUpdateStatus } from "@apis/status";
import Text from "@components/atoms/Inputs/Text";
import Select from "@components/atoms/Inputs/Select";
import Can from "@components/atoms/Can";

const statusSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
  type: z.enum(["done", "progress", "canceled"]),
});

type StatusFormSchema = z.infer<typeof statusSchema>;

interface StatusFormProps extends CardProps {
  id?: string;
  isModal?: boolean;
}

const StatusForm: React.FC<StatusFormProps> = ({
  id = "",
  isModal,
  ...props
}) => {
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isEditing = !!id;

  const { data: status, isLoading } = useQuery({
    queryKey: ["status", id],
    queryFn: getStatus,
    enabled: isEditing,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createOrUpdateStatus,
    onSuccess: () => {
      toast({
        title: `Status ${isEditing ? "editada" : "criada"} com sucesso`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["statuses"] });
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      !isModal && navigate(-1);
    },
    onError: () => {
      toast({
        title: `Erro ao ${isEditing ? "editar" : "criar"} status`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    },
  });

  const methods = useForm<StatusFormSchema>({
    resolver: zodResolver(statusSchema),
    defaultValues: status ?? {},
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
    reset(status);
  }, [status, reset]);

  useEffect(() => {
    if (status) {
      reset(status);
    }
  }, [status, reset]);

  useEffect(() => {}, [errors]);

  return (
    <FormProvider {...methods}>
      <Card
        as="form"
        onSubmit={onSubmit}
        borderRadius={8}
        h="fit-content"
        w="100%"
        maxW="600px"
        {...props}
      >
        <CardHeader>
          <Box textAlign="center" fontSize="lg" fontWeight="bold">
            {isEditing ? "Editar" : "Criar"} Status
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

          <Select
            input={{
              id: "type",
              label: "Tipo",
              placeholder: "Tipo",
              required: true,
              options: [
                { label: "Em progresso", value: "progress" },
                { label: "Concluido", value: "done" },
                { label: "Cancelado", value: "canceled" },
              ],
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
            <Can permission={isEditing ? "status.update" : "status.create"}>
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
  );
};

export default StatusForm;
