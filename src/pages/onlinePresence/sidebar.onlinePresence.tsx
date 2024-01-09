import { NavLink, useLocation } from "react-router-dom";
import { CircularBadge } from "./style.onlinePresence";
import "./temp.style.css";

interface NavPillProps {
  to: string;
  route: string;
  notificationCount?: number;
}

function NavPill({ to, route, notificationCount }: NavPillProps) {
  const { pathname } = useLocation();
  const navLinkStyle = {
    display: "flex",
    justifyContent: "space-between",
    color: "#607087",
    width: "100%",
    textDecoration: "none",
    borderRadius: "0.625rem",
    cursor: "pointer",
    padding: "0.625rem 1.25rem",
    textAlign: "center" as "center",
  };

  const navLinkStyleActive = {
    ...navLinkStyle,
    backgroundColor: "#130F26",
    color: "#fff",
  };

  const isActive = to === pathname;

  return (
    <NavLink style={isActive ? navLinkStyleActive : navLinkStyle} to={`${to}`}>
      {route}
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
    </NavLink>
  );
}

function SideBar() {
  const baseRoute = "/dashboard/online-presence";

  const routes = [
    {
      route: "Orders",
      link: "",
    },
    {
      route: "Available Products",
      link: "/available-products",
    },
    // {
    //   route: "Wallet",
    //   link: "/wallet",
    // },
    // {
    //   route: "Business Settings",
    //   link: "/business-settings",
    // },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-main">
        {routes.map(({ route, link }, idx) => {
          const to = `${baseRoute}${link}`;
          const props = { to, route };

          return <NavPill key={idx} {...props} />;
        })}
      </div>

      {/* <div className="sidebar-extra">
            <p>How to use</p>
            <p>Return policy</p>
            <p>Terms & Condition</p>
        </div> */}
    </div>
  );
}

export default SideBar;
