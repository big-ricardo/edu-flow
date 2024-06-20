import { Button, Divider, Flex, Heading } from "@chakra-ui/react";
import Text from "@components/atoms/Inputs/Text";
import { formFormSchema } from "@pages/Portal/FormDrafts/schema";
import { memo, useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa";

interface OptionFieldProps {
  index: number;
}

const FieldArrayOption = memo(({ index }: Readonly<OptionFieldProps>) => {
  const { control } = useFormContext<formFormSchema>();

  const { fields, insert, remove } = useFieldArray({
    control,
    name: `fields.${index}.options`,
    rules: { required: true, minLength: 1 },
  });

  useEffect(() => {
    if (fields.length === 0) {
      insert(0, { label: "", value: "" });
    }
  }, [fields.length, insert]);

  return (
    <Flex gap="1" direction="column">
      <Heading as="h6" fontSize="md">
        Opções
      </Heading>
      <Divider />
      {fields.map((optionField, optionIndex) => (
        <div key={optionField.id}>
          <Flex
            key={optionField.id}
            p="1rem"
            direction={["column", "row"]}
            gap="4"
          >
            <Text
              input={{
                id: `fields.${index}.options.${optionIndex}.label`,
                label: "Digite o label da opção",
                placeholder: "Label",
                required: true,
              }}
            />
            <Text
              input={{
                id: `fields.${index}.options.${optionIndex}.value`,
                label: "Digite o valor da opção",
                placeholder: "Valor",
                required: true,
              }}
            />

            <Button
              onClick={() => remove(optionIndex)}
              colorScheme="red"
              id={`fields-${index}-options-${optionIndex}-btn-remove`}
              mt="auto"
              variant="outline"
              size="sm"
              isDisabled={fields.length === 1}
            >
              <FaTrash size="1.2rem" />
            </Button>
            <Button
              id={`fields-${index}-options-btn-add`}
              onClick={() => insert(optionIndex + 1, { label: "", value: "" })}
              colorScheme="blue"
              mt="auto"
              variant="outline"
              size="sm"
              mx="auto"
            >
              <FaPlus size="1.2rem" />
            </Button>
          </Flex>
          <Divider />
        </div>
      ))}

      {fields.length === 0 && (
        <Button
          id={`fields-${index}-options-btn-add`}
          onClick={() => insert(0, { label: "", value: "" })}
          colorScheme="blue"
          mt="auto"
          variant="outline"
          size="sm"
          mx="auto"
        >
          <FaPlus size="0.9rem" />
        </Button>
      )}
    </Flex>
  );
});

export default FieldArrayOption;
