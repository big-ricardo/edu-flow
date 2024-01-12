import IPagination from "@interfaces/Pagination";
import Response from "@interfaces/Response";
import IForm from "@interfaces/Form";
import api from "@services/api";

type Form = IForm;
type ReqForms = Response<
  {
    forms: Pick<
      IForm,
      "_id" | "name" | "description" | "initial_status" | "status" | "type"
    >[];
  } & IPagination
>;
type ReqForm = Response<Form>;

export const getForms = async ({
  queryKey: [, page = "1", limit = "10"],
}: {
  queryKey: string[];
}) => {
  const res = await api.get<ReqForms>("/forms", {
    params: { page, limit },
  });

  return res.data.data;
};

export const getForm = async ({ queryKey: [, id] }: { queryKey: string[] }) => {
  const res = await api.get<ReqForm>(`/form/${id}`);

  return res.data.data;
};

export const createForm = async (data: Omit<Form, "_id">) => {
  const res = await api.post<ReqForm>("/form", data);

  return res.data.data;
};

export const updateForm = async (data: Form) => {
  const res = await api.put<ReqForm>(`/form/${data._id}`, data);

  return res.data.data;
};

export const createOrUpdateForm = async (
  data: Omit<Form, "_id"> & { _id?: string }
) => {

  if (data?._id) {
    return updateForm(data as Form);
  }

  return createForm(data);
};

type ReqFormForms = Response<{
  status: { label: string; value: string }[];
}>;
export const getFormForms = async () => {
  const res = await api.get<ReqFormForms>("/form/forms");

  return res.data.data;
};
