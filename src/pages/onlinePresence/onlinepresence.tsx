import { Outlet } from "react-router-dom";
import TopNav from "../../components/top-nav/top-nav";
import SideBar from "./sidebar.onlinePresence";
import { Box } from "./style.onlinePresence";

function OnlinePresence() {
  return (
    <Box h="100vh">
      <TopNav header="Online Presence" option="Add a new Expense" />
      <div className="container">
        <SideBar />
        <div className="main">
          <Outlet />
        </div>
      </div>
    </Box>
  );
}

export default OnlinePresence;
