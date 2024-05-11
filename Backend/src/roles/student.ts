import { IUserRoles } from "../models/client/User";
import { Role } from "./";

export const StudentRole: Role = {
  name: IUserRoles.student,
  permissions: [
    {
      name: "dashboard",
      permissions: ["view"],
    },
    {
      name: "activity",
      permissions: [
        "create",
        "update",
        "read",
      ],
    },
    {
      name: "response",
      permissions: ["create", "read", "update", "delete"],
    },
    {
      name: "answer",
      permissions: ["view", "create", "read"],
    },
    {
      name: "comment",
      permissions: ["view", "create", "read", "update", "delete"],
    },
  ],
};
