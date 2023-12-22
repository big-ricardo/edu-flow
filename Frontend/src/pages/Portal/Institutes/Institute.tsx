import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import {
  getInstitute,
  createOrUpdateInstitute,
  getInstituteForms,
} from "@apis/institutes";
import Text from "@components/atoms/Inputs/Text";
import Switch from "@components/atoms/Inputs/Switch";
import Select from "@components/atoms/Inputs/Select";

const Schema = z.object({
  name: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
  acronym: z
    .string()
    .min(2, { message: "Sigla deve ter no mínimo 2 caracteres" }),
  university: z.string().min(3, { message: "Universidade é obrigatória" }),
  active: z.boolean(),
});

type UniversityFormInputs = z.infer<typeof Schema>;

export default function Institute() {
  const toast = useToast();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const queryClient = useQueryClient();

  const isEditing = !!params?.id;
  const id = params?.id ?? "";

  const { data: institute, isLoading } = useQuery({
    queryKey: ["institute", id],
    queryFn: getInstitute,
    enabled: isEditing,
  });

  const { data: formsData, isLoading: isLoadingForms } = useQuery({
    queryKey: ["universities", "forms"],
    queryFn: getInstituteForms,
    retryOnMount: false,
    staleTime: 1000 * 60 * 60,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createOrUpdateInstitute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutes"] });
      toast({
        title: `Instituto ${isEditing ? "editada" : "criada"} com sucesso`,
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
        title: `Erro ao ${isEditing ? "editar" : "criar"} instituto`,
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UniversityFormInputs>({
    resolver: zodResolver(Schema),
    defaultValues: institute ?? {},
  });

  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync(isEditing ? { ...data, _id: id } : data);
  });

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    if (institute) {
      reset(institute);
    }
  }, [institute, reset]);

  useEffect(() => {}, [errors]);

  return (
    <Flex w="100%" my="6" mx="auto" px="6" justify="center">
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
            {isEditing ? "Editar" : "Criar"} Instituto
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
            register={register}
            errors={errors}
          />

          <Text
            input={{
              id: "acronym",
              label: "Sigla",
              placeholder: "Sigla",
              required: true,
            }}
            register={register}
            errors={errors}
          />

          <Switch
            input={{ id: "active", label: "Ativo" }}
            control={control}
            errors={errors}
          />

          <Select
            input={{
              id: "university",
              label: "Universidade",
              placeholder: "Universidade",
              required: true,
              options: formsData?.universities ?? [],
            }}
            control={control}
            errors={errors}
            isLoading={isLoadingForms}
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
    </Flex>
  );
}
