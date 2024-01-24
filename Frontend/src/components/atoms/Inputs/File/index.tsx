import {
  InputGroup,
  InputLeftElement,
  Icon,
  Input,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import React, { useRef, useEffect } from "react";
import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";
import { FiFile } from "react-icons/fi";
import ErrorMessage from "../ErrorMessage";

interface FileProps {
  input: {
    id: string;
    label: string;
    placeholder?: string;
    required?: boolean;
  };
  errors: FieldErrors<FieldValues>;
  register: UseFormRegister<FieldValues>;
}

const File: React.FC<FileProps> = ({ input, register, errors }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { ref, ...rest } = register(input.id) as {
    ref: (instance: HTMLInputElement | null) => void;
  };

  const [, setFile] = React.useState<File>();

  const haveFile = inputRef.current?.files?.[0];

  useEffect(() => {
    const file = inputRef.current;

    file?.addEventListener("change", () => {
      setFile(file?.files?.[0]);
    });

    return () => {
      file?.removeEventListener("change", () => {
        setFile(file?.files?.[0]);
      });
    };
  }, []);

  return (
    <FormControl
      id={input.id}
      isInvalid={!!errors?.[input.id]}
      isRequired={input.required}
    >
      <FormLabel>{input.label}</FormLabel>
      <InputGroup
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        <InputLeftElement pointerEvents="none">
          <Icon as={FiFile} />
        </InputLeftElement>
        <Input
          type="file"
          {...rest}
          ref={(e) => {
            ref(e);
            inputRef.current = e;
          }}
          hidden
        />
        <Input
          type="text"
          cursor="pointer"
          placeholder={
            haveFile ? inputRef.current?.files?.[0].name : input.placeholder
          }
          readOnly
        />
      </InputGroup>
      <ErrorMessage error={errors?.[input.id]} />
    </FormControl>
  );
};

export default File;
