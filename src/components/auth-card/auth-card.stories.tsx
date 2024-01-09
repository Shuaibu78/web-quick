import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import AuthCard from "./auth-card";

export default {
  title: "AuthCard",
  component: AuthCard,
} as ComponentMeta<typeof AuthCard>;

const Template: ComponentStory<typeof AuthCard> = (args) => <AuthCard {...args} />;
export const AuthCardStory = Template.bind({});

AuthCardStory.args = {
  children: <p>Testing</p>,
  width: "31.25rem",
};
