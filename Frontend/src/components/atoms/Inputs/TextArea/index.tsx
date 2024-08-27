import {
  FormControl,
  FormLabel,
  Textarea as TextAreaChackra,
} from "@chakra-ui/react";
import React from "react";
import ErrorMessage from "../ErrorMessage";
import { useFormContext } from "react-hook-form";
import InfoTooltip from "../InfoTooltip";

interface TextAreaProps {
  input: {
    id: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    describe?: string | null;
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
      <TextAreaChackra
        placeholder={input?.placeholder}
        {...register(input.id)}
      />
      <ErrorMessage id={input.id} />
    </FormControl>
  );
};

export default TextArea;
