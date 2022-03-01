import { Meta } from "@storybook/react";
import LayerToggleControls, { Props } from "./LayerToggleControls";

export default {
  title: "Workspace/LayerToggleControls",
  component: LayerToggleControls,
  args: {
    items: [
      {
        id: "secondary-1",
        name: "Secondary Item 1",
        isOn: true,
        group: "secondary"
      },
      {
        id: "secondary-2",
        name: "Secondary Item 2",
        isOn: true,
        group: "secondary"
      },
      {
        id: "primary-1",
        name: "Primary Item 1",
        isOn: false,
        group: "primary"
      },
      {
        id: "primary-2",
        name: "Primary Item 2",
        isOn: false,
        group: "primary",
        order: 1
      }
    ],
    title: "Layers",
    subtitle: "View rich contextual data by toggling data layers and visualise on the map in 2D or 3D."
  }
} as Meta;

export const Default = (args: Props) => <div style={{width:350}}><LayerToggleControls {...args} /></div>;
