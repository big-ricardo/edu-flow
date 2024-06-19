import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import Table from "@components/organisms/Table";
import { useQuery } from "@tanstack/react-query";
import React, { memo, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BiRefresh, BiEdit } from "react-icons/bi";
import Pagination from "@components/organisms/Pagination";
import Can from "@components/atoms/Can";
import Filter from "@components/organisms/Filter";
import Text from "@components/atoms/Inputs/Text";
import { getActivities } from "@apis/activity";
import IActivity from "@interfaces/Activitiy";
import Switch from "@components/atoms/Inputs/Switch";

const columns = [
  {
    key: "name",
    label: "Nome",
  },
  {
    key: "protocol",
    label: "Protocolo",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "users",
    label: "Usuários",
  },
  {
    key: "actions",
    label: "Ações",
  },
];

const Action = memo((activity: Pick<IActivity, "_id">) => {
  const navigate = useNavigate();

  const handleSee = useCallback(() => {
    navigate(`/portal/activity/${activity._id}`);
  }, [navigate, activity._id]);

  return (
    <div>
      <Button mr={2} onClick={handleSee} size="sm">
        <BiEdit size={20} />
      </Button>
    </div>
  );
});

const Create = memo(() => {
  const navigate = useNavigate();

  const handleSelect = useCallback(() => {
    navigate(`/portal/form`);
  }, [navigate]);

  return (
    <div>
      <Can permission="form.create">
        <Button colorScheme="blue" mr={2} onClick={handleSelect} size="sm">
          Criar Formulário
        </Button>
      </Can>
    </div>
  );
});

const Activities: React.FC = () => {
  const [searchParams] = useSearchParams();

  const {
    data: { activities, pagination } = {},
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["activities", searchParams.toString()],
    queryFn: getActivities,
  });

  const data = useMemo(() => {
    if (!activities) return [];

    return activities.map((activity) => ({
      ...activity,
      status: activity.status.name,
      users: activity.users.map((user) => user.name).join(", "),
      actions: <Action {...activity} />,
    }));
  }, [activities]);

  return (
    <Box width="100%" p="10">
      <Heading>Atividades</Heading>
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

      <Filter.Container>
        <Text input={{ label: "Nome", id: "name" }} />

        <Text input={{ label: "Protocolo", id: "protocol" }} />

        <Text input={{ label: "Status", id: "status" }} />

        <Switch input={{ label: "Finalizado", id: "finished_at", defaultValue: false }} />
      </Filter.Container>

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

export default Activities;
