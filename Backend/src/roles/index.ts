import { AdminRole } from "./admin";
import { TeacherRole } from "./teacher";
import { StudentRole } from "./student";

type Permission = {
  name: string;
  permissions: Array<string>;
};

export type Role = {
  name: string;
  permissions: Array<Permission>;
};

export const roles = [AdminRole, TeacherRole, StudentRole];
