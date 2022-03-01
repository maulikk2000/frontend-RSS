import axios from "axios";
import localStorageService from "../localStorage/localStorageService";
import { LocalStorgeKey } from "../localStorage/type";

axios.interceptors.request.use((config) => {
  const idToken = localStorageService.getLocalStorageItem(LocalStorgeKey.id_token.toString());

  const userId = localStorageService.getLocalStorageItem(LocalStorgeKey.user_id.toString());

  const projectId = localStorageService.getLocalStorageItem(LocalStorgeKey.project_id.toString());

  const projectGroups = localStorageService.getLocalStorageItem(LocalStorgeKey.user_groups.toString());

  if (idToken) {
    config.headers["Authorization"] = `Bearer ${idToken}`;
  }

  if (userId) {
    config.headers["eli-username"] = `${userId}`;
  }

  if (projectId) {
    config.headers["projectid"] = `${projectId}`;
  }

  if (userId) {
    config.headers["eli-usergroups"] = `${projectGroups ?? ""}`;
  }

  return config;
});

export default axios;
