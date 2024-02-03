import {
  FormControl,
  FormLabel,
  Checkbox as CheckboxChackra,
} from "@chakra-ui/react";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";

interface CheckboxProps {
  input: {
    id: string;
    label: string;
    required?: boolean;
  };
}

const Checkbox: React.FC<CheckboxProps> = ({ input }) => {
  const { control } = useFormContext();

  return (
    <FormControl id={input.id} isRequired={input.required}>
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
      <ErrorMessage id={input.id} />
    </FormControl>
  );
};

export default Checkbox;
