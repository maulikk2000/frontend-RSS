import { Meta } from "@storybook/react";
import { Toggle } from "./Toggle";

export default {
  title: "Toggle",
  component: Toggle,
  argTypes: {
    onChange: { action: "changed" }
  }
} as Meta;

export const On = (args) => <Toggle toggle={true} title={""} {...args} />;

export const Off = (args) => <Toggle toggle={false} title={""} {...args} />;
