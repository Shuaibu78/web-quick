import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SearchInput from "./search-input";
export default {
  title: "SearchInput",
  component: SearchInput,
} as ComponentMeta<typeof SearchInput>;

const Template: ComponentStory<typeof SearchInput> = (args) => <SearchInput {...args} />;
export const SearchInputStory = Template.bind({});
SearchInputStory.args = {
  placeholder: "Testing",
  borderRadius: "0.625rem",
  height: "3.125rem",
  width: "18.75rem",
  fontSize: "0.875rem",
  handleSearch: () => {},
};
