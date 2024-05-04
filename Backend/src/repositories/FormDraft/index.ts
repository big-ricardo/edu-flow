import { Connection } from "mongoose";
import FormDraft, { IFormDraft } from "../../models/client/FormDraft";
import BaseRepository from "../base";

export default class FormDraftRepository extends BaseRepository<IFormDraft> {
  constructor(connection: Connection) {
    super(new FormDraft(connection).model());
  }
}
