import * as React from "react";
import { Button } from "@fluentui/react-components";
import { MoreHorizontalRegular, Sparkle20Filled } from "@fluentui/react-icons";
import PanelToolbar from "../../Hooks/usePanelHooks.tsx";

// Visit https://mochimilk.github.io/cto_coral_docs/index.html#/developers/panels for documentation.

// It is recommended that you create copies of PanelLeft.tsx and/or PanelRight.tsx and move them into dedicated folders under Pages.
// See file structure in src/Pages/DefaultPage and the imports section in DefaultPage.tsx.

const PanelRight: React.FC = () => {
  return (
    <div className="panelRight">
      {/* PanelHeader */}
      <PanelToolbar
        icon={<Sparkle20Filled />}
        header="Copilot"
      >
        <Button
          icon={<MoreHorizontalRegular />}
          appearance="subtle"
        />
      </PanelToolbar>

      {/* Content */}
      <div className="content">
        {/* Replace with Panel Content */}
      </div>
    </div>
  );
};

// No need to change the export, even if copied.
export default PanelRight;
