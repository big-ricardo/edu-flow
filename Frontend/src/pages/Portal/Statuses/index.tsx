import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import Table from "@components/organisms/Table";
import { useQuery } from "@tanstack/react-query";
import React, { memo, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BiRefresh, BiEdit } from "react-icons/bi";
import { getStatuses } from "@apis/status";
import Pagination from "@components/organisms/Pagination";
import IStatus from "@interfaces/Status";
import Can from "@components/atoms/Can";
import Filter from "@components/organisms/Filter";
import Text from "@components/atoms/Inputs/Text";
import Select from "@components/atoms/Inputs/Select";
import { useTranslation } from "react-i18next";

const columns = [
  {
    key: "name",
    label: "common.fields.name",
  },
  {
    key: "type",
    label: "common.fields.type",
  },
  {
    key: "actions",
    label: "common.fields.actions",
  },
];

const Action = memo((status: IStatus) => {
  const navigate = useNavigate();

  const handleEdit = useCallback(() => {
    navigate(`/portal/status/${status._id}`);
  }, [navigate, status._id]);

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
    navigate(`/portal/status`);
  }, [navigate]);

  return (
    <div>
      <Can permission="status.create">
        <Button colorScheme="blue" mr={2} onClick={handleCreate} size="sm">
          {t("statuses.create")}
        </Button>
      </Can>
    </div>
  );
});

const Statuses: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const {
    data: { statuses, pagination } = {},
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["statuses", searchParams.toString()],
    queryFn: getStatuses,
  });

  const data = useMemo(() => {
    if (!statuses) return [];

    return statuses.map((status) => ({
      ...status,
      type: t(`common.fields.statusType.${status.type}`),
      actions: <Action {...status} />,
    }));
  }, [statuses]);

  return (
    <Box width="100%" p="10">
      <Heading>{t("statuses.title")}</Heading>
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
            id: "name",
            label: t("common.fields.name"),
          }}
        />

        <Select
          input={{
            id: "type",
            label: t("common.fields.type"),
            options: [
              { value: "done", label: t("common.fields.statusType.done") },
              {
                value: "progress",
                label: t("common.fields.statusType.progress"),
              },
              {
                value: "canceled",
                label: t("common.fields.statusType.canceled"),
              },
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
          <Heading color="red.500">{t("satatuses.error")}</Heading>
        </Flex>
      )}
    </Box>
  );
};

export default Statuses;
