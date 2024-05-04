import { Connection } from "mongoose";
import User, { IUser } from "../../models/client/User";
import BaseRepository from "../base";

export default class UserRepository extends BaseRepository<IUser> {
  constructor(connection: Connection) {
    super(new User(connection).model());
  }
}
