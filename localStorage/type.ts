export enum LocalStorgeKey {
  access_token = "access_token",
  refresh_token = "refresh_token",
  user_id = "user_id",
  id_token = "id_token",
  project_id = "project_id",
  user_groups = "user_groups",
  user_name = "user_name",
  auth0_user_id = "auth0_user_id",
  accepted_user_agreement = "accepted_user_agreement",
  show_get_started = "show_get_started",
  new_projects = "new_projects"
}

export interface LocalStorage {
  key: string;
  value: any;
}
