import { Connection } from "mongoose";
import Workflow, { IWorkflow } from "../../models/client/Workflow";
import BaseRepository from "../base";

export default class WorkflowRepository extends BaseRepository<IWorkflow> {
  constructor(connection: Connection) {
    super(new Workflow(connection).model());
  }
}
