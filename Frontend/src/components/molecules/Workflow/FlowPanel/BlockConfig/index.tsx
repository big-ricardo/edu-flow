import { getWorkflowForms } from "@apis/workflows";
import { useQuery } from "@tanstack/react-query";
import { NodeTypes } from "@interfaces/Workflow";
import React, { useCallback } from "react";
import Select from "@components/atoms/Inputs/Select";
import { useForm } from "react-hook-form";
import { Button, Flex, Spinner } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Text from "@components/atoms/Inputs/Text";
import nodesSchema, { BlockFormInputs } from "@utils/nodesSchema";
import Switch from "@components/atoms/Inputs/Switch";

interface BlockConfigProps {
  type: NodeTypes;
  data: BlockFormInputs;
  onSave: (data: BlockFormInputs) => void;
}

const BlockConfig: React.FC<BlockConfigProps> = ({ type, data, onSave }) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlockFormInputs>({
    defaultValues: data,
    resolver: zodResolver(nodesSchema[type]),
  });

  const { data: formsData, isLoading: isLoadingForms } = useQuery({
    queryKey: ["workflows", "forms"],
    queryFn: getWorkflowForms,
    retryOnMount: false,
    staleTime: 1000 * 60 * 60,
  });

  const onSubmit = handleSubmit((data) => {
    onSave(data);
  });

  const onCancel = useCallback(() => {
    reset();
  }, [reset]);

  const RenderInputs = useCallback(() => {
    switch (type) {
      case NodeTypes.SendEmail:
        return (
          <>
            <Text
              input={{
                label: "Nome",
                id: "name",
                placeholder: "Nome do bloco",
                required: true,
              }}
              register={register}
              errors={errors}
            />
            <Select
              input={{
                label: "Destinatario",
                id: "to",
                placeholder: "Selecione um formulário",
                options: formsData?.users ?? [],
                required: true,
              }}
              control={control}
              errors={errors}
              isMulti
            />
            <Select
              input={{
                label: "Template de Email",
                id: "email",
                placeholder: "Selecione um template de email",
                options: formsData?.emails ?? [],
                required: true,
              }}
              control={control}
              errors={errors}
            />
            <Switch
              input={{
                label: "Visivel",
                id: "visible",
                required: true,
              }}
              control={control}
              errors={errors}
            />
          </>
        );
      case NodeTypes.ChangeStatus:
        return (
          <>
            <Text
              input={{
                label: "Nome",
                id: "name",
                placeholder: "Nome do bloco",
                required: true,
              }}
              register={register}
              errors={errors}
            />
            <Select
              input={{
                label: "Status",
                id: "status",
                placeholder: "Selecione um status",
                options: formsData?.statuses ?? [],
                required: true,
              }}
              control={control}
              errors={errors}
            />
            <Switch
              input={{
                label: "Visivel",
                id: "visible",
                required: true,
              }}
              control={control}
              errors={errors}
            />
          </>
        );
      case NodeTypes.Circle:
        return (
          <Text
            input={{
              label: "Nome",
              id: "name",
              placeholder: "Nome do Workflow",
              required: true,
            }}
            register={register}
            errors={errors}
          />
        );
      default:
        return <h1>Default</h1>;
    }
  }, [type, formsData, register, control, errors]);

  return (
    <Flex direction="column" justify="space-between" h="100%">
      {isLoadingForms ? (
        <Spinner />
      ) : (
        <Flex justify="start" gap={5} direction="column">
          <RenderInputs />
        </Flex>
      )}
      <Flex justify="flex-end" mb={5}>
        <Button mr={3} onClick={onCancel}>
          Cancelar
        </Button>
        <Button colorScheme="blue" mr={3} onClick={onSubmit}>
          Salvar
        </Button>
      </Flex>
    </Flex>
  );
};

export default BlockConfig;
