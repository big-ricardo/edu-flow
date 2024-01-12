import { Flex, Button, Divider } from "@chakra-ui/react";
import Text from "@components/atoms/Inputs/Text";
import Select from "@components/atoms/Inputs/Select";
import Checkbox from "@components/atoms/Inputs/Checkbox";
import { formFormSchema } from "@pages/Portal/Forms/Form";
import { memo } from "react";
import {
  FieldArrayWithId,
  UseFormRegister,
  Control,
  UseFieldArrayRemove,
  FieldErrors,
  FieldValues,
} from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import FieldArrayOption from "@components/atoms/FieldArrayOption";

interface FieldFormsProps {
  field: FieldArrayWithId<formFormSchema, "fields", "id">;
  index: number;
  register: UseFormRegister<formFormSchema>;
  control: Control<formFormSchema>;
  remove: UseFieldArrayRemove;
  errors: FieldErrors<FieldValues>;
  haveOptions: boolean;
}

const FieldArray = memo(
  ({
    field,
    index,
    register,
    control,
    remove,
    errors,
    haveOptions,
  }: Readonly<FieldFormsProps>) => {
    return (
      <Flex key={field.id} direction="column" borderRadius="md" gap={4} p="4">
        <Text
          input={{
            id: `fields.${index}.id`,
            label: "Digite o id do campo",
            placeholder: "Identificação",
            required: true,
          }}
          register={register}
          errors={errors}
        />
        <Text
          input={{
            id: `fields.${index}.label`,
            label: "Digite o label do campo",
            placeholder: "Label",
            required: true,
          }}
          register={register}
          errors={errors}
        />

        <Select
          input={{
            id: `fields.${index}.type`,
            label: "Tipo",
            placeholder: "Tipo",
            required: true,
            options: [
              { label: "Texto", value: "text" },
              { label: "Número", value: "number" },
              { label: "Email", value: "email" },
              { label: "Senha", value: "password" },
              { label: "Textarea", value: "textarea" },
              { label: "Checkbox", value: "checkbox" },
              { label: "Radio", value: "radio" },
              { label: "Select", value: "select" },
              { label: "Data", value: "date" },
              { label: "Arquivo", value: "file" },
              { label: "Professores", value: "teachers" },
            ],
          }}
          control={control}
          errors={errors}
        />

        {haveOptions && (
          <FieldArrayOption
            index={index}
            register={register}
            control={control}
            errors={errors}
          />
        )}

        <Text
          input={{
            id: `fields.${index}.placeholder`,
            label: "Digite o placeholder do campo",
            placeholder: "Placeholder",
            required: false,
          }}
          register={register}
          errors={errors}
        />

        <Checkbox
          input={{
            id: `fields.${index}.required`,
            label: "Campo obrigatório",
            required: false,
          }}
          control={control}
          errors={errors}
        />

        <Checkbox
          input={{
            id: `fields.${index}.visible`,
            label: "Visivel para o usuário",
            required: false,
          }}
          control={control}
          errors={errors}
        />

        <Button
          type="button"
          onClick={() => remove(index)}
          colorScheme="red"
          w="min-content"
        >
          <FaTrash />
        </Button>
        <Divider />
      </Flex>
    );
  }
);

export default FieldArray;
