import React, { memo } from "react";
import Select from "./Select";
import TextArea from "./TextArea";
import File from "./File";
import Radio from "./Radio";
import Checkbox from "./Checkbox";
import Text from "./Text";
import NumberInput from "./NumberInput";
import Evaluated from "./Evaluated";
import InputUser from "./InputUser";
import { IField } from "@interfaces/FormDraft";
import Password from "./Password";

interface Props {
  fields: IField[];
}

const fieldComponents: {
  select: typeof Select;
  number: typeof NumberInput;
  multiselect: typeof Select;
  textarea: typeof TextArea;
  file: typeof File;
  radio: typeof Radio;
  checkbox: typeof Checkbox;
  default: typeof Text;
  evaluated: typeof NumberInput;
  teacher: typeof InputUser;
  text: typeof Text;
  email: typeof Text;
  password: typeof Password;
} = {
  select: Select,
  multiselect: Select,
  textarea: TextArea,
  file: File,
  radio: Radio,
  checkbox: Checkbox,
  default: Text,
  number: NumberInput,
  evaluated: Evaluated,
  teacher: InputUser,
  text: Text,
  email: Text,
  password: Password,
};

const Inputs: React.FC<Props> = memo(({ fields }) => {
  const renderInput = (input: IField) => {
    const FieldComponent =
      fieldComponents[input.type as keyof typeof fieldComponents] ||
      fieldComponents.default;
    return (
      //@ts-ignore
      <FieldComponent input={input} isMulti={input.type === "multiselect"} />
    );
  };

  return fields.map((input: IField) => (
    <React.Fragment key={input.id}>{renderInput(input)}</React.Fragment>
  ));
});

export default Inputs;
