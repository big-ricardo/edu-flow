import { FormHelperText } from "@chakra-ui/react";
import React from "react";
import {
  FieldError,
  Merge,
  FieldErrorsImpl,
  FieldValues,
} from "react-hook-form";

interface ErrorMessageProps {
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<FieldValues>>;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  return (
    <>
      {typeof error?.message === "string" && (
        <FormHelperText color={"red"}>{error.message}</FormHelperText>
      )}
    </>
  );
};

export default ErrorMessage;
