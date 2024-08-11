import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import React from "react";
import ErrorMessage from "../ErrorMessage";
import { useFormContext } from "react-hook-form";
import InfoTooltip from "../InfoTooltip";

interface TextProps {
  input: {
    id: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    type?: string;
    isDisabled?: boolean;
    describe?: string | null;
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
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          position: "relative",
        }}
      >
        <FormLabel>{input?.label}</FormLabel>
      </div>

      <InfoTooltip describe={input?.describe} />
      <Input
        type={input?.type ?? "text"}
        placeholder={input?.placeholder}
        {...register(input.id)}
        isDisabled={input?.isDisabled}
      />
      <ErrorMessage id={input.id} />
    </FormControl>
  );
};

export default Text;
