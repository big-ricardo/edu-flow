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
  client: {
    _id: string;
    acronym: string;
    name: string;
  };
  permissions: string[];
}
