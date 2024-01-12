import {
  FormControl,
  FormLabel,
  Checkbox as CheckboxChackra,
} from "@chakra-ui/react";
import React from "react";
import { FieldValues, FieldErrors, Controller, Control } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";

interface CheckboxProps {
  input: {
    id: string;
    label: string;
    required?: boolean;
  };
  control: Control<any>;
  errors: FieldErrors<FieldValues>;
}

const Checkbox: React.FC<CheckboxProps> = ({ control, errors, input }) => {
  return (
    <FormControl
      id={input.id}
      isInvalid={!!errors?.[input.id]}
      isRequired={input.required}
    >
      <Controller
        name={input.id}
        control={control}
        render={({ field: { onChange, value } }) => (
          <CheckboxChackra onChange={onChange} value={value} isChecked={value}>
            <FormLabel>{input.label}</FormLabel>
          </CheckboxChackra>
        )}
        rules={{ required: !!input.required }}
      />
      <ErrorMessage error={errors?.[input.id]} />
    </FormControl>
  );
};

export default Checkbox;
