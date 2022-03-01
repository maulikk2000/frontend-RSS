import classes from "./BackLink.module.scss";
import { NavLink } from "react-router-dom";
import { ReactComponent as GoBackIcon } from "styling/assets/icons/go_back_icon.svg";
import { FC } from "react";

type Props = {
  to: string;
  onClick?: () => void;
  text: string;
  className?: string;
};

export const BackLink: FC<Props> = ({ to, onClick, text, className }) => {
  const classList = [classes.backButton];

  if (className) {
    classList.push(className);
  }

  return (
    <NavLink to={to} onClick={onClick} className={classList.join(" ")}>
      <GoBackIcon className={classes.icon} /> {text}
    </NavLink>
  );
};
