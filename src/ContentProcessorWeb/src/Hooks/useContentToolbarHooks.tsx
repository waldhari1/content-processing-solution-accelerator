import React from "react";
import "../Styles/App.css";
import { Button, Tooltip, Toolbar, ToolbarDivider } from "@fluentui/react-components";
import {
  PanelLeftContract,
  PanelLeftExpand,
  PanelRightContract,
  PanelRightExpand,
} from "../Imports/bundleIcons.tsx";

interface ContentToolbarProps {
  isPanelOpen: boolean;
  togglePanel?: () => void;
  isRightPanelOpen: boolean;
  toggleRightPanel?: () => void;
  commandKey?: string; // Optional for shortcut hints
  children?: React.ReactNode; // All nested components
  panelConfig?: "left" | "right" | "both"; // Control which panel buttons to show
} 

const ContentToolbar: React.FC<ContentToolbarProps> = ({
  isPanelOpen,
  togglePanel,
  isRightPanelOpen,
  toggleRightPanel,
  commandKey = "Ctrl",
  children,
  panelConfig = "both", // Default is to show both
}) => {
  // Separate the first <Toolbar> and the rest
  const [firstToolbar, ...rest] = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === Toolbar
  );

  // Check if the first Toolbar has valid children
  const firstToolbarHasChildren = React.isValidElement(firstToolbar) && 
    React.Children.toArray(firstToolbar.props.children).length > 0;

  // Check if any of the rest of the Toolbars have valid children
  const restHasChildren = rest.some(
    (child) => React.isValidElement(child) && 
      React.Children.toArray(child.props.children).length > 0
  );

  return (
    <div className="contentToolbar">
      <div className="contentToolbarTitleGroupLeft">
        {/* Show Left Panel Toggle and Divider if panelConfig is 'left' or 'both' */}
        {togglePanel && (panelConfig === "left" || panelConfig === "both") && (
          <>
            <Tooltip content={`${commandKey} + ←`} relationship="label">
              <Button
                icon={isPanelOpen ? <PanelLeftContract /> : <PanelLeftExpand />}
                onClick={togglePanel}
                appearance="subtle"
              />
            </Tooltip>
            {firstToolbarHasChildren && (
              <ToolbarDivider style={{ marginRight: '-8px' }} />
            )}
          </>
        )}
        {firstToolbar}
      </div>

      <div className="contentToolbarTitleGroupRight">
        {rest}
        {/* Show Divider and Right Panel Toggle if panelConfig is 'right' or 'both' */}
        {toggleRightPanel && (panelConfig === "right" || panelConfig === "both") && (
          <>
            {restHasChildren && (
              <ToolbarDivider style={{ marginLeft: '-8px' }} />
            )}
            <Tooltip content={`${commandKey} + →`} relationship="label">
              <Button
                icon={isRightPanelOpen ? <PanelRightContract /> : <PanelRightExpand />}
                onClick={toggleRightPanel}
                appearance="subtle"
              />
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentToolbar;
