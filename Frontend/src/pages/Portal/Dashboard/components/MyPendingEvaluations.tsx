import { getMyActivitiesPendingEvaluations } from "@apis/dashboard";
import { Box, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import Table from "@components/organisms/Table";
import { useQuery } from "@tanstack/react-query";
import { convertDateTime } from "@utils/date";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaPen } from "react-icons/fa";
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

type IItem = Awaited<ReturnType<typeof getMyActivitiesPendingEvaluations>>[0];

const PendingEvaluations: React.FC = () => {
  const { t } = useTranslation();

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

  if (formData && formData.length === 0) return null;

  return (
    <Box p={4} bg="bg.card" borderRadius="md">
      <Heading size="md">{t("dashboard.title.evaluationPending")}</Heading>
      <Text>{t("dashboard.description.evaluationPending")}</Text>

      <Divider my={4} />

      <Table columns={columns} data={formData ?? []} isLoading={isLoading} />
    </Box>
  );
};

export default PendingEvaluations;
