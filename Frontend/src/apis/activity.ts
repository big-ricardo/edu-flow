import Response from "@interfaces/Response";
import IActivity, { IActivityDetails } from "@interfaces/Activitiy";
import api from "@services/api";

type ReqActivity = Response<IActivity>;

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
  const res = await api.get<Response<IActivityDetails>>(`/activity/${id}`);

  return res.data.data;
};

type ReqFormForms = Response<{
  teachers: { label: string; value: string }[];
  students: { label: string; value: string }[];
}>;
export const getActivityForms = async () => {
  const res = await api.get<ReqFormForms>("/activity/forms");

  return res.data.data;
};
