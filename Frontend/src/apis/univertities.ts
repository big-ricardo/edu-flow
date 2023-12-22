import IPagination from "@interfaces/Pagination";
import Response from "@interfaces/Response";
import IUniversity from "@interfaces/University";
import api from "@services/api";

type University = Pick<IUniversity, "_id" | "name" | "acronym" | "active">;
type ReqUniversities = Response<{ universities: University[] } & IPagination>;
type ReqUniversity = Response<University>;

export const getUniversities = async ({
  queryKey: [, page = "1", limit = "10"],
}: {
  queryKey: string[];
}) => {
  const res = await api.get<ReqUniversities>("/universities", {
    params: { page, limit },
  });

  return res.data.data;
};

export const getUniversity = async ({
  queryKey: [, id],
}: {
  queryKey: string[];
}) => {
  const res = await api.get<ReqUniversity>(`/university/${id}`);

  return res.data.data;
};

export const createUniversity = async (data: Omit<University, "_id">) => {
  const res = await api.post<ReqUniversity>("/university", data);

  return res.data.data;
};

export const updateUniversity = async (data: University) => {
  const res = await api.put<ReqUniversity>(`/university/${data._id}`, data);

  return res.data.data;
};

export const createOrUpdateUniversity = async (
  data: Omit<University, "_id"> & { _id?: string }
) => {
  if (data?._id) {
    return updateUniversity(data as University);
  }

  return createUniversity(data);
};
