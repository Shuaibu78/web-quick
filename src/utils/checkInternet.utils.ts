/* eslint-disable no-throw-literal */
const internetCheck = async () => {
  try {
    const response = await fetch("https://staging-api.timart.com.ng/status", { method: "HEAD" });
    if (response.ok) {
      // If the request was successful (status code 200), it means there's internet connection
      return true;
    } else {
      return false; // Internet connection is not available
    }
  } catch (error) {
    return false; // Error occurred, so there's no internet connection
  }
};

export const throwIfNoInternetConnection = async () => {
  if (!(await internetCheck())) {
    throw "Please connect to the internet and try again";
  }
  return true;
};
