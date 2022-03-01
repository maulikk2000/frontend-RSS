import { Meta } from "@storybook/react";
import { Checkbox } from "./Checkbox";

export default {
  title: "Checkbox",
  component: Checkbox,
  argTypes: {
    onChange: { action: "changed" }
  }
} as Meta;

export const Default = (args) => <Checkbox {...args} label="A checkbox" />;

export const DisabledChecked = (args) => <Checkbox {...args} label="A checkbox" checked disabled />;

export const DisabledNotChecked = (args) => <Checkbox {...args} label="A checkbox" disabled />;
