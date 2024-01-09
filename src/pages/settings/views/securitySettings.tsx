import { useState } from "react";
import { Left, Right } from "../../staffs/style";
import { BoxHeading, Divider, SettingsBox, SideBarLink } from "../settingsComps.style";
import PasswordSettings from "./settingsComponent/passwordSettings";
import LockSettings from "./settingsComponent/LockSettings";

const SecuritySettings = () => {
  const [navlink, setNavLink] = useState<string>("Password Settings");

  const navItemList = [
    "Password Settings",
    // "Transaction PIN",
    "Create Lock PIN",
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
          {navlink === "Password Settings" && (
            <SettingsBox>
              <PasswordSettings />
            </SettingsBox>
          )}
          {navlink === "Transaction PIN" && (
            <SettingsBox>
              <BoxHeading>Transaction PIN</BoxHeading>
            </SettingsBox>
          )}
          {navlink === "Create Lock PIN" && (
            <SettingsBox>
              <LockSettings />
            </SettingsBox>
          )}
        </Right>
      </div>
    </>
  );
};

export default SecuritySettings;
