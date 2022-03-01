import { Meta } from "@storybook/react";
import CustomPrompt, { Props } from "./CustomPrompt";
import withReadme from "storybook-readme/with-readme";

// @ts-ignore
import readme from "./readme.md";

export default {
  title: "CustomPrompt",
  component: CustomPrompt,
  decorators: [withReadme(readme)]
} as Meta;

export const Default = () => (
  <div>
    <p>
      Used to prompt the user before navigating away from a page. When your application enters a state that should
      prevent the user from navigating away (like a form is half-filled out), render a `Prompt`.
    </p>{" "}
    <p>See readme</p>
  </div>
);
