import { InputGroup, InputLeftElement, Icon, Input } from "@chakra-ui/react";
import React, { useRef, useEffect } from "react";
import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";
import { FiFile } from "react-icons/fi";

interface FileProps {
  input: {
    id: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    options: { label: string; value: string }[];
  };
  errors: FieldErrors<FieldValues>;
  register: UseFormRegister<any>;
  isMulti?: boolean;
  isLoading?: boolean;
}

const InputFile: React.FC<FileProps> = ({ input, register }) => {
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
    <InputGroup
      onClick={() => {
        inputRef.current?.click();
      }}
    >
      <InputLeftElement pointerEvents="none" children={<Icon as={FiFile} />} />
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
  );
};

export default InputFile;
