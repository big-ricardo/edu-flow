import {
  Badge,
  Box,
  Card,
  CardProps,
  Divider,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { IActivityDetails } from "@interfaces/Activitiy";
import { convertDateTime } from "@utils/date";
import React, { memo } from "react";

interface ActivityDetailsProps extends CardProps {
  activity?: IActivityDetails;
}

const ActivityDetails: React.FC<ActivityDetailsProps> = memo(
  ({ activity, ...rest }) => {
    if (!activity) return null;

    return (
      <Card
        p={6}
        borderRadius="2xl"
        minWidth={"60%"}
        boxShadow={"lg"}
        {...rest}
      >
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
            value={activity?.description}
          />
          <LabelText
            label={"Data de Criação"}
            value={convertDateTime(activity?.createdAt)}
          />
          <Divider mb={2} />
          <Text fontWeight={"bold"} fontSize="md">
            Alunos
          </Text>
          <Flex flexWrap="wrap" gap={4}>
            {activity?.users.map((user) => (
              <UserInfo key={user._id} user={user} />
            ))}
          </Flex>
          <Divider />
        </VStack>
        <VStack align="start" mb={4}>
          <Heading fontWeight={"bold"} fontSize="xl" mb={2}>
            Orientadores
          </Heading>
        </VStack>
        <Divider mb={4} />
        <VStack align="start" mb={4}>
          <Heading fontWeight={"bold"} fontSize="xl" mb={2}>
            Campos Extras
          </Heading>
          <Flex flexWrap="wrap" gap={4} direction={"column"}>
            {activity?.extra_fields.form_draft.fields.map((field) => (
              <LabelText
                key={field.id}
                label={field.label}
                value={field.value}
              />
            ))}
          </Flex>
        </VStack>
      </Card>
    );
  }
);

export default ActivityDetails;

const LabelText = memo(
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
          <UserInfo user={value} />
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
  }
);

const UserInfo = memo(
  ({
    user,
  }: {
    user?: { name: string; email: string; matriculation: string };
  }) => {
    if (!user) return null;

    return (
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} mb={4}>
        <LabelText label={"Nome"} value={user.name ?? ""} />
        <LabelText label={"Email"} value={user.email ?? ""} />
        <LabelText label={"Matrícula"} value={user.matriculation ?? ""} />
      </Box>
    );
  }
);
