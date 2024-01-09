import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Button } from "./Button";

export default {
  title: "Counter",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const small = Template.bind({});
small.args = {
  backgroundColor: "green",
  label: "press me",
  color: "white",
  size: "sm",
  borderSize: "1px",
  borderRadius: "0.625rem",
  borderColor: "transparent",
};

export const large = Template.bind({});
large.args = {
  backgroundColor: "red",
  label: "press me",
  color: "white",
  size: "lg",
  borderSize: "1px",
  borderRadius: "0.625rem",
  borderColor: "transparent",
  width: "100%",
  fontSize: "0.625rem",
};
