import { getActivity } from "@apis/activity";
import { Center, Spinner } from "@chakra-ui/react";
import ActivityDetails from "@components/organisms/ActivityDetails";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";

const Activity: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = params.id ?? "";

  const { data: activity, isLoading } = useQuery({
    queryKey: ["activity", id],
    queryFn: getActivity,
  });

  if (isLoading) return <Spinner />;

  return (
    <Center width="100%" p={4}>
      <ActivityDetails activity={activity} />
    </Center>
  );
};

export default Activity;
