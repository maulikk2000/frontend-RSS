import { Meta } from "@storybook/react";
import ToolBar, { Props } from "./ToolBar";
import { ReactComponent as PolygonIcon } from "styling/assets/icons/sitetools-polygon.svg";
import { ReactComponent as EditIcon } from "styling/assets/icons/sitetools-edit.svg";
import { ReactComponent as DeleteIcon } from "styling/assets/icons/sitetools-delete.svg";

export default {
  title: "ToolBar",
  component: ToolBar
} as Meta;

export const Inactive = (args: Props) => (
  <ToolBar
    {...args}
    tools={[
      {
        Icon: PolygonIcon,
        title: "Draw polygon",
        isActive: false,
        onClick: () => {},
        group: "primary"
      },
      {
        Icon: EditIcon,
        title: "Edit",
        isActive: false,
        onClick: () => {},
        group: "primary"
      },
      {
        Icon: DeleteIcon,
        title: "Delete",
        isActive: false,
        onClick: () => {},
        group: "secondary"
      }
    ]}
  />
);

export const Active = (args: Props) => (
  <ToolBar
    {...args}
    tools={[
      {
        Icon: PolygonIcon,
        title: "Draw polygon",
        isActive: false,
        onClick: () => {},
        group: "primary"
      },
      {
        Icon: EditIcon,
        title: "Edit",
        isActive: true,
        onClick: () => {},
        group: "primary"
      },
      {
        Icon: DeleteIcon,
        title: "Delete",
        isActive: false,
        onClick: () => {},
        group: "secondary"
      }
    ]}
  />
);
