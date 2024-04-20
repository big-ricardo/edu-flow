import IInstitute from "@interfaces/Institute";
import api from "@services/api";
import Response from "@interfaces/Response";
import IForm from "@interfaces/Form";

type Institute = Pick<
  IInstitute,
  "_id" | "name" | "acronym" | "active" | "university"
>;

type ReqInstitute = Response<Institute[]>;

export const responseForm = async ({
  form,
  activity_id,
  data,
}: {
  form: IForm;
  activity_id?: string;
  data: Record<string, string | { file: string }>;
}) => {
  return createAnswer({ form, data, activity_id });
};

const createAnswer = async ({
  form,
  data,
  activity_id,
}: {
  form: IForm;
  data: Record<string, string | { file: string }>;
  activity_id?: string;
}) => {
  const res = await api.post<ReqInstitute>(
    `/response/${form._id}/${form.type}${activity_id ? "/" + activity_id : ""}`,
    data
  );

  return res.data.data;
};

export const updateResponseForm = async ({
  activity_id,
  data,
}: {
  activity_id: string;
  data: Record<string, string | { file: string }>;
}) => {
  const res = await api.post<ReqInstitute>(
    `/response/${activity_id}/edit`,
    data
  );

  return res.data.data;
};
