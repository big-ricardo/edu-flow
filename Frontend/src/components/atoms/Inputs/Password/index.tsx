import {
  FormControl,
  FormLabel,
  Input,
  IconButton,
} from "@chakra-ui/react";
import React, { useCallback } from "react";
import { UseFormRegister, FieldErrors, FieldValues } from "react-hook-form";
import { FaLockOpen, FaLock } from "react-icons/fa";
import ErrorMessage from "../ErrorMessage";

interface TextProps {
  input: {
    id: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
  };
  register: UseFormRegister<any>;
  errors: FieldErrors<FieldValues>;
}

const Password: React.FC<TextProps> = ({ register, errors, input }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handlePasswordVisibility = useCallback(
    () => setShowPassword((prev) => !prev),
    []
  );

  return (
    <FormControl
      id="password"
      mt={4}
      isInvalid={!!errors.password}
      position="relative"
      isRequired={input.required}
    >
      <FormLabel>{input.label}</FormLabel>
      <Input
        {...register(input.id)}
        placeholder={input?.placeholder}
        type={showPassword ? "text" : "password"}
      />
      <IconButton
        bg="transparent !important"
        variant="ghost"
        aria-label={showPassword ? "Mask password" : "Show password"}
        icon={showPassword ? <FaLockOpen /> : <FaLock />}
        onClick={handlePasswordVisibility}
        position="absolute"
        right="0"
        zIndex={2}
      />

      <ErrorMessage error={errors?.[input.id]} />
    </FormControl>
  );
};

export default Password;
