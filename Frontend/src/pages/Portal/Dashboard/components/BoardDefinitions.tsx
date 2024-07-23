import { getBoardDefinitions } from "@apis/dashboard";
import { Box, Button, Divider, Heading } from "@chakra-ui/react";
import Table from "@components/organisms/Table";
import { useQuery } from "@tanstack/react-query";
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

type IItem = Awaited<ReturnType<typeof getBoardDefinitions>>[number];

const BoardDefinitions: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["board-definitions"],
    queryFn: getBoardDefinitions,
  });

  const navigate = useNavigate();

  const handleView = useCallback(
    (activity: IItem) => {
      const evaluation = activity.evaluations[0];

      navigate(
        `/portal/activity/${activity._id}/board-definition/${evaluation._id}`
      );
    },
    [navigate]
  );

  const rows = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((activity) => ({
      ...activity,
      actions: (
        <Button size="sm" onClick={() => handleView(activity)}>
          <FaPen />
        </Button>
      ),
    }));
  }, [data, handleView]);

  if (data && data.length === 0) return null;

  return (
    <Box p={4} bg="bg.card" borderRadius="md">
      <Heading size="md">{t("dashboard.title.boardDefinition")}</Heading>

      <Divider my={4} />

      <Table columns={columns} data={rows} isLoading={isLoading} />
    </Box>
  );
};

export default BoardDefinitions;
