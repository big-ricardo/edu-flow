import { Box } from "@chakra-ui/react";
import React from "react";
import { FaInfo } from "react-icons/fa";

interface InfoTooltipProps {
  describe?: string | null;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ describe }) => {
  if (!describe) return null;

  return (
    <Box
      as={FaInfo}
      color="white"
      bg="blue.500"
      borderRadius="50%"
      p="0.2rem"
      title={describe}
    />
  );
};

export default InfoTooltip;
