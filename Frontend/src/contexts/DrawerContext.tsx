import {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

interface DrawerContextType {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const DrawerContext = createContext<DrawerContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpen = useCallback(() => setIsOpen(true), []);

  const onClose = useCallback(() => setIsOpen(false), []);

  const providerValue = useMemo(
    () => ({ isOpen, onOpen, onClose }),
    [isOpen, onOpen, onClose],
  );

  return (
    <DrawerContext.Provider value={providerValue}>
      {children}
    </DrawerContext.Provider>
  );
}

export default AuthProvider;
