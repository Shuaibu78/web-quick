import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { InputField } from "./input";

export default {
  title: "InputField",
  component: InputField,
} as ComponentMeta<typeof InputField>;

const Template: ComponentStory<typeof InputField> = (args) => <InputField {...args} />;

export const smallInputField = Template.bind({});
smallInputField.args = {
  backgroundColor: "#f8f8f8",
  placeholder: "press me",
  color: "white",
  size: "sm",
  borderSize: "1px",
  borderRadius: "0.625rem",
  borderColor: "transparent",
  width: "18.75rem",
  fontSize: "0.625rem",
  type: "number",
};

export const largeInputField = Template.bind({});
largeInputField.args = {
  backgroundColor: "#f8f8f8",
  placeholder: "press me",
  color: "white",
  size: "lg",
  borderSize: "1px",
  borderRadius: "0.625rem",
  borderColor: "gray",
  width: "31.25rem",
  fontSize: "0.625rem",
  type: "password",
};
