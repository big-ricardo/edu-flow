import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import Table from "@components/organisms/Table";
import { useQuery } from "@tanstack/react-query";
import React, { memo, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BiRefresh, BiEdit } from "react-icons/bi";
import University from "@interfaces/University";
import { getUniversities } from "@apis/univertities";
import Pagination from "@components/organisms/Pagination";
import Can from "@components/atoms/Can";

const columns = [
  {
    key: "name",
    label: "Nome",
  },
  {
    key: "acronym",
    label: "Sigla",
  },
  {
    key: "active",
    label: "Status",
  },
  {
    key: "actions",
    label: "Ações",
  },
];

const Action = memo((university: University) => {
  const navigate = useNavigate();

  const handleEdit = useCallback(() => {
    navigate(`/portal/university/${university._id}`);
  }, [navigate, university._id]);

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
    navigate(`/portal/university`);
  }, [navigate]);

  return (
    <div>
      <Can permission="university.create">
        <Button colorScheme="blue" mr={2} onClick={handleCreate} size="sm">
          Criar Universidade
        </Button>
      </Can>
    </div>
  );
});

const Universities: React.FC = () => {
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") ?? 1;

  const {
    data: { universities, pagination } = {},
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["universities", String(page)],
    queryFn: getUniversities,
  });

  const data = useMemo(() => {
    if (!universities) return [];

    return universities.map((university) => ({
      ...university,
      active: university.active ? "Ativo" : "Desativado",
      actions: <Action {...university} />,
    }));
  }, [universities]);

  return (
    <Box width="100%" p="10">
      <Heading>Universidades</Heading>
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

export default Universities;
