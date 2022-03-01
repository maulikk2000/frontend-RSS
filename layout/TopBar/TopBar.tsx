import AccountOptions from "./AccountOptions/AccountOptions";
import classes from "./TopBar.module.scss";
import BreadCrumb from "./BreadCrumbs/BreadCrumb";

const TopBar = () => {
  return (
    <div className={classes.TopBar}>
      <BreadCrumb />
      <AccountOptions />
    </div>
  );
};

export default TopBar;
