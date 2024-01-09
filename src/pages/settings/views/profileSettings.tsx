import { useState } from "react";
import { Left, Right } from "../../sales/style";
import { BoxHeading, Divider, SettingsBox, SideBarLink } from "../settingsComps.style";
import PersonalInformation from "./settingsComponent/personalInformation";

const ProfileSettings = () => {
  const [navlink, setNavLink] = useState<string>("Personal Information");

  const navItemList = [
    "Personal Information",
    // "Switch User",
    // "Refer a friend"
  ];
  return (
    <>
      <div style={{ display: "flex" }}>
        <Left style={{ display: "flex", rowGap: ".3rem", flexDirection: "column", width: "230px" }}>
          {navItemList.map((list) => (
            <SideBarLink active={list === navlink} onClick={() => setNavLink(list)}>
              {list}
            </SideBarLink>
          ))}
        </Left>
        <Divider />
        <Right style={{ width: "100%" }}>
          {navlink === "Personal Information" && (
            <SettingsBox overflow>
              <PersonalInformation />
            </SettingsBox>
          )}
          {navlink === "Switch User" && (
            <SettingsBox>
              <BoxHeading>Switch User</BoxHeading>
            </SettingsBox>
          )}
          {navlink === "Refer a friend" && (
            <SettingsBox>
              <BoxHeading> Refer a friend</BoxHeading>
            </SettingsBox>
          )}
        </Right>
      </div>
    </>
  );
};

export default ProfileSettings;
