import { Meta } from "@storybook/react";
import { WorkspaceMap } from "./WorkspaceMap";

export default {
  title: "Workspace/Map",
  component: WorkspaceMap
} as Meta;

export const Full = () => <WorkspaceMap workspaceId="Envision" />;

export const Preview = () => <WorkspaceMap workspaceId="Envision" isPreview={true} />;
