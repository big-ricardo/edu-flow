import { roles } from "../roles";

export class Permissions {
  private roles: Array<string>;

  static getPermissionsByRoles(userRoles: Array<string>) {
    return roles
      .filter(({ name }) => userRoles.includes(name))
      .flatMap(({ permissions }) => permissions)
      .flatMap(({ name, permissions }) =>
        permissions.map((p) => `${name}.${p}`)
      );
  }

  constructor(roles: Array<string>) {
    this.roles = roles;
  }

  public getRoles(): Array<string> {
    return this.roles.map((role) => role);
  }

  public hasPermission(permission: string): boolean {
    return this.roles.some((r) => r === permission);
  }
}
