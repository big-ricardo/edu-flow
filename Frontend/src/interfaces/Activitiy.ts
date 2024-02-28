export enum IActivityState {
  finished = "finished",
  processing = "processing",
  created = "created",
}

export default interface IActivity {
  _id: string;
  name: string;
  description: string;
  state: IActivityState;
  status: string;
  protocol: string;
  users: string[];
  createdAt: string;
}
