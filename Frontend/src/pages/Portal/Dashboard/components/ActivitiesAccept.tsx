import { getMyActivitiesPendingAcceptance } from "@apis/dashboard";
import { Box, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import Table from "@components/organisms/Table";
import { useQuery } from "@tanstack/react-query";
import { convertDateTime } from "@utils/date";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    key: "protocol",
    label: "common.fields.protocol",
  },
  {
    key: "name",
    label: "common.fields.name",
  },
  {
    key: "description",
    label: "common.fields.description",
  },
  {
    key: "createdAt",
    label: "common.fields.createdAt",
  },
  {
    key: "actions",
    label: "common.fields.actions",
  },
];

type IItem = Awaited<
  ReturnType<typeof getMyActivitiesPendingAcceptance>
>["activities"][0];

const ActivitiesAccept: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["activities-pending-acceptance"],
    queryFn: getMyActivitiesPendingAcceptance,
  });

  const handleView = useCallback(
    (activity: IItem) => {
      navigate(`/portal/activity-accept/${activity._id}`);
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
          <Button size="sm" onClick={() => handleView(activity)}>
            <FaPen />
          </Button>
        </Flex>
      ),
    }));
  }, [data, handleView, handleView]);

  if (data && data.activities.length === 0) return null;

  return (
    <Box p={4} bg="bg.card" borderRadius="md">
      <Heading size="md">{t("dashboard.title.activitiesAccept")}</Heading>
      <Text size="sm" color={"text.secondary"}>
        {t("dashboard.description.activitiesAccept")}
      </Text>

      <Divider my={2} />

      <Table columns={columns} data={rows ?? []} isLoading={isLoading} />
    </Box>
  );
};

export default ActivitiesAccept;
