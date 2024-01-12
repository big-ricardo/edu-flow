import {  Button, Divider, Flex, Heading } from "@chakra-ui/react";
import { formFormSchema } from "@pages/Portal/Forms/Form";
import Text from "@components/atoms/Inputs/Text";
import { memo } from "react";
import {
  UseFormRegister,
  Control,
  useFieldArray,
  FieldErrors,
  FieldValues,
} from "react-hook-form";
import { FaTrash } from "react-icons/fa";

interface OptionFieldProps {
  index: number;
  register: UseFormRegister<formFormSchema>;
  control: Control<formFormSchema>;
  errors: FieldErrors<FieldValues>;
}

const FieldArrayOption = memo(
  ({ index, control, register, errors }: Readonly<OptionFieldProps>) => {
    const {
      fields: optionFields,
      append: appendOption,
      remove: removeOption,
    } = useFieldArray({
      control,
      name: `fields.${index}.options`,
    });

    return (
      <Flex shadow="xl" p="4" gap="1" direction="column">
        <Heading as="h6" fontSize="md">
          Opções
        </Heading>
        <Divider />
        {optionFields.map((optionField, optionIndex) => (
          <Flex key={optionField.id} p="1rem" direction="column" gap="4">
            <Text
              input={{
                id: `fields.${index}.options.${optionIndex}.label`,
                label: "Digite o label da opção",
                placeholder: "Label",
                required: true,
              }}
              register={register}
              errors={errors}
            />
            <Text
              input={{
                id: `fields.${index}.options.${optionIndex}.value`,
                label: "Digite o valor da opção",
                placeholder: "Valor",
                required: true,
              }}
              register={register}
              errors={errors}
            />

            <Button
              type="button"
              my="1rem"
              onClick={() => removeOption(optionIndex)}
              colorScheme="red"
              id={`fields-${index}-options-${optionIndex}-btn-remove`}
              w="min-content"
            >
              <FaTrash />
            </Button>
            <Divider />
          </Flex>
        ))}
        <Button
          type="button"
          id={`fields-${index}-options-btn-add`}
          onClick={() => appendOption({ value: "", label: "" })}
          colorScheme="blue"
        >
          Adicionar opção
        </Button>
      </Flex>
    );
  }
);

export default FieldArrayOption;
