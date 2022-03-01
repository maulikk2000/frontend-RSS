import { Meta } from "@storybook/react";
import SideBar, { Props } from "./SideBar";
import withReadme from "storybook-readme/with-readme";

// @ts-ignore
import readme from "./readme.md";

export default {
  title: "SideBar",
  component: SideBar,
  decorators: [withReadme(readme)]
} as Meta;

export const LeftSidebar = (args: Props) => (
  <div style={{ display: "flex", height: "100%" }}>
    <SideBar {...args}>
      <div style={{ padding: 20 }}>Sidebar content here</div>
    </SideBar>
    <div style={{ flex: "auto", padding: 20 }}>Another content here</div>
  </div>
);

export const RightSidebar = (args: Props) => (
  <div style={{ display: "flex", height: "100%" }}>
    <div style={{ flex: "auto", padding: 20 }}>Another content here</div>
    <SideBar position="right">
      <div style={{ padding: 20 }}>Sidebar content here</div>
    </SideBar>
  </div>
);

export const BothSidesSidebar = (args: Props) => (
  <div style={{ display: "flex", height: "100%" }}>
    <SideBar {...args}>
      <div style={{ padding: 20 }}>Left sidebar content here</div>
    </SideBar>
    <div style={{ flex: "auto", padding: 20 }}>Another content here</div>
    <SideBar position="right">
      <div style={{ padding: 20 }}>Right sidebar content here</div>
    </SideBar>
  </div>
);
