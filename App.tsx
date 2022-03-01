import { forwardRef, Ref, useEffect, useImperativeHandle } from "react";
import { useHistory } from "react-router-dom";
import classes from "./App.module.scss";
import Logo from "./layout/TopBar/Logo/Logo";
import { RouteComponent } from "./routes/components/RouteComponent";
import "./styling/default.scss";
import { SnackbarProvider } from "notistack";
import { TopBarRouteComponent } from "routes/components/TopBarRouteComponent";
import { IntercomProvider } from "react-use-intercom";
import { getIntercomApplicationId } from "./utils/intercomHelper";
import { CustomModal } from "styling/components/Modal/CustomModal";
import { useState } from "react";
import { getRoutePath } from "routes/utils";
import { RouteName } from "routes/types";
import { useAuth0 } from "stores/auth0";
import localStorageService from "localStorage/localStorageService";
import { LocalStorgeKey } from "localStorage/type";
import { SecondaryNavRouteComponent } from "routes/components/SecondaryNavRouteComponent";
import PageWrapper from "layout/PageWrapper/PageWrapper";

export interface AppRefObject {
  redirectToPath: (targetUrl: string) => void;
}

const App = forwardRef((props, ref: Ref<AppRefObject>) => {
  useImperativeHandle(ref, () => ({
    redirectToPath(targetUrl: string) {
      history.push(targetUrl);
    }
  }));

  const { isAuthenticated, hasUserGroups } = useAuth0();

  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const shouldShowAgreementModal =
      isAuthenticated &&
      hasUserGroups() &&
      localStorageService.getLocalStorageItem(LocalStorgeKey.accepted_user_agreement) !== "true";
    setIsModalOpen(shouldShowAgreementModal);
  }, [isAuthenticated, hasUserGroups]);

  const acceptAgreement = () => {
    localStorageService.setLocalStorageItem({
      key: LocalStorgeKey.accepted_user_agreement,
      value: "true"
    });
    setIsModalOpen(false);
  };

  const logOut = (): void => {
    history.push(getRoutePath(RouteName.Logout));
  };

  return (
    <IntercomProvider appId={getIntercomApplicationId()} autoBoot>
      <div className={classes.AppWrapper}>
        <header>
          <div className={classes.topbar}>
            <Logo></Logo>
            <TopBarRouteComponent />
          </div>
          <SecondaryNavRouteComponent />
        </header>
        <div className={classes.contentWrapper}>
          <main className={classes.content}>
            <SnackbarProvider
              classes={{
                variantSuccess: classes.snackbarSuccess,
                variantError: classes.snackbarError,
                variantWarning: classes.snackbarWarning,
                variantInfo: classes.snackbarInfo
              }}
              maxSnack={3}
            >
              <PageWrapper>
                <RouteComponent />
              </PageWrapper>
            </SnackbarProvider>
          </main>
        </div>
        <CustomModal
          title="Terms & Conditions of use (NDA)"
          type="partialscreen"
          description="By clicking the “Accept” button below, you acknowledge that you will have access to confidential information in relation to Lendlease’s business, project and/or customers. You also acknowledge that you have previously agreed to confidentiality obligations in your work contract with Lendlease. You further agree to: (i) keep all information contained within and in relation to Envision confidential at all times; (ii) not use or attempt to use any confidential information obtained in connection with Envision for your personal gain or the gain of any other person; (iii) disclose confidential information only to the extent that such disclosure is necessary for the purposes of fulfilling your duties as an employee or contractor of Lendlease; (iv) comply with any reasonable direction by Lendlease in relation to Envision. If you do not agree to the above, you must not access, use or attempt to access or use Envision."
          shouldDisableClose={true}
          isOpen={isModalOpen}
          buttons={[
            { text: "Accept", type: "primary", onClick: acceptAgreement },
            { text: "Log Out", type: "secondary", onClick: logOut }
          ]}
        />
      </div>
    </IntercomProvider>
  );
});

export default App;
