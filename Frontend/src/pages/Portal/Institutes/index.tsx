import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import Pagination from "@components/organisms/Pagination";
import Table from "@components/organisms/Table";
import { useQuery } from "@tanstack/react-query";
import React, { memo, useCallback, useMemo } from "react";
import { BiEdit, BiRefresh } from "react-icons/bi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getInstitutes } from "@apis/institutes";
import Can from "@components/atoms/Can";
import { useTranslation } from "react-i18next";

const columns = [
  {
    key: "name",
    label: "common.fields.name",
  },
  {
    key: "acronym",
    label: "common.fields.acronym",
  },
  {
    key: "active",
    label: "common.fields.status",
  },
  {
    key: "actions",
    label: "common.fields.actions",
  },
];

const Action = memo((institute: { _id: string }) => {
  const navigate = useNavigate();

  const handleEdit = useCallback(() => {
    navigate(`/portal/institute/${institute._id}`);
  }, [navigate, institute._id]);

  return (
    <div>
      <Button mr={2} onClick={handleEdit} size="sm">
        <BiEdit size={20} />
      </Button>
    </div>
  );
});

const Create = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCreate = useCallback(() => {
    navigate(`/portal/institute`);
  }, [navigate]);

  return (
    <div>
      <Can permission="institute.create">
        <Button colorScheme="blue" mr={2} onClick={handleCreate} size="sm">
          {t("institutes.create")}
        </Button>
      </Can>
    </div>
  );
});

const Institutes: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") ?? 1;

  const {
    data: { institutes, pagination } = {},
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["institutes", String(page)],
    queryFn: getInstitutes,
  });

  const data = useMemo(() => {
    if (!institutes) return [];

    return institutes.map((institute) => ({
      ...institute,
      active: institute.active
        ? t("common.fields.active")
        : t("common.fields.inactive"),
      actions: <Action {...institute} />,
    }));
  }, [institutes, t]);

  return (
    <Box width="100%" p="10">
      <Heading>{t("institutes.title")}</Heading>
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
          <Heading color="red.500">{t("institutes.error")}</Heading>
        </Flex>
      )}
    </Box>
  );
};

export default Institutes;
