import api from "@services/api";
import Response from "@interfaces/Response";

type LoginResponse = Response<{ token: string }>;

export const login = async (data: {
  matriculation: string;
  password: string;
  acronym: string;
}): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
};

export const forgotPassword = async (data: {
  email: string;
  acronym: string;
}): Promise<Response<unknown>> => {
  const response = await api.post<Response<unknown>>(
    "/auth/forgot-password",
    data
  );
  return response.data;
};
