import { useState } from "react";
import { Left, Right } from "../../sales/style";
import { Divider, SideBarLink } from "../../settings/settingsComps.style";
import { Colors } from "../../../GlobalStyles/theme";
import NewTransfer from "./newTrabsfer";
import PendingTransfer from "./pendingTransfer";
import CompletedTransfer from "./completedTransfer";
import { useProdctPageContext } from "../inventory";
import { Body } from "../../expenses/style";

type ItemTypeAtt = "New Transfer" | "Pending Transfers" | "Completed Transfers";

const Transfer = () => {
  const itemsList: ItemTypeAtt[] = ["New Transfer", "Pending Transfers", "Completed Transfers"];
  const [activeTab, setActiveTab] = useState<ItemTypeAtt>("New Transfer");
  const { navbarHeight } = useProdctPageContext();

  return (
    <>
      <Body navBarHeight={navbarHeight - 20} style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", height: "95%" }}>
          <Left
            style={{
              display: "flex",
              rowGap: ".3rem",
              flexDirection: "column",
              width: "230px",
            }}
          >
            {itemsList.map((list) => (
              <SideBarLink active={list === activeTab} onClick={() => setActiveTab(list)}>
                {list}
              </SideBarLink>
            ))}
            <br />
            <br />
            <br />
            <br />
            <br />
            <div style={{ width: "13.5rem", paddingLeft: "2.5rem" }}>
              <p style={{ color: Colors.secondaryColor }}>Need Help?</p>
            </div>
          </Left>
          <Divider style={{ height: "100%" }} />
          <Right
            style={{
              height: `calc(100vh - ${navbarHeight! + 30}px)`,
              width: "100%",
            }}
          >
            {activeTab === "New Transfer" && <NewTransfer />}
            {activeTab === "Pending Transfers" && <PendingTransfer />}
            {activeTab === "Completed Transfers" && <CompletedTransfer />}
          </Right>
        </div>
      </Body>
    </>
  );
};

export default Transfer;
