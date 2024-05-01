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
import { getEmails } from "@apis/email";
import Pagination from "@components/organisms/Pagination";
import IEmail from "@interfaces/Email";

const columns = [
  {
    key: "slug",
    label: "Slug",
  },
  {
    key: "subject",
    label: "Titulo",
  },
  {
    key: "actions",
    label: "Ações",
  },
];

const Action = memo((email: IEmail) => {
  const navigate = useNavigate();

  const handleEdit = useCallback(() => {
    navigate(`/portal/email/${email._id}`);
  }, [navigate, email._id]);

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
    navigate(`/portal/email`);
  }, [navigate]);

  return (
    <div>
      <Button colorScheme="blue" mr={2} onClick={handleCreate} size="sm">
        Criar Template de Email
      </Button>
    </div>
  );
});

const Statuses: React.FC = () => {
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") ?? 1;

  const {
    data: { emails, pagination } = {},
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["emails", String(page)],
    queryFn: getEmails,
  });

  const data = useMemo(() => {
    if (!emails) return [];

    return emails.map((email) => ({
      slug: email.slug,
      subject: email.subject,
      actions: <Action {...email} />,
    }));
  }, [emails]);

  return (
    <Box width="100%" p="10">
      <Heading>Templates de Emails</Heading>
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
