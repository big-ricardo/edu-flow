import { getApprovedActivities } from "@apis/dashboard";
import { Box, Button, Divider, Heading, Spinner, Text } from "@chakra-ui/react";
import Table from "@components/organisms/Table";
import { useQuery } from "@tanstack/react-query";
import { convertDateTime } from "@utils/date";
import React, { useCallback, useMemo } from "react";
import { FaPen } from "react-icons/fa";
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
    label: "Data de Criação",
  },
  {
    key: "actions",
    label: "Ações",
  },
];

type IItem = Awaited<ReturnType<typeof getApprovedActivities>>["activities"][0];

const ApprovedActivities: React.FC = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["approved-activities"],
    queryFn: getApprovedActivities,
  });

  const handleView = useCallback(
    (activity: IItem) => {
      navigate(`/portal/activity-process/${activity._id}`);
    },
    [navigate]
  );

  const rows = useMemo(() => {
    if (!data || data.activities.length === 0) return null;

    return data.activities.map((activity) => ({
      ...activity,
      createdAt: convertDateTime(activity.createdAt),
      actions: (
        <Button size="sm" onClick={() => handleView(activity)}>
          <FaPen />
        </Button>
      ),
    }));
  }, [data, handleView]);

  if (data && data.activities.length === 0) return null;

  return (
    <Box p={4} bg="bg.card" borderRadius="md">
      <Heading size="md">Atividades para Aprovar</Heading>
      <Text size="sm" color={"text.secondary"}>
        Atividades pendentes de aprovação.
      </Text>

      <Divider my={2} />

      <Table columns={columns} data={rows ?? []} isLoading={isLoading} />
    </Box>
  );
};

export default ApprovedActivities;
