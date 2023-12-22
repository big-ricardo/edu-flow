import api from "@services/api";
import Response from "@interfaces/Response";

type LoginResponse = Response<{ token: string }>;

export const login = async (data: { cpf: string; password: string }) => {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
};
