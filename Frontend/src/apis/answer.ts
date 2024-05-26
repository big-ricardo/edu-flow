import Response from "@interfaces/Response";
import api from "@services/api";
import { IAnswer } from "@interfaces/Answer";
import { IField } from "@interfaces/FormDraft";

type ReqAnswer = Response<IAnswer>;

export const getAnswer = async ({
  queryKey: [, id],
}: {
  queryKey: string[];
}) => {
  const res = await api.get<ReqAnswer>(`/answer/${id}`);

  return res.data.data;
};

export const saveDraft = async ({
  formId,
  activityId,
  data,
}: {
  formId: string;
  data: Record<string, any>;
  activityId: string;
}) => {
  return await api.post(`/form/${formId}/answer/${activityId}`, data);
};

export const getDraftAnswer = async ({
  queryKey: [, formId, , activityId],
}: {
  queryKey: string[];
}) => {
  const response = await api.get<
    Response<{
      data: Record<string, IField>;
    }>
  >(`/form/${formId}/answer/${activityId}`);

  return response.data.data;
};
