import { useEffect } from "react";

interface ContentHooksProps {
  togglePanel?: () => void; // Optional for layouts without left panel
  toggleRightPanel?: () => void; // Optional for layouts without right panel
}

export const useContentHooks = ({
  togglePanel,
  toggleRightPanel,
}: ContentHooksProps) => {
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const commandKey = isMac ? "⌘ + Shift" : "Ctrl + Shift";

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      // Check for Ctrl (or Command on Mac) + Shift + Arrow Keys
      if ((event.ctrlKey || (isMac && event.metaKey)) && event.shiftKey) {
        if (event.key === "ArrowLeft" && togglePanel) {
          // Call togglePanel only if it exists
          event.preventDefault(); // Prevent browser's default action
          togglePanel();
        } else if (event.key === "ArrowRight" && toggleRightPanel) {
          // Call toggleRightPanel only if it exists
          event.preventDefault(); // Prevent browser's default action
          toggleRightPanel();
        }
      }
    };

    window.addEventListener("keydown", handleKeydown, { passive: false }); // Use non-passive listener
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [togglePanel, toggleRightPanel, isMac]);

  return { commandKey };
};
