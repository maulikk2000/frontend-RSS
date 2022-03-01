import { Meta } from "@storybook/react";
import BreadCrumbs, { Crumb } from "./BreadCrumbs";
import { MemoryRouter } from "react-router";
import classes from "layout/TopBar/TopBar.module.scss";
// @ts-ignore
import readme from "./readme.md";
import withReadme from "storybook-readme/with-readme";

export default {
  title: "BreadCrumbs",
  component: BreadCrumbs,
  decorators: [
    (story) => (
      <MemoryRouter initialEntries={["/workspaces/Envision"]}>
        <div className={classes.TopBar}>{story()}</div>
      </MemoryRouter>
    ),
    withReadme(readme)
  ]
} as Meta;

export const Default = (args: Crumb[]) => (
  <BreadCrumbs
    crumbs={[
      {
        id: "2a769c74-ddc2-4cde-8a5c-38b2fb393adf",
        label: "Workspace",
        path: "/workspaces/East Whisman",
        value: "East Whisman"
      },
      {
        id: "9268a19b-8c22-44ce-9143-7f39e6faf00d",
        label: "Project",
        path: "/workspaces/East Whisman/projects/9268a19b-8c22-44ce-9143-7f39e6faf00d",
        value: "EW 1"
      },
      {
        id: "0f487b37-6f95-4cf3-bb3e-055a78a6700b",
        label: "Scenario",
        value: "Base Scenario"
      }
    ]}
  />
);
