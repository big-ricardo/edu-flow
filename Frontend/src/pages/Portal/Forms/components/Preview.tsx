import { Divider, Heading } from "@chakra-ui/react";
import Inputs from "@components/atoms/Inputs";
import IForm from "@interfaces/Form";
import React, { memo } from "react";

interface PreviewProps {
  form: Omit<IForm, "_id">;
}

const Preview: React.FC<PreviewProps> = memo(({ form }) => {
  return (
    <React.Fragment>
      <Heading>{form.name}</Heading>
      <span>{form.description}</span>
      <Divider />
      <Inputs fields={form.fields} />
    </React.Fragment>
  );
});

export default Preview;
