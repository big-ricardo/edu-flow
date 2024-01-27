import { Flex, Button, useColorModeValue } from "@chakra-ui/react";
import Text from "@components/atoms/Inputs/Text";
import Select from "@components/atoms/Inputs/Select";
import { formFormSchema } from "@pages/Portal/Forms/Form";
import { memo } from "react";
import {
  FieldArrayWithId,
  UseFieldArrayRemove,
  UseFieldArraySwap,
  useFormContext,
} from "react-hook-form";
import { FaArrowDown, FaArrowUp, FaTrash } from "react-icons/fa";
import FieldArrayOption from "@components/atoms/FieldArrayOption";
import Switch from "@components/atoms/Inputs/Switch";
const fieldTypes = {
  text: "Texto",
  number: "Número",
  email: "Email",
  password: "Senha",
  textarea: "Textarea",
  checkbox: "Checkbox",
  radio: "Radio",
  select: "Combobox",
  multiselect: "Multi Combobox",
  date: "Data",
  file: "Arquivo",
};

const fieldOptions = Object.entries(fieldTypes).map(([value, label]) => ({
  value,
  label,
}));

const predefinedTypes = {
  teachers: "Professores",
  students: "Estudantes",
  institutions: "Instituições",
};

const predefinedOptions = Object.entries(predefinedTypes).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

interface FieldFormsProps {
  field: FieldArrayWithId<formFormSchema, "fields", "id">;
  index: number;
  remove: UseFieldArrayRemove;
  swap: UseFieldArraySwap;
  isEnd: boolean;
}

const FieldArray: React.FC<FieldFormsProps> = memo(
  ({ field, index, remove, swap, isEnd }) => {
    const border = useColorModeValue("gray.200", "gray.600");

    const { watch } = useFormContext<formFormSchema>();

    const haveOptions = ["select", "multiselect", "radio", "checkbox"].includes(
      watch(`fields.${index}.type`),
    );
    const isSelect = ["select", "multiselect"].includes(
      watch(`fields.${index}.type`),
    );
    const isPredefined = !!watch(`fields.${index}.predefined`);

    return (
      <Flex
        key={field.id}
        direction="column"
        borderRadius="md"
        gap={4}
        p="4"
        pb="6"
        border="2px"
        borderColor={border}
        position="relative"
      >
        <Flex
          flex={1}
          justify="flex-end"
          gap={2}
          position="absolute"
          top="2"
          right="4"
          zIndex="1"
        >
          <Button
            colorScheme="blue"
            variant="outline"
            size="sm"
            onClick={() => swap(index, index - 1)}
            isDisabled={index === 0}
          >
            <FaArrowUp />
          </Button>

          <Button
            colorScheme="blue"
            variant="outline"
            size="sm"
            onClick={() => swap(index, index + 1)}
            isDisabled={index === 0 || isEnd}
          >
            <FaArrowDown />
          </Button>

          <Button
            colorScheme="red"
            size="sm"
            variant="outline"
            onClick={() => remove(index)}
            isDisabled={field.system}
          >
            <FaTrash />
          </Button>
        </Flex>

        {!field.system && (
          <Flex direction={["column", "row"]} gap={4}>
            <Switch
              input={{
                id: `fields.${index}.required`,
                label: "Campo obrigatório",
                required: false,
              }}
            />

            <Switch
              input={{
                id: `fields.${index}.visible`,
                label: "Visivel para o usuário",
                required: false,
              }}
            />
          </Flex>
        )}

        <Text
          input={{
            id: `fields.${index}.id`,
            label: "Digite a identificação do campo",
            placeholder: "Identificação",
            isDisabled: field.system,
          }}
        />

        <Flex direction={["column", "row"]} gap={4}>
          <Text
            input={{
              id: `fields.${index}.label`,
              label: "Digite o label do campo",
              placeholder: "Label",
              required: true,
            }}
          />

          <Text
            input={{
              id: `fields.${index}.placeholder`,
              label: "Digite o placeholder do campo",
              placeholder: "Placeholder",
              required: false,
            }}
          />
        </Flex>

        <Flex direction={["column", "row"]} gap={4}>
          <Select
            input={{
              id: `fields.${index}.type`,
              label: "Tipo",
              placeholder: "Tipo",
              required: true,
              options: fieldOptions,
              isDisabled: field.system,
            }}
          />

          {isSelect && (
            <Select
              input={{
                id: `fields.${index}.predefined`,
                label: "Selecione caso deseja um tipo pré-definido de opções",
                placeholder: "Tipo pré-definido",
                required: false,
                options: predefinedOptions,
                isDisabled: field.system,
              }}
            />
          )}
        </Flex>

        {haveOptions && !isPredefined && <FieldArrayOption index={index} />}
      </Flex>
    );
  },
);

export default FieldArray;
