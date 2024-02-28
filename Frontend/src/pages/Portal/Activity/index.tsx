import { getActivity } from "@apis/activity";
import {
  Badge,
  Box,
  Card,
  Center,
  Divider,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { convertDateTime } from "@utils/date";
import React, { memo } from "react";
import { useParams } from "react-router-dom";

const Activity: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = params.id ?? "";

  const { data: activity, isLoading } = useQuery({
    queryKey: ["activity", id],
    queryFn: getActivity,
  });

  if (isLoading) return <Spinner />;

  return (
    <Center width="100%">
      <Card p={6} borderRadius="2xl" minWidth={"80%"} boxShadow={"lg"}>
        <Flex
          wrap={"wrap"}
          gap={5}
          mb={4}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Flex wrap={"wrap"} gap={2} alignItems={"center"}>
            <Heading as="h1" fontSize="2xl">
              {activity?.name}
            </Heading>
            <Text fontSize="xl">#{activity?.protocol}</Text>
          </Flex>
          <Badge colorScheme="green" p={2} borderRadius="sm">
            {activity?.status.name}
          </Badge>
        </Flex>
        <VStack mb={4} align="start">
          <LabelText
            label={"Descrição"}
            text={convertDateTime(activity?.description)}
          />
          <LabelText
            label={"Data de Criação"}
            text={convertDateTime(activity?.createdAt)}
          />
          <Divider mb={2} />
          <Text fontWeight={"bold"} fontSize="md">
            Alunos
          </Text>
          <Flex flexWrap="wrap" gap={4}>
            {activity?.users.map((user) => (
              <Box
                key={user._id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                p={4}
                mb={4}
              >
                <LabelText label={"Nome"} text={user.name ?? ""} />
                <LabelText label={"Email"} text={user.email ?? ""} />
                <LabelText
                  label={"Matrícula"}
                  text={user.matriculation ?? ""}
                />
              </Box>
            ))}
          </Flex>

          <Divider />
          <Text fontWeight={"bold"} fontSize="md" mb={1}>
            Campos extras
          </Text>
        </VStack>
        <VStack align="start" mb={4}>
          <Heading fontWeight={"bold"} fontSize="xl" mb={2}>
            Orientadores
          </Heading>
        </VStack>
        <Divider mb={4} />
      </Card>
    </Center>
  );
};

export default Activity;

const LabelText = memo(({ label, text }: { label: string; text: string }) => {
  if (!text) return null;

  return (
    <Flex direction={"column"}>
      <Text fontSize="sm" mr={2}>
        {label}:
      </Text>
      <Text fontSize="sm" fontWeight={"bold"}>
        {text}
      </Text>
    </Flex>
  );
});
