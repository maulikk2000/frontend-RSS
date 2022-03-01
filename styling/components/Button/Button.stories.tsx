import { Meta } from "@storybook/react";
import { Button } from "./Button";

export default {
  title: "Button",
  component: Button,
  argTypes: {
    onClick: { action: "clicked" }
  }
} as Meta;

export const Primary = (args) => (
  <Button {...args} classType="primary">
    Do something
  </Button>
);

export const Secondary = (args) => (
  <Button {...args} classType="secondary">
    Do something
  </Button>
);

export const Loading = () => (
  <Button classType="primary" isLoading={true} loadingText="Loading text">
    Do something
  </Button>
);
export const Disabled = () => (
  <Button classType="primary" disabled>
    Do something
  </Button>
);
