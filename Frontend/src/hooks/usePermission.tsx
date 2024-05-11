import { useCallback } from "react";
import useAuth from "./useAuth";

export default function usePermission() {
  const [data] = useAuth();

  const userCan = useCallback(
    (permission: string) => {
      return data?.permissions.includes(permission);
    },
    [data?.permissions]
  );

  const userCanNot = useCallback(
    (permission: string) => {
      return !userCan(permission);
    },
    [userCan]
  );

  return { userCan, userCanNot };
}
