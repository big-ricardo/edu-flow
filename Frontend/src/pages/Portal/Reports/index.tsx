import React, { memo, useCallback, useMemo } from "react";
import {
  Box,
  Heading,
  Flex,
  Card,
  CardBody,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Chart from "react-apexcharts";
import { getActivitiesDashboard } from "@apis/activity";
import { useTranslation } from "react-i18next";
import { FaSync } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import Pagination from "@components/organisms/Pagination";
import IActivity from "@interfaces/Activitiy";
import Table from "@components/organisms/Table";
import Filter from "@components/organisms/Filter";
import Text from "@components/atoms/Inputs/Text";
import Select from "@components/atoms/Inputs/Select";

const columns = [
  {
    key: "name",
    label: "common.fields.name",
  },
  {
    key: "protocol",
    label: "common.fields.protocol",
  },
  {
    key: "status",
    label: "common.fields.status",
  },
  {
    key: "users",
    label: "common.fields.users",
  },
  {
    key: "actions",
    label: "common.fields.actions",
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

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const {
    data: metrics,
    isLoading,
    isError,
    refetch,
    isRefetching,
    isFetching,
  } = useQuery({
    queryKey: ["dashboardMetrics", searchParams.toString()],
    queryFn: getActivitiesDashboard,
  });

  const data = useMemo(() => {
    if (!metrics?.activities) return [];

    return metrics.activities.map((activity) => ({
      ...activity,
      status: activity.status.name,
      users: activity.users.map((user) => user.name).join(", "),
      actions: <Action {...activity} />,
    }));
  }, [metrics?.activities]);

  const statusChartData = useMemo(() => {
    if (!metrics) return { labels: [], series: [] };
    return {
      labels: metrics.statusCounts.map(
        (status) => status._id || t("common.unknown")
      ),
      series: metrics.statusCounts.map((status) => status.count),
    };
  }, [metrics]);

  const formTypeChartData = useMemo(() => {
    if (!metrics) return { labels: [], series: [] };
    return {
      labels: metrics.formTypeCounts.map(
        (form) => form._id || t("common.unknown")
      ),
      series: metrics.formTypeCounts.map((form) => form.count),
    };
  }, [metrics]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <Heading>Carregando...</Heading>;
  }

  if (isError || !metrics) {
    return (
      <Heading color="red.500">Erro ao carregar dados do dashboard</Heading>
    );
  }

  return (
    <Box p="10" w="100%">
      <Flex justifyContent="space-between">
        <Heading size="lg" mb="6">
          Dashboard de Atividades
        </Heading>
        <Box>
          <IconButton
            aria-label="Refresh"
            onClick={handleRefresh}
            isLoading={isRefetching}
          >
            <FaSync />
          </IconButton>
        </Box>
      </Flex>

      <Card w="100%" p={0} mb={6}>
        <CardBody>
          <Filter.Container>
            <Select
              input={{
                id: "date_type",
                options: [
                  { label: "Data de Criação", value: "createdAt" },
                  { label: "Data de Finalização", value: "finished_at" },
                ],
                placeholder: "Selecione uma opção",
                label: "Tipo de Data",
              }}
            />

            <Text
              input={{
                id: "start_date",
                type: "date",
                label: "Data Inicial",
              }}
            />

            <Text
              input={{
                id: "end_date",
                type: "date",
                label: "Data Final",
              }}
            />
          </Filter.Container>
        </CardBody>
      </Card>

      <Flex
        justifyContent="space-between"
        mb="6"
        wrap="wrap"
        direction={["column", "row"]}
        w="100%"
      >
        <Card>
          <CardBody>
            <Heading size="md">Atividades Abertas</Heading>
            <Heading size="lg" color="green.500">
              {metrics.openActivitiesCount}
            </Heading>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Heading size="md">Atividades Fechadas</Heading>
            <Heading size="lg" color="red.500">
              {metrics.closedActivitiesCount}
            </Heading>
          </CardBody>
        </Card>
      </Flex>

      <Card w="100%">
        <CardBody>
          <Flex justifyContent="space-around" direction={["column", "row"]}>
            <Box mb="6">
              <Heading size="md" mb="4">
                Distribuição de Status das Atividades
              </Heading>
              <Chart
                type="pie"
                options={{
                  labels: statusChartData.labels,
                }}
                series={statusChartData.series}
                height={300}
              />
            </Box>

            <Box>
              <Heading size="md" mb="4">
                Distribuição por Tipo de Formulário
              </Heading>
              <Chart
                type="pie"
                options={{
                  labels: formTypeChartData.labels,
                }}
                series={formTypeChartData.series}
                height={300}
              />
            </Box>
          </Flex>
        </CardBody>
      </Card>

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
        <Pagination pagination={metrics.pagination} isLoading={isFetching} />
      </Flex>
    </Box>
  );
};

export default DashboardPage;
