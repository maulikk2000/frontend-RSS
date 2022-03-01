export function getApiErrorMessage(error: any, initialMessage: string = "") {
  let errorMessage = initialMessage;

  if (error) {
    if (error.response) {
      const { statusText, data } = error.response;
      console.error("error.response", error.response);

      if (data && typeof data === "object" && data.title) {
        return (errorMessage += " - " + data.title);
      } else if (data && typeof data === "string") {
        return (errorMessage += " - " + data);
      } else if (statusText) {
        return (errorMessage += " - " + statusText);
      }
    }
    if (error.message) {
      errorMessage += " - " + error.message;
    } else {
      errorMessage += " - " + error.toString();
    }
  }
  return errorMessage;
}
