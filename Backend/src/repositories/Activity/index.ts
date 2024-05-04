import { Connection } from "mongoose";
import Activity, { IActivity } from "../../models/client/Activity";
import BaseRepository from "../base";

export default class ActivityRepository extends BaseRepository<IActivity> {
  constructor(connection: Connection) {
    super(new Activity(connection).model());
  }
}
