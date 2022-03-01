import classes from "./ProjectListItem.module.scss";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Project } from "types/project";
import Tag from "styling/components/Tag/Tag";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { useProjectStore } from "stores/projectStore";
import { getRoute } from "routes/utils";
import { RouteName } from "routes/types";
import { useHistory } from "react-router";
import { useWorkspaceStore } from "stores/workspaceStore";

type ProjectListItemProps = {
  project: Project;
  setHoveredProjectId: Dispatch<SetStateAction<string | undefined>>;
  isNew: boolean;
  onClick: (project: Project) => void;
  onDelete: (e, project: Project) => void;
  activeListItem: string;
  updateActiveListItem: (projectId: string) => void;
};

export const ProjectListItem: FC<ProjectListItemProps> = ({
  project,
  setHoveredProjectId,
  isNew,
  onClick,
  onDelete,
  activeListItem,
  updateActiveListItem
}) => {
  const [menuIsOpen, setmenuIsOpen] = useState<boolean>(false);
  const [, projectStoreActions] = useProjectStore();
  const [workspaceStore] = useWorkspaceStore();
  const exploreRoute = getRoute(RouteName.Explore);
  const history = useHistory();

  useEffect(() => {
    if (project.id !== activeListItem) {
      setmenuIsOpen(false);
    }
  }, [activeListItem, project.id]);

  const handleMenuClick = (e) => {
    setmenuIsOpen(!menuIsOpen);
    updateActiveListItem(project.id);
    e.stopPropagation();
  };

  const handleClickAway = (e) => {
    setmenuIsOpen(false);
    e.stopPropagation();
  };

  const handleEditProject = (e) => {
    projectStoreActions.setActiveProject(project.id);
    history.push(
      exploreRoute.getNavPath!({
        selectedWorkSpaceName: workspaceStore.selectedWorkSpace
      })
    );
  };

  return (
    <li
      onClick={() => onClick(project)}
      key={project.id}
      className={classes.listItem}
      onPointerOver={() => setHoveredProjectId(project.id)}
      onPointerOut={() => setHoveredProjectId(undefined)}
    >
      <div className={classes.title}>
        {project.name}
        {isNew && (
          <Tag appearance="pill" type="new" tag="New">
            New
          </Tag>
        )}
      </div>
      <div className={classes.moreMenu} onClick={handleMenuClick}>
        <MoreVertIcon className={`${classes.kebab} ${menuIsOpen ? classes.active : undefined}`} />
        {menuIsOpen && (
          <ClickAwayListener onClickAway={(e) => handleClickAway(e)}>
            <ul className={classes.optionList}>
              <li onClick={handleEditProject}>Edit Site</li>
              <li onClick={(e) => onDelete(e, project)}>Delete</li>
            </ul>
          </ClickAwayListener>
        )}
      </div>
    </li>
  );
};
