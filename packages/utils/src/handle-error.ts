export function getErrorMessage(error: any): string | undefined {
  const response = error?.response;
  const backendErrors = response?.data?.errors;

  if (Array.isArray(backendErrors) && backendErrors.length > 0) {
    const first = backendErrors[0];
    return typeof first === "string"
      ? first
      : first?.message || "An error occurred";
  }

  const responseData = response?.data;
  if (responseData) {
    if (Array.isArray(responseData.data) && responseData.data[0]?.message) {
      return responseData.data[0].message;
    }
    if (responseData.message) return responseData.message;
    if (responseData.detail) return responseData.detail;
  }

  if (error?.message === "Network Error") {
    return "Please check your network connection";
  }

  return error?.message;
}

export function getErrorCode(error: any) {
  return error?.response?.data?.code || "Network Error";
}
