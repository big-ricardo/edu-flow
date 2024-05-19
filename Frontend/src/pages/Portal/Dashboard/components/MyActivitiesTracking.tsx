import { getMyActivitiesTracking } from "@apis/dashboard";
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

type IItem = Awaited<ReturnType<typeof getMyActivitiesTracking>>[0];

const ActivityTracking: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["my-tracking-activities"],
    queryFn: getMyActivitiesTracking,
  });

  const navigate = useNavigate();

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
      createdAt: convertDateTime(activity.createdAt),
      actions: (
        <Flex>
          <Button mr={2} onClick={() => handleView(activity)} size="sm">
            <FaEye />
          </Button>
        </Flex>
      ),
    }));
  }, [data]);

  if (data && data.length === 0) return null;

  return (
    <Box p={4} bg="bg.card" borderRadius="md">
      <Heading size="md">Acompanhamento de Atividades</Heading>
      <Text>Atividades que você está participando.</Text>

      <Divider my={4} />

      <Table
        columns={columns}
        data={formData}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default ActivityTracking;
