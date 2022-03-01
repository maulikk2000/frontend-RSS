import { FC } from "react";
import { useSelectedProject } from "stores/projectStore";
import classes from "./LandingPage.module.scss";
import { ReactComponent as PodiumLogo } from "./podiumLogo.svg";

type Props = {
  title?: string;
};

export const LandingPage: FC<Props> = ({ title }) => {
  const [selectedProject] = useSelectedProject();
  return (
    <div className={classes.bg}>
      <div className={classes.outer}>
        <div className={classes.inner}>
          <PodiumLogo className={classes.logo} />
          <h1>{title ? title : `Welcome to ${selectedProject ? selectedProject.name : ""}`}</h1>
          <h2>
            Create, compare and evaluate scenarios to gain insights and <br />
            clarity like you’ve never had before.
          </h2>
        </div>
      </div>
    </div>
  );
};
