import IActivity from "@interfaces/Activitiy";
import {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

interface ActivityType {
  activity: IActivity | null;
  alterActivity: (activity: IActivity | null) => void;
  removeActivity: () => void;
}

export const ActivityContext = createContext<ActivityType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export function ActivityProvider({ children }: Readonly<AuthProviderProps>) {
  const [activity, setActivity] = useState<IActivity | null>(null);

  const alterActivity = useCallback((activity: IActivity | null) => {
    setActivity(activity);
  }, []);

  const removeActivity = useCallback(() => {
    setActivity(null);
  }, []);

  const providerValue = useMemo(
    () => ({ activity, alterActivity, removeActivity }),
    [activity, alterActivity, removeActivity]
  );

  return (
    <ActivityContext.Provider value={providerValue}>
      {children}
    </ActivityContext.Provider>
  );
}

export default ActivityProvider;
