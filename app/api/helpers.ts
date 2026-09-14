import { isAxiosError } from "axios";

export function logErrorResponse(error: unknown) {
  if (isAxiosError(error)) {
    console.error("API Error Response:", error.response?.data || error.message);
  } else {
    console.error("Unexpected Error:", error);
  }
}
