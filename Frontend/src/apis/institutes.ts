import IPagination from "@interfaces/Pagination";
import Response from "@interfaces/Response";
import IInstitute from "@interfaces/Institute";
import api from "@services/api";

type Institute = Pick<
  IInstitute,
  "_id" | "name" | "acronym" | "active" | "university"
>;
type ReqInstitutes = Response<
  {
    institutes: Institute[];
  } & IPagination
>;
type ReqInstitute = Response<Institute>;
type InstituteDTO = Omit<Institute, "university"> & {
  university: string;
};

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

export const createInstitute = async (data: Omit<InstituteDTO, "_id">) => {
  const res = await api.post<ReqInstitute>("/institute", data);

  return res.data.data;
};

export const updateInstitute = async (data: InstituteDTO) => {
  const res = await api.put<ReqInstitute>(`/institute/${data._id}`, data);

  return res.data.data;
};

export const createOrUpdateInstitute = async (
  data: Omit<Institute, "_id" | "university"> & {
    _id?: string;
    university: string;
  }
) => {
  if (data?._id) {
    return updateInstitute(data as InstituteDTO);
  }

  return createInstitute(data);
};

type ReqInstituteForms = Response<{
  universities: { label: string; value: string }[];
}>;
export const getInstituteForms = async () => {
  const res = await api.get<ReqInstituteForms>("/institute/forms");

  return res.data.data;
};
