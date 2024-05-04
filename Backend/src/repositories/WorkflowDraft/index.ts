import { Connection } from "mongoose";
import WorkflowDraft, {
  IWorkflowDraft,
} from "../../models/client/WorkflowDraft";
import BaseRepository from "../base";

export default class WorkflowDraftRepository extends BaseRepository<IWorkflowDraft> {
  constructor(connection: Connection) {
    super(new WorkflowDraft(connection).model());
  }
}
