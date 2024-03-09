export type IComment = {
  _id: string;
  activity: string;
  user: string;
  content: string;
  viewed: string[];
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
};

export default IComment;
