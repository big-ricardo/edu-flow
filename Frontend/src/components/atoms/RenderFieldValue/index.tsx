import { Flex, Text } from "@chakra-ui/react";
import UserDetails from "@components/organisms/ActivityDetails/sections/UserDetails";
import { memo } from "react";

const RenderFieldValue = memo(
  ({
    label,
    value,
  }: {
    label: string;
    value?: string | { name: string; email: string; matriculation: string };
  }) => {
    if (!label) return null;

    if (typeof value === "string" && value) {
      return (
        <Flex direction={"column"}>
          <Text fontSize="sm" mr={2}>
            {label}:
          </Text>
          <Text fontSize="sm" fontWeight={"bold"}>
            {value}
          </Text>
        </Flex>
      );
    }

    if (typeof value === "object") {
      return (
        <Flex direction={"column"}>
          <Text fontSize="sm" mr={2} mb={2}>
            {label}:
          </Text>
          <UserDetails user={value} />
        </Flex>
      );
    }

    return (
      <Flex direction={"column"}>
        <Text fontSize="sm" mr={2}>
          {label}:
        </Text>
        <Text fontSize="sm" fontWeight={"bold"}>
          Não informado
        </Text>
      </Flex>
    );
  },
);

export default RenderFieldValue;
