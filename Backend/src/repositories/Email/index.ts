import { Connection } from "mongoose";
import Email, { IEmail } from "../../models/client/Email";
import BaseRepository from "../base";

export default class EmailRepository extends BaseRepository<IEmail> {
  constructor(connection: Connection) {
    super(new Email(connection).model());
  }
}
