import {
  Box,
  Button,
  Flex,
  Heading,
} from "@chakra-ui/react";
import Table from "@components/organisms/Table";
import { useQuery } from "@tanstack/react-query";
import React, { memo, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BiRefresh, BiEdit } from "react-icons/bi";
import Pagination from "@components/organisms/Pagination";
import { getWorkflows } from "@apis/workflows";
import { IWorkflow } from "@interfaces/Workflow";

const columns = [
  {
    key: "name",
    label: "Nome",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "actions",
    label: "Ações",
  },
];

const Action = memo((workflow: Pick<IWorkflow, "name" | "active" | "_id">) => {
  const navigate = useNavigate();

  const handleEdit = useCallback(() => {
    navigate(`/portal/workflow/${workflow._id}`);
  }, [navigate, workflow._id]);

  return (
    <div>
      <Button colorScheme="blue" mr={2} onClick={handleEdit} size="sm">
        <BiEdit size={20} />
      </Button>
    </div>
  );
});

const Create = memo(() => {
  const navigate = useNavigate();

  const handleCreate = useCallback(() => {
    navigate(`/portal/workflow`);
  }, [navigate]);

  return (
    <div>
      <Button colorScheme="blue" mr={2} onClick={handleCreate} size="sm">
        Criar Workflow
      </Button>
    </div>
  );
});

const Statuses: React.FC = () => {
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
      status: workflow.active ? "Ativo" : "Inativo",
      actions: <Action {...workflow} />,
    }));
  }, [workflows]);

  return (
    <Box width="100%" p="10">
      <Heading>Workflow</Heading>
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
          <Heading color="red.500">Erro ao carregar dados</Heading>
        </Flex>
      )}
    </Box>
  );
};

export default Statuses;
