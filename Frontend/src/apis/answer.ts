import Response from "@interfaces/Response";
import api from "@services/api";
import { IAnswer } from "@interfaces/Answer";

type ReqAnswer = Response<IAnswer>;

export const getAnswer = async ({
  queryKey: [, id],
}: {
  queryKey: string[];
}) => {
  const res = await api.get<ReqAnswer>(`/answer/${id}`);

  return res.data.data;
};
