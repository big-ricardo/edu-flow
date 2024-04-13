export type FileUploaded = {
  name: string;
  url: string;
  mimeType: string;
  size: string;
  containerName: string;
};

export type IAnswer = {
  _id: string;
  user: string;
  activity: string;
  submitted: boolean;
  form_draft: string;
  data: {
    [key: string]: string | number | boolean | string[] | FileUploaded;
  };
  createdAt: string;
  updatedAt: string;
};
