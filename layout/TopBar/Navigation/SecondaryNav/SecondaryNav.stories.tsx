import { Meta } from "@storybook/react";
import { SecondaryNav } from "./SecondaryNav";
import { MemoryRouter } from "react-router";
import { RouteArgs, RouteName } from "routes/types";

export default {
  title: "SecondaryNav",
  component: SecondaryNav,
  decorators: [
    (Story) => (
      // div #root is currently needed because global font style is applied onto body #root.
      // remove this if/when we remove the id selector or move the font style to component level
      <div id="root">
        <MemoryRouter initialEntries={["/workspaces/Envision"]}>
          <Story />
        </MemoryRouter>
      </div>
    )
  ]
} as Meta;

export const Default = (args) => (
  <SecondaryNav
    {...args}
    navItems={[
      {
        name: RouteName.Workspace,
        displayName: "Workspace",
        secondaryDisplayName: "Projects",
        getNavPath: (rargs: RouteArgs) => {
          return `/workspaces/${rargs.selectedWorkSpaceName}`;
        }
      },
      {
        name: RouteName.Explore,
        displayName: "Explore",
        secondaryDisplayName: "Explore Map",
        getNavPath: (rargs: RouteArgs) => {
          return `/workspaces/${rargs.selectedWorkSpaceName}/explore`;
        }
      }
    ]}
    currentRouteArgs={{
      selectedWorkSpaceName: "Envision"
    }}
  />
);
