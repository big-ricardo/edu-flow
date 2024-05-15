import React from "react";
import { ActivityContext } from "@contexts/ActivityContext";
import IActivity from "@interfaces/Activitiy";

export default function useActivity(): {
  activity: IActivity | null;
  alterActivity: (activity: IActivity | null) => void;
  removeActivity: () => void;
  handleRefetch: () => void;
} {
  const context = React.useContext(ActivityContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return {
    activity: context.activity,
    alterActivity: context.alterActivity,
    removeActivity: context.removeActivity,
    handleRefetch: context.handleRefetch,
  };
}
