// ExtraFields.tsx
import React from "react";
import { Flex } from "@chakra-ui/react";
import RenderFieldValue from "@components/atoms/RenderFieldValue";

interface ExtraFieldsProps {
  fields: { id: string; label: string; value: string }[];
}

const ExtraFields: React.FC<ExtraFieldsProps> = ({ fields }) => {
  return (
    <Flex flexWrap="wrap" gap={4} direction={"column"}>
      {fields.map((field) => (
        <RenderFieldValue
          key={field.id}
          label={field.label}
          value={field.value}
        />
      ))}
    </Flex>
  );
};

export default ExtraFields;
