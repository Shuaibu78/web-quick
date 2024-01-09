import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import TopNav from "./top-nav";

export default {
  title: "TopNav",
  component: TopNav,
} as ComponentMeta<typeof TopNav>;

const Template: ComponentStory<typeof TopNav> = (args) => <TopNav {...args} />;

export const TopNavStory = Template.bind({});
TopNavStory.args = {
  header: "Testing",
};
