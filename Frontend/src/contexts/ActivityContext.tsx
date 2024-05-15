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
  handleRefetch: () => void;
}

export const ActivityContext = createContext<ActivityType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
  refetch?: () => void;
}

export function ActivityProvider({
  children,
  refetch,
}: Readonly<AuthProviderProps>) {
  const [activity, setActivity] = useState<IActivity | null>(null);

  const alterActivity = useCallback((activity: IActivity | null) => {
    setActivity(activity);
  }, []);

  const removeActivity = useCallback(() => {
    setActivity(null);
  }, []);

  const handleRefetch = useCallback(() => {
    if (refetch) {
      refetch();
    }
  }, []);

  const providerValue = useMemo(
    () => ({ activity, alterActivity, removeActivity, handleRefetch }),
    [activity, alterActivity, removeActivity, handleRefetch]
  );

  return (
    <ActivityContext.Provider value={providerValue}>
      {children}
    </ActivityContext.Provider>
  );
}

export default ActivityProvider;
