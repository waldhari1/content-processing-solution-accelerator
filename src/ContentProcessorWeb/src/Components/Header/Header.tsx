import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header, useHeaderHooks } from "../../Hooks/useHeaderHooks.tsx";
import {
  TabList,
  Tab,
  TabValue,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuGroup,
  MenuItem,
  MenuDivider,
  Avatar,
  Button,
} from "@fluentui/react-components";
import {
  Flow,
  WeatherSunny,
  WeatherMoon,
  Person,
  ArrowExit,
  Share,
  Cube,
} from "../../Imports/bundleIcons.tsx";
import MainLogo from "../../Imports/MainLogo.svg";
import "./Header.css";
import { DocumentBulletListCubeRegular, InfoRegular} from "@fluentui/react-icons"

import useAuth from "../../msal-auth/useAuth.ts";

interface HeaderPageProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const tabConfigs = [
  {
    icon: <DocumentBulletListCubeRegular />, // Import bundle icon
    value: "default", // Route path defined in App.tsx
    label: "Content", // Visible label on UI
  },
  // Add more
];

const HeaderPage: React.FC<HeaderPageProps> = ({ toggleTheme, isDarkMode }) => {
  const { shortcutLabel } = useHeaderHooks({ toggleTheme, isDarkMode });
  const { user, logout, getToken } = useAuth();


  const navigate = useNavigate();
  const location = useLocation();
  //const fetchWithAuth = useApiFetch();
  // Map routes to TabValues
  const tabRoutes: { [key: string]: TabValue } = {
    "/home": "home",
    "/default": "default",
    "/auxiliary": "auxiliary",
  };

  // Get the current tab based on the route
  const currentTab =
    Object.keys(tabRoutes).find((route) =>
      location.pathname.startsWith(route)
    ) || "/home"; // Default to "home"

  const handleTabChange = (
    _: React.SyntheticEvent,
    data: { value: TabValue }
  ) => {
    const newRoute = Object.keys(tabRoutes).find(
      (key) => tabRoutes[key] === data.value
    );
    if (newRoute) {
      navigate(newRoute);
    }
  };


  return (
    <Header
      avatarSrc={MainLogo} // Profile icon for businesses
      title="Content Processing" // Site title
      subtitle="Accelerator" // Optional subtitle
      badge="" // Optional badge
    >
      <div className="headerNav">
        <TabList
          selectedValue={tabRoutes[currentTab]}
          onTabSelect={handleTabChange}
          aria-label="Site Navigation Tabs"
          size="small"
        >
          {tabConfigs.map(({ icon, value, label }) => (
            <Tab key={value} icon={icon} value={value}>
              {label}
            </Tab>
          ))}
        </TabList>
      </div>
      <div className="headerTag">
      <InfoRegular style={{ marginRight: "4px" }}/> 
      <span>AI-generated content may be incorrect</span>
      </div>

      {/* Tools Section */}
      <div className="headerTools">
        <Menu hasIcons positioning={{ autoSize: true }}>
          <MenuTrigger disableButtonEnhancement>
            <Avatar
              color="colorful"
              name={user?.name}
              aria-label="App"
              className="clickable-avatar"
            />
          </MenuTrigger>
          <MenuPopover style={{ minWidth: "192px" }}>
            <MenuList>
              <MenuDivider />
              <MenuItem icon={<ArrowExit />} onClick={logout}>Logout</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    </Header>
  );
};

export default HeaderPage;
