import type { ApiResponse, ICauseListScan } from "@repo/types";
import { axios } from "@/lib/axios";
import { QUERY_PATH, withParams } from "@/shared/constants/query-paths";

export const getScans = async () => {
  const response = await axios.get<ApiResponse<ICauseListScan[]>>(
    QUERY_PATH.causeList.scans,
  );
  return response.data;
};

export const getScan = async (id: string) => {
  const response = await axios.get<ApiResponse<ICauseListScan>>(
    withParams(QUERY_PATH.causeList.scanById, { id }),
  );
  return response.data;
};

/** Multipart upload of a cause-list photo; OCR runs server-side (≤30s). */
export const uploadScan = async (data: {
  courtroom_id: string;
  image: File;
}) => {
  const form = new FormData();
  form.append("courtroom_id", data.courtroom_id);
  form.append("image", data.image);
  const response = await axios.post<ApiResponse<ICauseListScan>>(
    QUERY_PATH.causeList.scans,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};
