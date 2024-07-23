export enum IUserRoles {
  admin = "admin",
  student = "student",
  teacher = "teacher",
}

export default interface JwtData {
  id: string;
  name: string;
  matriculation: string;
  email: string;
  roles: IUserRoles[];
  role: IUserRoles;
  slug: string;
  client: string;
  permissions: string[];
  tutorials: string[];
}
