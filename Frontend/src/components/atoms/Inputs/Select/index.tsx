import { FormControl, FormLabel, useColorMode } from "@chakra-ui/react";
import React, { useCallback, useMemo } from "react";
import ErrorMessage from "../ErrorMessage";
import { FieldValues, FieldErrors, Control, Controller } from "react-hook-form";
import ReactSelect, { StylesConfig } from "react-select";

interface SelectProps {
  input: {
    id: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    options:
      | { value: string; label: string }[]
      | { label: string; options: { value: string; label: string }[] }[];
  };
  errors: FieldErrors<FieldValues>;
  control: Control<any>;
  isMulti?: boolean;
  isLoading?: boolean;
}

const Select: React.FC<SelectProps> = ({
  errors,
  input,
  control,
  isMulti,
  isLoading,
}) => {
  const { colorMode } = useColorMode();

  const borderColor = colorMode === "light" ? "#cbd5e0" : "#4a5568";
  const backgroundColor = colorMode === "light" ? "#fff" : "#2D3748";
  const backgroundColorSelected = colorMode === "light" ? "#90cdf4" : "#395161";
  const backgroundColorHover = colorMode === "light" ? "#e9e9e9" : "#363636";
  const color = colorMode === "light" ? "#000" : "#fff";

  const styles: StylesConfig = useMemo(() => {
    return {
      control: (provided) => ({
        ...provided,
        borderColor: "none",
        backgroundColor: "none",
        borderRadius: "0.375rem",
        boxShadow: "none",
        "&:hover": {
          borderColor: borderColor,
        },
        "&:focus": {
          borderColor: borderColor,
        },
      }),
      input: (provided) => ({
        ...provided,
        color: color,
      }),
      singleValue: (provided) => ({
        ...provided,
        color: color,
      }),
      menu: (provided) => ({
        ...provided,
        borderRadius: "0.375rem",
        boxShadow: "none",
        backgroundColor: backgroundColor,
        border: `1px solid ${borderColor}`,
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
          ? backgroundColorSelected
          : backgroundColor,
        color: color,
        "&:hover": {
          backgroundColor: backgroundColorHover,
          color: color,
        },
      }),
      multiValue: (provided) => ({
        ...provided,
        backgroundColor: backgroundColorSelected,
        color: color,
      }),
      multiValueLabel: (provided) => ({
        ...provided,
        color: color,
      }),
    };
  }, [
    borderColor,
    backgroundColor,
    backgroundColorSelected,
    backgroundColorHover,
    color,
  ]);

  const searchValue = useCallback(
    (value: string) => {
      const allOptions = input.options
        .map((option) => {
          if ('options' in option) {
            return option?.options;
          } else {
            return option;
          }
        })
        .flat();

      return allOptions.find(
        (option) => option?.value && option?.value === value
      );
    },
    [input.options]
  );

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
          <ReactSelect
            value={searchValue(value)}
            onChange={(value: { value: string }[] | { value: string }) => {
              if (Array.isArray(value)) {
                onChange(value?.map((v) => v.value));
              } else {
                onChange(value?.value);
              }
            }}
            noOptionsMessage={() => "Sem opções"}
            options={input?.options}
            placeholder={input.placeholder}
            isMulti={isMulti}
            styles={styles}
            isLoading={isLoading}
          />
        )}
        rules={{ required: !!input.required }}
      />
      <ErrorMessage error={errors?.[input.id]} />
    </FormControl>
  );
};

export default Select;
