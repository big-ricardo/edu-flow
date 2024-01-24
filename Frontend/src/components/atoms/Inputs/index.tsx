import React, { memo } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  Control,
} from "react-hook-form";
import Select from "./Select";
import TextArea from "./TextArea";
import File from "./File";
import Radio from "./Radio";
import Checkbox from "./Checkbox";
import Text from "./Text";
import { IField } from "@interfaces/Form";

interface Props {
  fields: IField[];
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  control: Control<FieldValues>;
}

const fieldComponents: {
  select: typeof Select;
  multiselect: typeof Select;
  textarea: typeof TextArea;
  file: typeof File;
  radio: typeof Radio;
  checkbox: typeof Checkbox;
  default: typeof Text;
} = {
  select: Select,
  multiselect: Select,
  textarea: TextArea,
  file: File,
  radio: Radio,
  checkbox: Checkbox,
  default: Text,
};

const Inputs: React.FC<Props> = memo(
  ({ fields, register, errors, control }) => {
    const renderInput = (input: IField) => {
      const FieldComponent =
        fieldComponents[input.type as keyof typeof fieldComponents] ||
        fieldComponents.default;
      return (
        <FieldComponent
          input={input}
          {...{ register, errors, control }}
          isMulti={input.type === "multiselect"}
        />
      );
    };

    return fields.map((input: IField) => (
      <React.Fragment key={input.id}>{renderInput(input)}</React.Fragment>
    ));
  }
);

export default Inputs;
