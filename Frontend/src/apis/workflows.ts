import IPagination from "@interfaces/Pagination";
import Response from "@interfaces/Response";
import { IWorkflow } from "@interfaces/Workflow";
import api from "@services/api";
import { ReactFlowJsonObject } from "reactflow";

export type ReqWorkflow = Response<ReactFlowJsonObject>;
type ReqWorkflows = Response<
  {
    workflows: Pick<IWorkflow, "name" | "active" | "_id">[];
  } & IPagination
>;
type Workflow = Pick<IWorkflow, "steps" | "_id">;

export const getWorkflows = async ({
  queryKey: [, page = "1", limit = "10"],
}: {
  queryKey: string[];
}) => {
  const res = await api.get<ReqWorkflows>("/workflows", {
    params: { page, limit },
  });

  return res.data.data;
};

export const getWorkflow = async ({
  queryKey: [, id],
}: {
  queryKey: string[];
}) => {
  const res = await api.get<ReqWorkflow>(`/workflow/${id}`);

  return res.data.data;
};

export const createWorkflow = async (data: Omit<Workflow, "_id">) => {
  const res = await api.post<ReqWorkflow>("/workflow", data);

  return res.data.data;
};

export const updateWorkflow = async (data: IWorkflow) => {
  const res = await api.put<ReqWorkflow>(`/workflow/${data._id}`, data);

  return res.data.data;
};

export const createOrUpdateWorkflow = async (
  data: Pick<IWorkflow, "steps" | "viewport"> & { _id?: string }
) => {
  if (data?._id) {
    return updateWorkflow(data as IWorkflow);
  }

  return createWorkflow(data);
};

type ReqWorkflowForms = Response<{
  statuses: { label: string; options: { label: string; value: string }[] }[];
  emails: { label: string; value: string }[];
  users: { label: string; value: string }[];
}>;

export const getWorkflowForms = async () => {
  const res = await api.get<ReqWorkflowForms>("/workflows/forms");

  return res.data.data;
};
