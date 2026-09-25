import type { ApiResponse, IAuthTokens, IUser } from "@repo/types";
import { axios } from "@/lib/axios";
import { QUERY_PATH } from "@/shared/constants/query-paths";

export interface RequestOtpPayload {
  phone: string;
  /** Present on login; absent on first-time signup. */
  enrolment_number?: string;
}

export interface VerifyOtpPayload {
  phone: string;
  code: string;
}

export interface RegisterLawyerPayload {
  first_name: string;
  last_name: string;
  phone: string;
  enrolment_number: string;
  email?: string;
}

export const requestOtp = async (data: RequestOtpPayload) => {
  const response = await axios.post<ApiResponse<{ expires_in: number }>>(
    QUERY_PATH.auth.requestOtp,
    data,
  );
  return response.data;
};

export const verifyOtp = async (data: VerifyOtpPayload) => {
  const response = await axios.post<ApiResponse<IAuthTokens & { user: IUser }>>(
    QUERY_PATH.auth.verifyOtp,
    data,
  );
  return response.data;
};

export const registerLawyer = async (data: RegisterLawyerPayload) => {
  const response = await axios.post<ApiResponse<{ expires_in: number }>>(
    QUERY_PATH.auth.register,
    data,
  );
  return response.data;
};

export const getMe = async () => {
  const response = await axios.get<ApiResponse<IUser>>(QUERY_PATH.auth.me);
  return response.data;
};
