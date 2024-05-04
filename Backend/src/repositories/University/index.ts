import { Connection } from "mongoose";
import University, { IUniversity } from "../../models/client/University";
import BaseRepository from "../base";

export default class UniversityRepository extends BaseRepository<IUniversity> {
  constructor(connection: Connection) {
    super(new University(connection).model());
  }
}
