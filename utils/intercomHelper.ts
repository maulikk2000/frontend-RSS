import localStorageService from "localStorage/localStorageService";
import { LocalStorgeKey } from "localStorage/type";

export function getLoggedInUserDetails() {
  return {
    name: localStorageService.getLocalStorageItem(LocalStorgeKey.user_name.toString())!,
    email: localStorageService.getLocalStorageItem(LocalStorgeKey.user_id.toString())!,
    userId: localStorageService.getLocalStorageItem(LocalStorgeKey.auth0_user_id.toString())!
  };
}

export function getIntercomApplicationId() {
  return process.env.REACT_APP_ENVISION_INTERCOM_APP_ID!;
}
