import { Connection } from "mongoose";
import Answer, { IAnswer } from "../../models/client/Answer";
import BaseRepository from "../base";

export default class AnswerRepository extends BaseRepository<IAnswer> {
  constructor(connection: Connection) {
    super(new Answer(connection).model());
  }
}
