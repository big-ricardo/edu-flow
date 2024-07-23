import { Connection } from "mongoose";
import Log, { ILog } from "../../models/client/Log";
import BaseRepository from "../base";

export default class LogRepository extends BaseRepository<ILog> {
  constructor(connection: Connection) {
    super(new Log(connection).model());
  }
}
