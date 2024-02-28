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
  data,
}: {
  form: IForm;
  data: Record<string, string | { file: string }>;
}) => {
  const res = await api.post<ReqInstitute>(
    `/response/${form._id}/${form.type}`,
    data,
  );

  return res.data.data;
};
