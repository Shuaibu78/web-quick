import { FunctionComponent, useState } from "react";
import {
  Box,
  CircularBadge,
  DarkText,
  Flex,
  LightText,
  TabContainer,
} from "./style.onlinePresence";

interface OrderDetailRowProps {
  label: string;
  value: string;
}

export const OrderDetailRow: FunctionComponent<OrderDetailRowProps> = ({ label, value }) => (
  <Flex>
    <Box w="100%">
      <LightText>{label}</LightText>
    </Box>
    <Box w="100%">
      <DarkText>{value}</DarkText>
    </Box>
  </Flex>
);

export interface TabHeaderProps {
  tabHeaders: {
    name: string;
    notificationCount?: number;
  }[];
  handleChange: (val: number) => void;
  activeTabIndex: number;
}

export interface TabPanelProps {
  tabPanelTitles?: string[];
  tabPanels: FunctionComponent[] | any[];
  activeTabIndex: number;
  props?: Record<string, any>;
}

export const TabHeader: FunctionComponent<TabHeaderProps> = ({
  tabHeaders,
  handleChange,
  activeTabIndex,
}) => {
  if (!tabHeaders.length) {
    return (
      <Box>
        <p>**Provide at least one header**</p>
      </Box>
    );
  }

  return (
    <TabContainer>
      <Box className="tab-pane-container">
        {tabHeaders?.map(({ name, notificationCount }, idx) => {
          const isActive = activeTabIndex === idx;
          return (
            <Box
              key={idx}
              className={`tab-pane ${isActive && "active-tab-pane"}`}
              onClick={() => handleChange(idx)}
            >
              <p>{name}</p>
              {Number(notificationCount) > 0 && (
                <CircularBadge
                  isActive={isActive}
                  bgColor="#607087"
                  activeBgColor="#fff"
                  color="#fff"
                  activeColor="#130F26"
                >
                  {notificationCount}
                </CircularBadge>
              )}
            </Box>
          );
        })}
      </Box>
    </TabContainer>
  );
};

export const TabPanel: FunctionComponent<TabPanelProps> = ({
  tabPanels,
  activeTabIndex,
  props,
}) => {
  if (!tabPanels.length) {
    return (
      <Box>
        <p>No view yet...</p>
      </Box>
    );
  }

  return <TabContainer h="100%">{tabPanels[activeTabIndex]({ ...props })}</TabContainer>;
};

export const TabComponent: FunctionComponent<
  Omit<TabHeaderProps, "activeTabIndex" & "handleChange"> & Omit<TabPanelProps, "activeTabIndex">
> = ({ tabHeaders, tabPanels, tabPanelTitles }) => {
  const [activeTabIndex, setActive] = useState(0);
  const headerProps = {
    activeTabIndex,
    handleChange: (val: number) => setActive(val),
    tabHeaders,
  };
  const panelProps = { activeTabIndex, tabPanelTitles, tabPanels };

  return (
    <Box>
      <TabHeader {...headerProps} />
      <TabPanel {...panelProps} />
    </Box>
  );
};
