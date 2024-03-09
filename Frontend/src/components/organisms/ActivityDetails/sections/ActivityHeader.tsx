// ActivityHeader.tsx
import React from "react";
import { Flex, Heading, Text, Badge, Divider } from "@chakra-ui/react";
import Comments from "./Comments";

interface ActivityHeaderProps {
  id: string;
  name: string;
  protocol: string;
  status: string;
}

const ActivityHeader: React.FC<ActivityHeaderProps> = ({
  id,
  name,
  protocol,
  status,
}) => {
  return (
    <Flex
      wrap={"wrap"}
      gap={2}
      alignItems={"center"}
      justifyContent={"space-between"}
      pb={4}
    >
      <Flex gap={2} alignItems={"center"}>
        <Heading as="h1" fontSize="2xl">
          {name}
        </Heading>
        <Text fontSize="xl">#{protocol}</Text>
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Badge colorScheme="green" p={2} borderRadius="sm">
          {status}
        </Badge>
        <Comments id={id} />
      </Flex>
      <Divider />
    </Flex>
  );
};

export default ActivityHeader;
