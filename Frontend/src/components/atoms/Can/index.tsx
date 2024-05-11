import usePermission from "@hooks/usePermission";
import React from "react";

interface CanProps {
  permission: string;
  children: React.ReactNode;
  not?: boolean;
}

const Can: React.FC<CanProps> = ({ permission, children, not = false }) => {
  const { userCan } = usePermission();

  const hasPermission = userCan(permission);

  if ((hasPermission && !not) || (!hasPermission && not)) {
    return <>{children}</>;
  }

  return null;
};

export default Can;
