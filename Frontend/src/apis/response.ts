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
  edit_id,
  activity_id,
  data,
}: {
  form: IForm;
  edit_id?: string;
  activity_id?: string;
  data: Record<string, string | { file: string }>;
}) => {
  if (edit_id) {
    return updateAnswer({ form, activity_id: edit_id, data });
  }

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

const updateAnswer = async ({
  form,
  activity_id,
  data,
}: {
  form: IForm;
  activity_id: string;
  data: Record<string, string | { file: string }>;
}) => {
  const res = await api.post<ReqInstitute>(
    `/edit/${activity_id}/${form.type}`,
    data
  );

  return res.data.data;
};
