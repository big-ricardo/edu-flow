import { getMyActivitiesPendingEvaluations } from "@apis/dashboard";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { convertDateTime } from "@utils/date";
import React, { memo, useCallback } from "react";
import { FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PendingEvaluations: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["my-pending-evaluations"],
    queryFn: getMyActivitiesPendingEvaluations,
  });

  if (data && data.length === 0) return null;

  return (
    <Box p={4}>
      <Heading>Interações Pendentes</Heading>

      {isLoading && <Spinner />}

      {data && (
        <Grid
          gap={4}
          mt={4}
          width="100%"
          templateColumns="repeat(auto-fill, minmax(350px, 1fr))"
        >
          {data.map((data) => (
            <ActivityItem key={data._id} {...data} />
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PendingEvaluations;

type ActivityItemProps = Awaited<
  ReturnType<typeof getMyActivitiesPendingEvaluations>
>[number];

const ActivityItem: React.FC<ActivityItemProps> = memo(
  ({ form, status, ...activity }) => {
    const navigate = useNavigate();

    const handleResponse = useCallback(() => {
      navigate(`/response/${form.slug}`, {
        state: {
          activity_id: activity._id,
        },
      });
    }, [navigate, activity._id, form.slug]);

    return (
      <Box
        boxShadow="md"
        borderWidth="1px"
        borderRadius="md"
        p={4}
        borderColor={"gray"}
        w={"100%"}
        h={"100%"}
        bgColor={useColorModeValue("white", "gray.700")}
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

            <Button size="sm" onClick={handleResponse}>
              <FaPen />
            </Button>
          </Flex>
          <Text fontSize="sm" noOfLines={2}>
            {activity.description}
          </Text>
          <Text>
            Form: <strong>{form.name}</strong>
          </Text>
          <Text>
            Protocolo: #<strong>{activity.protocol}</strong>
          </Text>
          <Text>
            Fechamento:{" "}
            <strong>{convertDateTime(form.period?.close || "")}</strong>
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
  }
);
