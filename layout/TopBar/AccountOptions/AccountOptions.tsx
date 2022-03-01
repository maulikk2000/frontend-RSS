import React from "react";
import { useHistory } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { ReactComponent as UserIcon } from "styling/assets/icons/userIcon.svg";
import classes from "./AccountOptions.module.scss";
import "./AccountOptions.scss";
import { getRoutePath } from "routes/utils";
import { RouteName } from "routes/types";

const AccountOptions: React.FC = () => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const openMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = (): void => {
    setAnchorEl(null);
  };

  const logOut = (): void => {
    history.push(getRoutePath(RouteName.Logout));
  };

  return (
    <div className={classes.statBar} id="accountOptions">
      <div className={classes.userBox} aria-controls="user-menu" aria-haspopup="true" onClick={openMenu}>
        <UserIcon className={classes.user} />
      </div>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        onClose={closeMenu}
      >
        <MenuItem key="logout" onClick={logOut}>
          Log Out
        </MenuItem>
      </Menu>
    </div>
  );
};

export default AccountOptions;
