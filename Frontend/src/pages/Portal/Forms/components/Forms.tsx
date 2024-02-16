import React, { memo, useCallback } from "react";
import {
  UseFieldArrayInsert,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Flex, FormControl, Heading } from "@chakra-ui/react";
import Text from "@components/atoms/Inputs/Text";
import Select from "@components/atoms/Inputs/Select";
import { getFormForms } from "@apis/form";
import TextArea from "@components/atoms/Inputs/TextArea";
import FieldArray from "./FieldArray";
import { FaPlus } from "react-icons/fa";
import { formFormSchema } from "../schema";
import ErrorMessages from "@components/atoms/Inputs/ErrorMessage";

interface FormEditProps {
  isEditing: boolean;
  formType: "created" | "interaction" | "evaluated";
  isCreated: boolean;
}

const FormEdit: React.FC<FormEditProps> = memo(({ isEditing, isCreated }) => {
  const { control,
    formState: { errors }
  } = useFormContext<formFormSchema>();

  console.log(errors);

  const { data: formsData, isLoading: isLoadingForms } = useQuery({
    queryKey: ["forms", "forms"],
    queryFn: getFormForms,
    retryOnMount: false,
    staleTime: 1000 * 60 * 60,
  });

  const { fields, insert, remove, swap } = useFieldArray({
    control,
    name: "fields",
  });

  return (
    <React.Fragment>
      <Heading size="md">Configurações</Heading>
      <Divider />

      <FormControl>
        <ErrorMessages id={`refine`} />
      </FormControl>

      <Text
        input={{
          id: "name",
          label: "Nome",
          placeholder: "Nome",
          required: true,
        }}
      />

      <Text
        input={{
          id: "slug",
          label: "Digite um sluf único para o formulário",
          placeholder: "Slug",
          required: true,
        }}
      />

      <Flex gap="4">
        {isEditing && (
          <Select
            input={{
              id: "status",
              label: "Status",
              placeholder: "Status",
              required: true,
              options: [
                { label: "Rascunho", value: "draft" },
                { label: "Publicado", value: "published" },
              ],
            }}
            isLoading={isLoadingForms}
          />
        )}

        {isCreated && (
          <Select
            input={{
              id: "workflow",
              label: "Workflow",
              placeholder: "Workflow Acionado",
              required: true,
              options: formsData?.workflows ?? [],
            }}
            isLoading={isLoadingForms}
          />
        )}
      </Flex>

      <Flex gap="4">
        <Select
          input={{
            id: "type",
            label: "Tipo",
            placeholder: "Tipo",
            required: true,
            options: [
              { label: "Criação de Atividade", value: "created" },
              { label: "Interação com Atividade", value: "interaction" },
              { label: "Avaliação de Atividade", value: "evaluated" },
            ],
            isDisabled: true,
          }}
        />

        {isCreated && (
          <Select
            input={{
              id: "initial_status",
              label: "Status inicial da atividade",
              placeholder: "Status inicial",
              required: true,
              options: formsData?.status ?? [],
            }}
            isLoading={isLoadingForms}
          />
        )}
      </Flex>

      <TextArea
        input={{
          id: "description",
          label: "Descrição",
          placeholder: "Descrição",
          required: true,
        }}
      />

      <Flex gap="4" mb="5">
        <Text
          input={{
            id: "period.open",
            label: "Abertura",
            placeholder: "Abertura",
            type: "date",
          }}
        />

        <Text
          input={{
            id: "period.close",
            label: "Fechamento",
            placeholder: "Fechamento",
            type: "date",
          }}
        />
      </Flex>

      <Heading size="md">Campos do formulário</Heading>
      <Divider />

      <ButtonAdd insert={insert} />

      {fields.map((field, index) => (
        <Flex key={field.id} direction="column" gap="4">
          <FieldArray
            field={field}
            index={index}
            remove={remove}
            swap={swap}
            isEnd={index === fields.length - 1}
          />
          <ButtonAdd insert={insert} index={index} length={fields.length} />
        </Flex>
      ))}
    </React.Fragment>
  );
});

interface ButtonAddProps {
  insert: UseFieldArrayInsert<formFormSchema, "fields">;
  index?: number;
  length?: number;
}

const ButtonAdd: React.FC<ButtonAddProps> = ({
  insert,
  index = 0,
  length = 0,
}) => {
  const handleAddField = useCallback(() => {
    insert(
      index + 1,
      {
        id: `field-${length}`,
        label: "",
        placeholder: "",
        type: "text",
        required: true,
        system: false,
        value: "",
        weight: undefined,
        options: undefined,
        visible: true,
        predefined: null,
      },
      { shouldFocus: true }
    );
  }, [insert, index, length]);

  return (
    <>
      <Button
        colorScheme="blue"
        variant="outline"
        size="sm"
        onClick={handleAddField}
        title="Adicionar campo"
        w="fit-content"
        margin="auto"
      >
        <FaPlus />
      </Button>
      <FormControl>
        <ErrorMessages id={`fields.root`} />
      </FormControl>
    </>
  );
};

export default FormEdit;
