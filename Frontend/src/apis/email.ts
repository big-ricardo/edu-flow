import IPagination from "@interfaces/Pagination";
import Response from "@interfaces/Response";
import IEmail from "@interfaces/Email";
import api from "@services/api";

type Email = Pick<IEmail, "_id" | "slug" | "subject" | "htmlTemplate">;
type ReqEmails = Response<{ emails: Email[] } & IPagination>;
type ReqEmail = Response<Email>;

export const getEmails = async ({
  queryKey: [, page = "1", limit = "10"],
}: {
  queryKey: string[];
}) => {
  const res = await api.get<ReqEmails>("/emails", {
    params: { page, limit },
  });

  return res.data.data;
};

export const getEmail = async ({
  queryKey: [, id],
}: {
  queryKey: string[];
}) => {
  const res = await api.get<ReqEmail>(`/email/${id}`);

  return res.data.data;
};

export const createEmail = async (data: Omit<Email, "_id">) => {
  const res = await api.post<ReqEmail>("/email", data);

  return res.data.data;
};

export const updateEmail = async (data: Email) => {
  const res = await api.put<ReqEmail>(`/email/${data._id}`, data);

  return res.data.data;
};

export const createOrUpdateEmail = async (
  data: Omit<Email, "_id"> & { _id?: string },
) => {
  if (data?._id) {
    return updateEmail(data as Email);
  }

  createEmail(data);
};
