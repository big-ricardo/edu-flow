import React, { useMemo, useCallback } from "react";
import { Box, Heading, Flex, IconButton } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { FaSync } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import Pagination from "@components/organisms/Pagination";
import Table from "@components/organisms/Table";
import { getActivitiesDashboard } from "@apis/activity";
import Action from "./components/Action";
import Filters from "./components/Filters";
import MetricsCards from "./components/MetricisCards";
import { PieChart, BarChart } from "./components/Charts";

const columns = [
  { key: "name", label: "common.fields.name" },
  { key: "protocol", label: "common.fields.protocol" },
  { key: "status", label: "common.fields.status" },
  { key: "users", label: "common.fields.users" },
  { key: "actions", label: "common.fields.actions" },
];

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
      actions: <Action activity={activity} />,
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

  const mastermindChartData = useMemo(() => {
    if (!metrics) return { categories: [], series: [] };

    const mastermindsMap = metrics.countByMastermind.reduce(
      (acc, mastermind) => {
        const { mastermindId, mastermindName, status, count } = mastermind;

        // Se o mastermindId ainda não existe no acumulador, inicializa o objeto
        if (!acc[mastermindId]) {
          acc[mastermindId] = {
            mastermindName: mastermindName || t("common.unknown"),
            statusCounts: {}, // Armazena contagens por status
          };
        }

        // Acumula a contagem de status por mastermind
        acc[mastermindId].statusCounts[status] =
          (acc[mastermindId].statusCounts[status] || 0) + count;

        return acc;
      },
      {} as Record<
        string,
        { mastermindName: string; statusCounts: Record<string, number> }
      >
    );

    // Extrai os nomes dos masterminds para o eixo X (categories)
    const categories = Object.values(mastermindsMap).map(
      (mastermind) => mastermind.mastermindName
    );

    // Define os possíveis status para a série (ex: "aberto", "fechado")
    const statusKeys = [
      ...new Set(metrics.countByMastermind.map((item) => item.status)),
    ];

    // Cria uma série de dados para cada status
    const series = statusKeys.map((statusKey) => ({
      name: statusKey, // Nome do status
      data: Object.values(mastermindsMap).map(
        (mastermind) => mastermind.statusCounts[statusKey] || 0
      ),
    }));

    return { categories, series };
  }, [metrics, t]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) return <Heading>Carregando...</Heading>;
  if (isError || !metrics)
    return (
      <Heading color="red.500">Erro ao carregar dados do dashboard</Heading>
    );

  return (
    <Box p="10" w="100%">
      <Flex justifyContent="space-between">
        <Heading size="lg" mb="6">
          Dashboard de Atividades
        </Heading>
        <IconButton
          aria-label="Refresh"
          onClick={handleRefresh}
          isLoading={isRefetching}
        >
          <FaSync />
        </IconButton>
      </Flex>

      <Filters />

      <MetricsCards
        openActivitiesCount={metrics.openActivitiesCount}
        closedActivitiesCount={metrics.closedActivitiesCount}
      />

      <Flex
        justifyContent="space-around"
        direction={["column", "row"]}
        w="100%"
      >
        <PieChart
          title="Distribuição de Status das Atividades"
          data={statusChartData}
        />
        <PieChart
          title="Distribuição por Tipo de Formulário"
          data={formTypeChartData}
        />
      </Flex>

      <BarChart
        title="Contagem de Status por Orientador"
        data={mastermindChartData}
      />

      <Flex
        justifyContent="center"
        alignItems="center"
        mt="4"
        width="100%"
        p="4"
        borderRadius="md"
        direction="column"
        overflow="auto"
        bg="bg.card"
      >
        <Table columns={columns} data={data} isLoading={isFetching} />
        <Pagination pagination={metrics.pagination} />
      </Flex>
    </Box>
  );
};

export default DashboardPage;
