import { getActivity } from "@apis/activity";
import { Box, Button, Center, IconButton } from "@chakra-ui/react";
import ActivityDetails from "@components/organisms/ActivityDetails";
import ActivityProvider from "@contexts/ActivityContext";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { FaSync } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const Activity: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = params.id ?? "";
  const navigate = useNavigate();

  const {
    data: activity,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["activity", id],
    queryFn: getActivity,
  });

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <Center width="100%" p={4} flexDirection={"column"}>
      <Box
        w="100%"
        mb={4}
      >
        <Button onClick={handleBack} colorScheme="blue">
          Voltar
        </Button>
      </Box>
      <ActivityProvider refetch={refetch}>
        <ActivityDetails {...{ activity, isLoading }} />
      </ActivityProvider>
      <Box position="fixed" top={4} right={4}>
        <IconButton
          aria-label="Refresh"
          onClick={handleRefresh}
          isLoading={isRefetching}
        >
          <FaSync />
        </IconButton>
      </Box>
    </Center>
  );
};

export default Activity;
