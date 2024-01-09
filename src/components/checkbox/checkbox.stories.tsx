import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Checkbox from "./checkbox";

export default {
  title: "Checkbox",
  component: Checkbox,
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => <Checkbox {...args} />;
export const CheckboxStory = Template.bind({});

CheckboxStory.args = {
  isChecked: false,
  onChange: (e: React.FormEvent<HTMLInputElement>) => {
    console.log(e);
  },
  color: "orange",
  size: "1.125rem",
};
