import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import Table from "@components/organisms/Table";
import { useQuery } from "@tanstack/react-query";
import React, { memo, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BiRefresh, BiEdit } from "react-icons/bi";
import { getForms } from "@apis/form";
import Pagination from "@components/organisms/Pagination";
import IForm from "@interfaces/Form";
import Can from "@components/atoms/Can";

const columns = [
  {
    key: "name",
    label: "Nome",
  },
  {
    key: "type",
    label: "Tipo",
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

const FormTypes = {
  created: "Criação",
  interaction: "Interação",
  evaluated: "Avaliação",
};

const Action = memo((form: Pick<IForm, "_id" | "slug">) => {
  const navigate = useNavigate();

  const handleEdit = useCallback(() => {
    navigate(`/portal/form/${form._id}`);
  }, [navigate, form._id]);

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

const Forms: React.FC = () => {
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") ?? 1;

  const {
    data: { forms, pagination } = {},
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["forms", String(page)],
    queryFn: getForms,
  });

  const data = useMemo(() => {
    if (!forms) return [];

    return forms.map((form) => ({
      ...form,
      status: form.status === "draft" ? "Rascunho" : "Publicado",
      type: FormTypes[form.type],
      actions: <Action {...form} />,
    }));
  }, [forms]);

  return (
    <Box width="100%" p="10">
      <Heading>Fomulários</Heading>
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

export default Forms;
