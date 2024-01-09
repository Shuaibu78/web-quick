import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import CustomDropdown from "./custom-dropdown";
import dropIcon from "../../assets/dropicon.svg";
export default {
  title: "CustomDropdown",
  component: CustomDropdown,
} as ComponentMeta<typeof CustomDropdown>;

const Template: ComponentStory<typeof CustomDropdown> = (args) => <CustomDropdown {...args} />;

export const CustomDropdownStory = Template.bind({});
const options = ["Opt 1", "Opt 2", "Opt 3"];
CustomDropdownStory.args = {
  width: "12.5rem",
  height: "2.1875rem",
  containerColor: "#FFBE62",
  iconContainerColor: "#FFCE88",
  dropdownIcon: dropIcon,
  fontSize: "1rem",
  selected: 0,
  setValue: (val) => {
    console.log(val);
  },
  options,
  borderRadius: "0.3125rem",
  color: "white",
};
