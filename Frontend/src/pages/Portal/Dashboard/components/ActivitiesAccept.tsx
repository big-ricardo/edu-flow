import { getMyActivitiesPendingAcceptance } from "@apis/dashboard";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import IActivity from "@interfaces/Activitiy";
import { useQuery } from "@tanstack/react-query";
import { convertDateTime } from "@utils/date";
import React, { memo, useCallback } from "react";
import { FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ActivitiesAccept: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["activities-pending-acceptance"],
    queryFn: getMyActivitiesPendingAcceptance,
  });

  if (data && data.activities.length === 0) return null;

  return (
    <Box p={4} bg="bg.card" borderRadius="md">
      <Heading size="md">Atividades para Aceitar</Heading>
      <Text size="sm" color={"text.secondary"}>
        Atividades pendentes de aceitação para sua participação.
      </Text>

      <Divider my={2} />

      {isLoading && <Spinner />}

      {data && (
        <Grid
          gap={4}
          mt={4}
          width="100%"
          templateColumns="repeat(auto-fill, minmax(350px, 1fr))"
        >
          {data.activities.map((activity) => (
            <ActivityItem key={activity._id} activity={activity} />
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ActivitiesAccept;

interface ActivityItemProps {
  activity: Pick<
    IActivity,
    "_id" | "name" | "description" | "createdAt" | "protocol"
  > & {
    users: {
      _id: string;
      name: string;
      matriculation: string;
    }[];
  };
}

const ActivityItem: React.FC<ActivityItemProps> = memo(({ activity }) => {
  const navigate = useNavigate();

  const handleView = useCallback(() => {
    navigate(`/portal/activity-accept/${activity._id}`);
  }, [navigate, activity._id]);

  return (
    <Box
      boxShadow="md"
      borderWidth="1px"
      borderRadius="md"
      p={4}
      borderColor={"bg.border"}
      w={"100%"}
      h={"100%"}
      bgColor={"bg.card"}
    >
      <Stack
        spacing={2}
        display={"flex"}
        justifyContent={"space-between"}
        h="100%"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h2" size="md">
            {activity.name}
          </Heading>

          <Button size="sm" onClick={handleView}>
            <FaPen />
          </Button>
        </Flex>
        <Text>
          Criação: <strong>{convertDateTime(activity.createdAt)}</strong>
        </Text>
        <Text>
          Protocolo: #<strong>{activity.protocol}</strong>
        </Text>
        <Box>
          <Text fontWeight="bold">Usuários Envolvidos:</Text>
          <Stack spacing={2} maxH={100} overflowY="auto" mt={2}>
            {activity.users.map((user) => (
              <Box key={user._id} p={2} borderWidth="1px" borderRadius="md">
                <Text noOfLines={1}>
                  Nome: <strong>{user.name}</strong>
                </Text>
                <Text>
                  Matrícula: #<strong>{user.matriculation}</strong>
                </Text>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
});
