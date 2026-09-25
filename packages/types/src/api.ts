/** Envelope every backend endpoint responds with. */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  metadata?: IMeta;
  status: string;
  status_code: number;
  timestamp: string;
}

export interface IMeta {
  limit: number;
  page: number;
  count: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  total_count: number;
  current_page: number;
  total_pages: number;
}

export interface IBaseFilter {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface IPaginated<T> {
  items: T[];
  metadata: IMeta;
}
