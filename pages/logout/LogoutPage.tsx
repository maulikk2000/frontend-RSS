import { FC, useEffect, useState } from "react";
import { useAuth0 } from "../../stores/auth0";
import { LocalStorgeKey } from "localStorage/type";
import localStorageService from "localStorage/localStorageService";

const LogoutPage: FC = () => {
  const { logout } = useAuth0();

  const saveNewProjects = localStorageService.getLocalStorageItem(LocalStorgeKey.new_projects);

  const saveGetStartedStatus = localStorageService.getLocalStorageItem(LocalStorgeKey.show_get_started);

  useEffect(() => {
    const logoutWithRedirect = () => {
      try {
        localStorageService.clearAll();

        if (saveNewProjects) {
          localStorageService.setLocalStorageItem({
            key: LocalStorgeKey.new_projects,
            value: saveNewProjects
          });
        }

        if (saveGetStartedStatus) {
          localStorageService.setLocalStorageItem({
            key: LocalStorgeKey.show_get_started,
            value: saveGetStartedStatus
          });
        }
      } catch (error) {
        console.log(error);
      }
      logout();
    };

    logoutWithRedirect();
  }, [logout]);

  return <></>;
};

export default LogoutPage;
