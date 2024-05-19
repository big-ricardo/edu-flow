import { getMyActivitiesPendingEvaluations } from "@apis/dashboard";
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

type IItem = Awaited<ReturnType<typeof getMyActivitiesPendingEvaluations>>[0];

const PendingEvaluations: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["my-pending-evaluations"],
    queryFn: getMyActivitiesPendingEvaluations,
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

  const formData = useMemo(() => {
    if (!data || data.length === 0) return null;

    return data.map((activity) => ({
      ...activity,
      createdAt: convertDateTime(activity.form?.period?.close),
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
  }, [data, handleResponse]);

  if (data && data.length === 0) return null;

  return (
    <Box p={4} bg="bg.card" borderRadius="md">
      <Heading size="md">Avaliações Pendentes</Heading>
      <Text>Interações pendentes de avaliação.</Text>

      <Divider my={4} />

      <Table
        columns={columns}
        data={formData}
        isLoading={isLoading}
        emptyText="Nenhuma interação pendente."
      />
    </Box>
  );
};

export default PendingEvaluations;
