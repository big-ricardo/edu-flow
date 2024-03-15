import IPagination from "@interfaces/Pagination";
import Response from "@interfaces/Response";
import IUser from "@interfaces/User";
import api from "@services/api";
import IInstitute from "@interfaces/Institute";

type User = Pick<
  IUser,
  | "_id"
  | "name"
  | "email"
  | "cpf"
  | "password"
  | "matriculation"
  | "institute"
  | "roles"
  | "active"
>;
type ReqUsers = Response<
  {
    users: (Omit<User, "institute"> & {
      institute: Pick<IInstitute, "_id" | "acronym">;
    })[];
  } & IPagination
>;
type ReqUser = Response<User>;

export const getUsers = async ({
  queryKey: [, page = "1", limit = "10"],
}: {
  queryKey: string[];
}) => {
  const res = await api.get<ReqUsers>("/users", {
    params: { page, limit },
  });

  return res.data.data;
};

export const getUser = async ({ queryKey: [, id] }: { queryKey: string[] }) => {
  const res = await api.get<ReqUser>(`/user/${id}`);

  return res.data.data;
};

export const createUser = async (data: Omit<User, "_id" | "password">) => {
  const res = await api.post<ReqUser>("/user", data);

  return res.data.data;
};

export const updateUser = async (data: User) => {
  const res = await api.put<ReqUser>(`/user/${data._id}`, data);

  return res.data.data;
};

export const createOrUpdateUser = async (
  data: Omit<User, "_id" | "password"> & { _id?: string; password?: string },
) => {
  if (data?._id) {
    return updateUser(data as User);
  }

  return createUser(data);
};

type ReqUserForms = Response<{
  institutes: { label: string; options: { label: string; value: string }[] }[];
  roles: { label: string; value: string }[];
}>;
export const getUserForms = async () => {
  const res = await api.get<ReqUserForms>("/user/forms");

  return res.data.data;
};
