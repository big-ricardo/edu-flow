import {
  FormControl,
  FormLabel,
  Switch as SwitchChackra,
} from "@chakra-ui/react";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";

interface SwitchProps {
  input: {
    id: string;
    label: string;
    required?: boolean;
  };
}

const Switch: React.FC<SwitchProps> = ({ input }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl
      id={input.id}
      isInvalid={!!errors?.[input.id]}
      isRequired={input.required}
      display="flex"
      alignItems="end"
    >
      <FormLabel htmlFor={input.id}>
        {input.label}
        <Controller
          name={input.id}
          control={control}
          render={({ field: { onChange, value } }) => (
            <SwitchChackra
              onChange={onChange}
              isChecked={value}
              ml={2}
              defaultChecked
            />
          )}
          rules={{ required: !!input.required }}
        />
      </FormLabel>
      <ErrorMessage error={errors?.[input.id]} />
    </FormControl>
  );
};

export default Switch;
