import * as React from "react";

import ContentDevelopers from "./DefaultPageContent.tsx";
import PanelLeft from "./DefaultPagePanelLeft.tsx";
import PanelRight from "./DefaultPagePanelRight.tsx";
import { makeStyles } from "@fluentui/react-components";

// AppHooks
import { useAppHooks } from "../../Hooks/useAppHooks.tsx";

const Page: React.FC = () => {
  const { isPanelOpen, panelWidth, togglePanel, handleMouseDownLeft, isRightPanelOpen, rightPanelWidth, toggleRightPanel, handleMouseDownRight } = useAppHooks();

  return (
    <div className="layout" style={{ display: "flex" }}>
      {isPanelOpen && (
        <div className="panelLeft" style={{ flex: "37%", minWidth: "300px" }}>
          <PanelLeft />
         
        </div>
      )}

      <div className="contentContainer" style={{ flex: "31%", minWidth: "280px", background: 'white', border: "2px solid #D6D6D6", borderWidth: "2px 2px 0px 0px" }}>
        <ContentDevelopers
          isPanelOpen={isPanelOpen}
          togglePanel={togglePanel}
          isRightPanelOpen={isRightPanelOpen}
          toggleRightPanel={toggleRightPanel}
        />
      </div>

      {isRightPanelOpen && (
        <div className="panelRight" style={{ flex: "31%", minWidth: "280px", background: 'white', border: "1px solid #D6D6D6", borderWidth: "1px 1px 0px 0px" }}>
          <PanelRight />
        </div>
      )}
    </div>
  );
};

export default Page;
