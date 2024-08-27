import IPagination from "@interfaces/Pagination";
import Response from "@interfaces/Response";
import IInstitute from "@interfaces/Institute";
import api from "@services/api";

type Institute = Pick<IInstitute, "_id" | "name" | "acronym" | "active">;
type ReqInstitutes = Response<
  {
    institutes: Institute[];
  } & IPagination
>;
type ReqInstitute = Response<Institute>;

export const getInstitutes = async ({
  queryKey: [, page = "1", limit = "10"],
}: {
  queryKey: string[];
}) => {
  const res = await api.get<ReqInstitutes>("/institutes", {
    params: { page, limit },
  });

  return res.data.data;
};

export const getInstitute = async ({
  queryKey: [, id],
}: {
  queryKey: string[];
}) => {
  const res = await api.get<ReqInstitute>(`/institute/${id}`);

  return res.data.data;
};

export const createInstitute = async (data: Omit<IInstitute, "_id">) => {
  const res = await api.post<ReqInstitute>("/institute", data);

  return res.data.data;
};

export const updateInstitute = async (data: IInstitute) => {
  const res = await api.put<ReqInstitute>(`/institute/${data._id}`, data);

  return res.data.data;
};

export const createOrUpdateInstitute = async (
  data: Omit<Institute, "_id"> & {
    _id?: string;
  }
) => {
  if (data?._id) {
    return updateInstitute(data as IInstitute);
  }

  return createInstitute(data);
};
