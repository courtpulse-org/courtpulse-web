import type { ApiResponse, IAuthTokens, IUser } from "@repo/types";
import { axios } from "@/lib/axios";
import { QUERY_PATH, withParams } from "@/shared/constants/query-paths";

export const staffLogin = async (data: { email: string; password: string }) => {
  const response = await axios.post<ApiResponse<IAuthTokens & { user: IUser }>>(
    QUERY_PATH.auth.login,
    data,
  );
  return response.data;
};

export const acceptInvite = async (data: {
  token: string;
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
}) => {
  const { token, ...body } = data;
  const response = await axios.post<ApiResponse<IAuthTokens & { user: IUser }>>(
    withParams(QUERY_PATH.auth.acceptInvite, { token }),
    body,
  );
  return response.data;
};

export const getMe = async () => {
  const response = await axios.get<ApiResponse<IUser>>(QUERY_PATH.auth.me);
  return response.data;
};
