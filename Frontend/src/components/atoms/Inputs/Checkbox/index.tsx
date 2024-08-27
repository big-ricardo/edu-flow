import {
  FormControl,
  FormLabel,
  Checkbox as CheckboxChackra,
  CheckboxGroup,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import InfoTooltip from "../InfoTooltip";

interface CheckboxProps {
  input: {
    id: string;
    label: string;
    required?: boolean;
    options?: { value: string; label: string }[];
    describe?: string | null;
  };
}

const Checkbox: React.FC<CheckboxProps> = ({ input }) => {
  const { control, getValues } = useFormContext();

  return (
    <FormControl
      id={input.id}
      isRequired={(input.required && !getValues(input.id)?.length)}
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
      <Controller
        name={input.id}
        control={control}
        render={({ field: { onChange, value } }) => (
          <CheckboxGroup
            colorScheme="blue"
            defaultValue={value}
            onChange={onChange}
          >
            <VStack align="start">
              {input.options?.map((item) => (
                <CheckboxChackra key={item.label} value={item.value}>
                  {item.label}
                </CheckboxChackra>
              ))}
            </VStack>
          </CheckboxGroup>
        )}
        rules={{ required: !!input.required }}
      />
      <ErrorMessage id={input.id} />
    </FormControl>
  );
};

export default Checkbox;
