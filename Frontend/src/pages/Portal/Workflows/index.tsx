import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import Table from "@components/organisms/Table";
import { useQuery } from "@tanstack/react-query";
import React, { memo, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BiRefresh, BiEdit } from "react-icons/bi";
import Pagination from "@components/organisms/Pagination";
import { getWorkflows } from "@apis/workflows";
import { IWorkflow } from "@interfaces/Workflow";
import Can from "@components/atoms/Can";
import { useTranslation } from "react-i18next";

const columns = [
  {
    key: "name",
    label: "common.fields.name",
  },
  {
    key: "status",
    label: "common.fields.status",
  },
  {
    key: "actions",
    label: "common.fields.actions",
  },
];

const Action = memo((workflow: Pick<IWorkflow, "name" | "active" | "_id">) => {
  const navigate = useNavigate();

  const handleEdit = useCallback(() => {
    navigate(`/portal/workflow/${workflow._id}`);
  }, [navigate, workflow._id]);

  return (
    <div>
      <Can permission="workflow.read">
        <Button mr={2} onClick={handleEdit} size="sm">
          <BiEdit size={20} />
        </Button>
      </Can>
    </div>
  );
});

const Create = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCreate = useCallback(() => {
    navigate(`/portal/workflow`);
  }, [navigate]);

  return (
    <div>
      <Can permission="workflow.create">
        <Button colorScheme="blue" mr={2} onClick={handleCreate} size="sm">
          {t("workflows.create")}
        </Button>
      </Can>
    </div>
  );
});

const Statuses: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") ?? 1;

  const {
    data: { workflows, pagination } = {},
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["workflows", String(page)],
    queryFn: getWorkflows,
  });

  const data = useMemo(() => {
    if (!workflows) return [];

    return workflows.map((workflow) => ({
      ...workflow,
      status: workflow.active
        ? t("common.fields.active")
        : t("common.fields.inactive"),
      actions: <Action {...workflow} />,
    }));
  }, [workflows]);

  return (
    <Box width="100%" p="10">
      <Heading>{t("workflows.title")}</Heading>
      <Flex justifyContent="flex-end" mt="4" width="100%">
        <Button
          onClick={() => refetch()}
          mr={2}
          size="sm"
          isLoading={isFetching}
        >
          <BiRefresh size={20} />
        </Button>
        <Create />
      </Flex>
      <Flex
        justifyContent="center"
        alignItems="center"
        mt="4"
        width="100%"
        p="4"
        borderRadius="md"
        direction="column"
        bg={"bg.card"}
      >
        <Table columns={columns} data={data} />
        <Pagination pagination={pagination} isLoading={isFetching} />
      </Flex>
      {isError && (
        <Flex justifyContent="center" alignItems="center" mt="4" width="100%">
          <Heading color="red.500">{t("workflows.error")}</Heading>
        </Flex>
      )}
    </Box>
  );
};

export default Statuses;
