import { Meta } from "@storybook/react";
import { TreeView } from "./TreeView";

export default {
  title: "Tree",
  component: TreeView,
  args: {
    treeData: [
      {
        title: `Plot 1`,
        key: `Plot1`,
        children: [
          {
            title: "Podium 1",
            key: "Pl1Podium1",
            children: [
              { title: "Tower 1", key: "Pl1Po1Tower1" },
              { title: "Tower 2", key: "Pl1Po1Tower2" }
            ]
          },
          {
            title: "Podium 2",
            key: "Pl1Podium2",
            children: [
              { title: "Tower 1", key: "Pl1Po2Tower1" },
              { title: "Tower 2", key: "Pl1Po2Tower2" },
              { title: "Tower 3", key: "Pl1Po2Tower3" },
              { title: "Tower 4", key: "Pl1Po2Tower4" }
            ]
          }
        ]
      },
      {
        title: `Plot 2`,
        key: `Plot2`,
        children: [
          {
            title: "Podium 1",
            key: "Pl2Podium1",
            children: [
              { title: "Tower 1", key: "Pl2Po1Tower1" },
              { title: "Tower 2", key: "Pl2Po1Tower2" },
              { title: "Tower 3", key: "Pl2Po1Tower3" }
            ]
          },
          {
            title: "Podium 2",
            key: "Pl2Podium2",
            children: [{ title: "Tower 1", key: "Pl2Po2Tower1" }]
          }
        ]
      },
      { title: "Basement", key: "Basement" }
    ]
  },
  argTypes: {
    onDrop: { action: "dropped" }
  }
} as Meta;

export const Default = (args) => <TreeView {...args} />;
export const DefinedExpandedKeys = (args) => (
  <TreeView {...args} expandedKeys={["Plot1", "Pl1Podium1", "Pl1Podium2"]} />
);
export const NonDraggable = (args) => <TreeView {...args} isDraggable={false} />;
