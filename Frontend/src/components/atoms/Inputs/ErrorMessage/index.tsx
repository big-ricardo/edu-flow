import { FormHelperText } from "@chakra-ui/react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

interface ErrorMessageProps {
  id: string;
}

const ErrorMessages: React.FC<ErrorMessageProps> = ({ id }) => {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <ErrorMessage
      errors={errors}
      name={id}
      render={({ message, messages }) => (
        <FormHelperText color="red.600">
          {messages &&
            Object.entries(messages).map(([type, message]) => (
              <p key={type}>{message}</p>
            ))}
          {message}
        </FormHelperText>
      )}
    />
  );
};

export default ErrorMessages;
