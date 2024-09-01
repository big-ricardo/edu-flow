import React, { memo, useEffect } from "react";
import {
  Card,
  CardProps,
  Divider,
  Flex,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import IActivity from "@interfaces/Activitiy";
import { convertDateTime } from "@utils/date";
import ActivityHeader from "./sections/ActivityHeader";
import UserDetails from "./sections/UserDetails";
import ExtraFields from "./sections/ExtraFields";
import Accordion from "@components/atoms/Accordion";
import RenderFieldValue from "@components/atoms/RenderFieldValue";
import Timeline from "./sections/Timeline";
import useActivity from "@hooks/useActivity";

interface ActivityDetailsProps extends CardProps {
  activity?: IActivity;
  isLoading?: boolean;
}

const ActivityDetails: React.FC<ActivityDetailsProps> = memo(
  ({ activity, isLoading, ...rest }) => {
    const { alterActivity, removeActivity } = useActivity();

    useEffect(() => {
      alterActivity(activity ?? null);

      return () => {
        removeActivity();
      };
    }, [activity, alterActivity, removeActivity]);

    if (isLoading) {
      return (
        <Card
          p={[0, 6]}
          borderRadius="2xl"
          minWidth={"60%"}
          boxShadow={"lg"}
          h="100%"
          bg="bg.card"
        >
          <Flex justify="center" align="center" h="100%">
            <Spinner />
          </Flex>
        </Card>
      );
    }

    if (!activity) return null;

    return (
      <Card
        p={[4, 6]}
        borderRadius="2xl"
        w={["100%", "60%"]}
        boxShadow={"lg"}
        bg="bg.card"
        {...rest}
      >
        <ActivityHeader
          id={activity._id}
          name={activity.name}
          protocol={activity.protocol}
          status={activity.status.name}
          state={activity.state}
        />
        <VStack mb={4} align="start">
          <Flex direction={"column"}>
            <Text fontSize="sm" mr={2}>
              Descrição:
            </Text>
            <Text fontSize="sm" fontWeight={"bold"}>
              {activity.description ?? "N/A"}
            </Text>
          </Flex>
          <Flex direction={"column"}>
            <Text fontSize="sm" mr={2}>
              Data de Início:
            </Text>
            <Text fontSize="sm" fontWeight={"bold"}>
              {convertDateTime(activity.createdAt)}
            </Text>
          </Flex>
          {activity.finished_at && (
            <Flex direction={"column"}>
              <Text fontSize="sm" mr={2}>
                Data de Término:
              </Text>
              <Text fontSize="sm" fontWeight={"bold"}>
                {convertDateTime(activity.finished_at)}
              </Text>
            </Flex>
          )}
          <Divider />
          <Text fontWeight={"bold"} fontSize="md">
            Alunos
          </Text>
          <Flex flexWrap="wrap" gap={4}>
            {activity.users.map((user) => (
              <UserDetails key={user._id} user={user} />
            ))}
          </Flex>
          <Divider />
          <Text fontWeight={"bold"} fontSize="md">
            Orientadores
          </Text>
          <Flex flexWrap="wrap">
            {activity.masterminds.map((mastermind) => (
              <UserDetails key={mastermind.user._id} {...mastermind} />
            ))}
          </Flex>
          <Text fontWeight={"bold"} fontSize="md">
            Co-Orientadores
          </Text>
          <Flex flexWrap="wrap">
            {activity.sub_masterminds.map((mastermind) => (
              <UserDetails key={mastermind._id} user={mastermind} />
            ))}
            {!activity.sub_masterminds.length && (
              <Text>Nenhum co-orientador</Text>
            )}
          </Flex>
        </VStack>
        <Accordion.Container defaultIndex={[0, 1]} allowToggle allowMultiple>
          <Accordion.Item>
            <Accordion.Button>Informações Extra</Accordion.Button>
            <Accordion.Panel>
              <ExtraFields fields={activity.form_draft.fields} />
            </Accordion.Panel>
          </Accordion.Item>

          {activity.workflows.length > 0 && (
            <Flex direction="column" gap={4}>
              <Text fontWeight={"bold"} fontSize="md">
                Linha do Tempo
              </Text>
              <Timeline />
            </Flex>
          )}
        </Accordion.Container>
      </Card>
    );
  }
);

export default ActivityDetails;
