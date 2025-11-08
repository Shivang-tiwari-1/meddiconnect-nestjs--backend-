export interface ResponseType {
  success: boolean;
  message?: string;
  data?: unknown;
}
export interface GenrateTokenResponse {
  accessToken?: string;
  refreshToken?: string;
  success: boolean;
  message?: string;
}
