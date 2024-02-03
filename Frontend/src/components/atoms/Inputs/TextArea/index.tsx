import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import React from "react";
import ErrorMessage from "../ErrorMessage";
import { useFormContext } from "react-hook-form";

interface TextAreaProps {
  input: {
    id: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
  };
}

const TextArea: React.FC<TextAreaProps> = ({ input }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl
      id={input.id}
      isInvalid={!!errors?.[input.id]}
      isRequired={input.required}
    >
      <FormLabel>{input?.label}</FormLabel>
      <Input
        as="textarea"
        placeholder={input?.placeholder}
        {...register(input.id)}
      />
      <ErrorMessage id={input.id} />
    </FormControl>
  );
};

export default TextArea;
