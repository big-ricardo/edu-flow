import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import React from "react";
import ErrorMessage from "../ErrorMessage";
import { useFormContext } from "react-hook-form";

interface TextProps {
  input: {
    id: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    type?: string;
    isDisabled?: boolean;
  };
}

const Text: React.FC<TextProps> = ({ input }) => {
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
        type={input?.type ?? "text"}
        placeholder={input?.placeholder}
        {...register(input.id)}
        isDisabled={input?.isDisabled}
      />
      <ErrorMessage error={errors?.[input.id]} />
    </FormControl>
  );
};

export default Text;
