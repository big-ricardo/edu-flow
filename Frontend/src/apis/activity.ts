import Response from "@interfaces/Response";
import IActivity from "@interfaces/Activitiy";
import api from "@services/api";

type Activity = Omit<IActivity, "form" | "status" | "workflows" | "users"> & {
  users: {
    _id: string;
    name: string;
    matriculation: string;
    email: string;
  }[];
  status: {
    _id: string;
    name: string;
  };
};

type ReqActivity = Response<Activity>;

export const getActivities = async ({
  queryKey: [, page = "1", limit = "10"],
}: {
  queryKey: string[];
}) => {
  const res = await api.get<ReqActivity>("/activities", {
    params: { page, limit },
  });

  return res.data.data;
};

export const getActivity = async ({
  queryKey: [, id],
}: {
  queryKey: string[];
}) => {
  const res = await api.get<Response<Activity>>(`/activity/${id}`);

  return res.data.data;
};
