import React from "react";
import { AuthContext } from "@contexts/AuthContext";
import JwtData from "@interfaces/JwtData";

export default function useAuth(): [
  JwtData | null,
  (token: string | null) => void,
] {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return [context.token, context.setToken];
}
