import {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useLayoutEffect,
} from "react";
import JwtData from "@interfaces/JwtData";
import { jwtDecode } from "jwt-decode";
import api from "@services/api";

interface AuthContextType {
  token: JwtData | null;
  setToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const [token, setToken] = useState<JwtData | null>(null);

  const setTokenValue = useCallback((token: string | null) => {
    if (!token) {
      localStorage.removeItem("token");
      setToken(null);
      api.defaults.headers["Authorization"] = "";
      return;
    }

    const decodedToken = jwtDecode<JwtData>(token);

    localStorage.setItem("token", token);

    api.defaults.headers["Authorization"] = `Bearer ${token}`;

    setToken(decodedToken);
  }, []);

  useLayoutEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setTokenValue(token);
    }
  }, [setTokenValue]);

  const providerValue = useMemo(
    () => ({ token, setToken: setTokenValue }),
    [token, setTokenValue]
  );

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
