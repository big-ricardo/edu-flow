import { getActivity } from "@apis/activity";
import { Button, Center } from "@chakra-ui/react";
import ActivityDetails from "@components/organisms/ActivityDetails";
import ActivityProvider from "@contexts/ActivityContext";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Activity: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = params.id ?? "";
  const navigate = useNavigate();

  const { data: activity, isLoading } = useQuery({
    queryKey: ["activity", id],
    queryFn: getActivity,
  });

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <Center width="100%" p={4} flexDirection={"column"}>
      <div style={{
        width: "80%",
      }}>
        <Button onClick={handleBack} colorScheme="blue">
          Voltar
        </Button>
      </div>
      <ActivityProvider>
        <ActivityDetails {...{ activity, isLoading }} />
      </ActivityProvider>
    </Center>
  );
};

export default Activity;
