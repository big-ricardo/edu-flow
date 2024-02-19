import { Divider } from "@chakra-ui/react";
import Inputs from "@components/atoms/Inputs";
import IFormDraft from "@interfaces/FormDraft";
import React, { memo } from "react";

interface PreviewProps {
  form: Omit<IFormDraft, "_id">;
}

const Preview: React.FC<PreviewProps> = memo(({ form }) => {
  return (
    <React.Fragment>
      <Divider />
      <Inputs fields={form.fields} />
    </React.Fragment>
  );
});

export default Preview;
