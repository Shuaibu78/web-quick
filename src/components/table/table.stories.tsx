import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Table from "./table";
import StoriesData from "./MOCK_DATA.json";
import { COLUMNS } from "./storiesColumn";

export default {
  title: "Table",
  component: Table,
} as ComponentMeta<typeof Table>;

const Template: ComponentStory<typeof Table> = (args) => <Table {...args} />;
export const TableStory = Template.bind({});
TableStory.args = {
  data: StoriesData,
  columns: COLUMNS,
};
