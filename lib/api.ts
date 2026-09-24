import axios from "axios";
import { ApiError, type QueryParams } from "@/types/api";
export const api = axios.create({
  baseURL: "/api/backend",
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});
api.interceptors.response.use(
  (r) => r,
  (e) => {
    const status = axios.isAxiosError(e) ? (e.response?.status ?? 0) : 0;
    const messages: Record<number, string> = {
      0: "Unable to connect. Check your connection and try again.",
      400: "Please check your input.",
      401: "Your session has expired. Please sign in.",
      403: "You do not have permission for this action.",
      404: "This record could not be found.",
      409: "This record is in use or conflicts with existing data.",
      422: "Please check the form fields.",
      500: "The library service encountered a problem.",
      502: "The library service is currently unavailable.",
    };
    const body = axios.isAxiosError<{ message?: string }>(e)
      ? e.response?.data
      : undefined;
    const message =
      status < 500 && typeof body?.message === "string"
        ? body.message
        : (messages[status] ?? "Unable to complete the request.");
    if (
      status === 401 &&
      typeof window !== "undefined" &&
      !window.location.pathname.includes("login") &&
      !window.location.pathname.includes("register")
    )
      window.dispatchEvent(new Event("session-expired"));
    return Promise.reject(new ApiError(message, status));
  },
);
export const get = <T>(path: string, params?: QueryParams) =>
  api.get<T>(path, { params }).then((r) => r.data);
export const post = <T>(path: string, data?: unknown, params?: QueryParams) =>
  api.post<T>(path, data, { params }).then((r) => r.data);
export const put = <T>(path: string, data: unknown) =>
  api.put<T>(path, data).then((r) => r.data);
export const remove = <T>(path: string) =>
  api.delete<T>(path).then((r) => r.data);
