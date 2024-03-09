import Response from "@interfaces/Response";
import IComment from "@interfaces/Comments";
import api from "@services/api";
import IPagination from "@interfaces/Pagination";
import IUser from "@interfaces/User";

type ReqComment = Response<IComment>;
type ResComments = Response<
  {
    comments: Array<
      Omit<IComment, "user"> & { user: Pick<IUser, "name" | "_id" | "email"> }
    >;
  } & IPagination
>;

export const getComments = async ({
  queryKey: [, id, page = "1", limit = "10"],
}: {
  queryKey: string[];
}) => {
  const res = await api.get<ResComments>(`/comments/${id}`, {
    params: { page, limit },
  });

  return res.data.data;
};

export const createComment = async (
  data: Pick<IComment, "content" | "activity">,
) => {
  const res = await api.post<ReqComment>(`/comment/${data.activity}`, data);

  return res.data.data;
};

export const updateComment = async (
  data: Pick<IComment, "content" | "_id">,
) => {
  const res = await api.put<ReqComment>(`/comment/${data._id}`, data);
  return res.data.data;
};

export const createOrUpdateComment = async (
  data: Pick<IComment, "content" | "activity"> & { _id?: string },
) => {
  if (data?._id) {
    return updateComment(data as Pick<IComment, "content" | "_id">);
  }

  return createComment(data);
};
