import IInstitute from "./Institute";

export enum IUserRoles {
  admin = "admin",
  student = "student",
  teacher = "teacher",
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
};

type AdminOrStudent = BaseUser & { role: "admin" | "student" };
type Teacher = BaseUser & { role: "teacher"; university_degree: string };

type IUser = AdminOrStudent | Teacher;

export default IUser;
