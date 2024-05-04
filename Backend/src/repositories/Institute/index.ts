import { Connection } from "mongoose";
import Institute, { IInstitute } from "../../models/client/Institute";
import BaseRepository from "../base";

export default class InstituteRepository extends BaseRepository<IInstitute> {
  constructor(connection: Connection) {
    super(new Institute(connection).model());
  }
}
