import {
  FormControl,
  FormLabel,
  Radio as RadioChackra,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";

type IOption = { value: string; label: string };

interface RadioProps {
  input: {
    id: string;
    label: string;
    placeholder?: string;
    type: string;
    required?: boolean;
    options: IOption[];
  };
}

const Radio: React.FC<RadioProps> = ({ input }) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  return (
    <FormControl
      id={input.id}
      isInvalid={!!errors?.[input.id]}
      isRequired={input.required}
    >
      <FormLabel>{input.label}</FormLabel>
      <Controller
        name={input.id}
        control={control}
        render={({ field: { onChange, value } }) => (
          <RadioGroup onChange={onChange} value={value}>
            <Stack direction="row">
              {input.options?.map((item) => (
                <RadioChackra key={item.label} value={item.value}>
                  {item.label}
                </RadioChackra>
              ))}
            </Stack>
          </RadioGroup>
        )}
        rules={{ required: !!input.required }}
      />
      <ErrorMessage error={errors?.[input.id]} />
    </FormControl>
  );
};

export default Radio;
