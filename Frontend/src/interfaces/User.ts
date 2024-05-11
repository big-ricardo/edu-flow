import IInstitute from "./Institute";

export enum IUserRoles {
  admin = "admin",
  student = "student",
  teacher = "teacher",
}

export enum ITeacherDegrees {
  mastermind = "mastermind",
  doctor = "doctor",
}

type BaseUser = {
  _id: string;
  name: string;
  email: string;
  isExternal: boolean;
  password: string;
  matriculation: string;
  institute: IInstitute;
  active: boolean;
  roles: IUserRoles[];
  university_degree?: ITeacherDegrees;
};

type IUser = BaseUser;

export default IUser;
