import { Meta } from "@storybook/react";
import { Confirm, Props } from "./Confirm";

export default {
  title: "Confirm dialog box",
  component: Confirm,
  argTypes: {
    onConfirm: { action: "click" },
    onCancel: { action: "click" }
  }
} as Meta;

export const WithoutMessage = (args: Props) => <Confirm {...args} isDisplayed={true} />;
export const WithMessage = (args: Props) => (
  <Confirm {...args} isDisplayed={true} message="This message is a question to the user, they can confirm or cancel" />
);
