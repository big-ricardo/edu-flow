import IPagination from "@interfaces/Pagination";
import Response from "@interfaces/Response";
import IActivity from "@interfaces/Activitiy";
import api from "@services/api";
import IForm from "@interfaces/Form";

type Activity = Pick<
  IActivity,
  "_id" | "name" | "description" | "createdAt" | "protocol" | "state"
> & {
  users: {
    _id: string;
    name: string;
    matriculation: string;
  }[];
  form: {
    name: string;
    slug: string;
  };
};

type ReqMyActivities = Response<{
  activities: Activity[];
  pagination: IPagination;
}>;

export const getMyActivities = async ({
  queryKey: [, page = "1", limit = "10"],
}: {
  queryKey: string[];
}) => {
  const res = await api.get<ReqMyActivities>("/dashboard/my-activities", {
    params: { page, limit },
  });

  return res.data.data;
};

export const getOpenForms = async ({
  queryKey: [, page = "1", limit = "10"],
}: {
  queryKey: string[];
}) => {
  const res = await api.get<Response<IForm[]>>("/dashboard/open-forms", {
    params: { page, limit },
  });

  return res.data.data;
};

export const getApprovedActivities = async ({
  queryKey: [, page = "1", limit = "10"],
}: {
  queryKey: string[];
}) => {
  const res = await api.get<ReqMyActivities>("/dashboard/approved-activities", {
    params: { page, limit },
  });

  return res.data.data;
};

export const getMyActivitiesPendingAcceptance = async ({
  queryKey: [, page = "1", limit = "10"],
}: {
  queryKey: string[];
}) => {
  const res = await api.get<ReqMyActivities>(
    "/dashboard/my-pending-activities",
    {
      params: { page, limit },
    }
  );

  return res.data.data;
};
