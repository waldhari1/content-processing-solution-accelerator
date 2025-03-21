import React from "react";
import "../../Styles/App.css";
import { Toolbar, ToolbarButton } from "@fluentui/react-components";
import { Link } from "../../Imports/bundleIcons.tsx";
import { useContentHooks } from "../../Hooks/useContentHooks.tsx";
import ContentToolbar from "../../Hooks/useContentToolbarHooks.tsx";

// Visit https://mochimilk.github.io/cto_coral_docs/index.html#/developers/content for documentation

interface ContentProps {
  isPanelOpen: boolean;
  togglePanel?: () => void; // Optional to conditionally render left toggle
  isRightPanelOpen: boolean;
  toggleRightPanel?: () => void; // Optional to conditionally render left toggle
}

const ContentDevelopers: React.FC<ContentProps> = ({
  isPanelOpen,
  togglePanel,
  isRightPanelOpen,
  toggleRightPanel,
}) => {
  const { commandKey } = useContentHooks({ togglePanel, toggleRightPanel });

  return (
    <div className="contentContainer">
      {/*📌 Below is the setup for the content toolbar.
       ***You may remove this if your app doesn't need a toolbar. */}
      <ContentToolbar
        panelConfig="both" // "left", "right", "both", {null}
        isPanelOpen={isPanelOpen}
        togglePanel={togglePanel}
        isRightPanelOpen={isRightPanelOpen}
        toggleRightPanel={toggleRightPanel}
        commandKey={commandKey}
      >
        <Toolbar></Toolbar>
        <Toolbar>
          <ToolbarButton icon={<Link />}></ToolbarButton>
        </Toolbar>
      </ContentToolbar>



      <div className="content">
        {/* Populate content */}
      </div>
    </div>
  );
};

export default ContentDevelopers;
