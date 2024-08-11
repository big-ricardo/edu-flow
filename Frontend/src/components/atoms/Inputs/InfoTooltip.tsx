import { Box, Text } from "@chakra-ui/react";
import React, { memo } from "react";

interface InfoTooltipProps {
  describe?: string | null;
}

const InfoTooltip: React.FC<InfoTooltipProps> = memo(({ describe }) => {
  if (!describe) return null;

  return (
    <Box>
      {describe.split("\n").map((text, index) => (
        <Box key={index} display="flex" alignItems="center">
          <Text fontSize={"sm"}>{text}</Text>
        </Box>
      ))}
    </Box>
  );
});

export default InfoTooltip;
