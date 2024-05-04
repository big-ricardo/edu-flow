import { Connection } from "mongoose";
import Status, { IStatus } from "../../models/client/Status";
import BaseRepository from "../base";

export default class StatusRepository extends BaseRepository<IStatus> {
  constructor(connection: Connection) {
    super(new Status(connection).model());
  }
}
