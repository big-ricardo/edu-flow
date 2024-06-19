import { getMyActivitiesTracking } from "@apis/dashboard";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Table from "@components/organisms/Table";
import { IActivityState } from "@interfaces/Activitiy";
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
    label: "Data de Criação",
  },
  {
    key: "actions",
    label: "Ações",
  },
];

type IItem = Awaited<
  ReturnType<typeof getMyActivitiesTracking>
>["activities"][0];

const ActivitiesTracking: React.FC = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["my-activities-tracking"],
    queryFn: getMyActivitiesTracking,
  });

  const handleView = useCallback(
    (activity: IItem) => {
      navigate(`/portal/activity/${activity._id}`);
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (activity: IItem) => {
      navigate(`/response/${activity._id}/edit`);
    },
    [navigate]
  );

  const rows = useMemo(() => {
    if (!data || data.activities.length === 0) return null;

    return data.activities.map((activity) => ({
      ...activity,
      createdAt: convertDateTime(activity.createdAt),
      actions: (
        <Flex>
          <Button mr={2} onClick={() => handleView(activity)} size="sm">
            <FaEye />
          </Button>
          {activity.state === IActivityState.created && (
            <Button size="sm" onClick={() => handleEdit(activity)}>
              <FaPen />
            </Button>
          )}
        </Flex>
      ),
    }));
  }, [data, handleView, handleEdit]);

  return (
    <Box p={4} mb={4} bg="bg.card" borderRadius="md" id="activity-tracking">
      <Heading size="md" mb="5">
        Acompanhamento de Atividades
      </Heading>
      <Divider mb={4} />

      <Tabs>
        <TabList>
          <Tab>Em andamento</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Table columns={columns} data={rows ?? []} isLoading={isLoading} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ActivitiesTracking;
