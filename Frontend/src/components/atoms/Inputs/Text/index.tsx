import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import React from "react";
import ErrorMessage from "../ErrorMessage";
import {
  UseFormRegister,
  FieldValues,
  FieldErrors,
} from "react-hook-form";

interface TextProps {
  input: {
    id: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
  };
  register: UseFormRegister<any>
  errors: FieldErrors<FieldValues>;
}

const Text: React.FC<TextProps> = ({ register, errors, input }) => {
  return (
    <FormControl
      id={input.id}
      isInvalid={!!errors?.[input.id]}
      isRequired={input.required}
    >
      <FormLabel>{input?.label}</FormLabel>
      <Input
        type="text"
        placeholder={input?.placeholder}
        {...register(input.id)}
      />
      <ErrorMessage error={errors?.[input.id]} />
    </FormControl>
  );
};

export default Text;
