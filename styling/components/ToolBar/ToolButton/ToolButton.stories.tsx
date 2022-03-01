import { Meta } from "@storybook/react";
import ToolButton, { Props } from "./ToolButton";
import { ReactComponent as PolygonIcon } from "styling/assets/icons/sitetools-polygon.svg";

export default {
  title: "ToolButton",
  component: ToolButton,
  argTypes: {
    onClick: { action: "clicked" }
  }
} as Meta;

export const Inactive = (args: Props) => <ToolButton {...args} Icon={PolygonIcon} />;

export const Active = (args: Props) => <ToolButton {...args} Icon={PolygonIcon} isActive />;
