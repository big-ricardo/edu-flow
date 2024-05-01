import { getMyActivitiesPendingInteractions } from "@apis/dashboard";
import { Box, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import Table from "@components/organisms/Table";
import { useQuery } from "@tanstack/react-query";
import { convertDateTime } from "@utils/date";
import React, { useCallback, useMemo } from "react";
import { FaEye, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    key: "protocol",
    label: "Protocolo",
  },
  {
    key: "name",
    label: "Nome",
  },
  {
    key: "description",
    label: "Descrição",
  },
  {
    key: "createdAt",
    label: "Data Limite",
  },
  {
    key: "actions",
    label: "Ações",
  },
];

type IItem = Awaited<ReturnType<typeof getMyActivitiesPendingInteractions>>[0];

const PendingInteractions: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["my-pending-interactions"],
    queryFn: getMyActivitiesPendingInteractions,
  });

  const navigate = useNavigate();

  const handleResponse = useCallback(
    (activity: IItem) => {
      navigate(`/response/${activity.form.slug}`, {
        state: {
          activity_id: activity._id,
        },
      });
    },
    [navigate]
  );

  const handleView = useCallback(
    (activity: IItem) => {
      navigate(`/portal/activity/${activity._id}`);
    },
    [navigate]
  );

  const dataForm = useMemo(() => {
    if (!data || data.length === 0) return null;

    return data.map((activity) => ({
      ...activity,
      createdAt: convertDateTime(activity.form.period.close),
      actions: (
        <Flex>
          <Button mr={2} onClick={() => handleView(activity)} size="sm">
            <FaEye />
          </Button>
          <Button size="sm" onClick={() => handleResponse(activity)}>
            <FaPen />
          </Button>
        </Flex>
      ),
    }));
  }, [data, handleResponse, handleView]);

  if (data && data.length === 0) return null;

  return (
    <Box p={4} bg="bg.card" borderRadius="md">
      <Heading size="md">Interações Pendentes</Heading>
      <Text size="sm" color={"text.secondary"}>
        Interações pendentes de resposta.
      </Text>

      <Divider my={2} />

      {data && (
        <Table columns={columns} data={dataForm} isLoading={isLoading} />
      )}
    </Box>
  );
};

export default PendingInteractions;
