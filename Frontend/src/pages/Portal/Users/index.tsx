import { getUsers } from "@apis/users";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import Can from "@components/atoms/Can";
import Select from "@components/atoms/Inputs/Select";
import Text from "@components/atoms/Inputs/Text";
import Filter from "@components/organisms/Filter";
import Pagination from "@components/organisms/Pagination";
import Table from "@components/organisms/Table";
import { useQuery } from "@tanstack/react-query";
import React, { memo, useCallback, useMemo } from "react";
import { BiEdit, BiRefresh } from "react-icons/bi";
import { useNavigate, useSearchParams } from "react-router-dom";

const roleMap = {
  admin: "Admin",
  student: "Estudante",
  teacher: "Professor",
};

const columns = [
  {
    key: "name",
    label: "Nome",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "institute",
    label: "Instituto",
  },
  {
    key: "active",
    label: "Status",
  },
  {
    key: "roles",
    label: "Função",
  },
  {
    key: "actions",
    label: "Ações",
  },
];

const Action = memo((user: { _id: string }) => {
  const navigate = useNavigate();

  const handleEdit = useCallback(() => {
    navigate(`/portal/user/${user._id}`);
  }, [navigate, user._id]);

  return (
    <div>
      <Button mr={2} onClick={handleEdit} size="sm">
        <BiEdit size={20} />
      </Button>
    </div>
  );
});

const Create = memo(() => {
  const navigate = useNavigate();

  const handleCreate = useCallback(() => {
    navigate(`/portal/user`);
  }, [navigate]);

  return (
    <div>
      <Can permission="user.create">
        <Button colorScheme="blue" mr={2} onClick={handleCreate} size="sm">
          Criar Usuário
        </Button>
      </Can>
    </div>
  );
});

const Users: React.FC = () => {
  const [searchParams] = useSearchParams();

  const {
    data: { users, pagination } = {},
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["users", searchParams.toString()],
    queryFn: getUsers,
  });

  const data = useMemo(() => {
    if (!users) return [];

    return users.map((user) => ({
      ...user,
      roles: user.roles.map((role) => roleMap[role]).join(", "),
      active: user.active ? "Ativo" : "Inativo",
      institute: user.institute?.acronym,
      actions: <Action {...user} />,
    }));
  }, [users]);

  return (
    <Box width="100%" p={[4, 10]}>
      <Heading>Usuários</Heading>
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
        <Text
          input={{
            label: "Nome",
            id: "name",
          }}
        />

        <Text
          input={{
            label: "Matrícula",
            id: "matriculation",
          }}
        />

        <Select
          input={{
            label: "Ativo",
            id: "active",
            options: [
              { label: "Ativo", value: "true" },
              { label: "Inativo", value: "false" },
            ],
          }}
        />

        <Select
          input={{
            label: "Externo",
            id: "isExternal",
            options: [
              { label: "Sim", value: "true" },
              { label: "Não", value: "false" },
            ],
          }}
        />
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

export default Users;
