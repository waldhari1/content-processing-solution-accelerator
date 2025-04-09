import * as React from "react";
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Button,
  useId,
} from "@fluentui/react-components";

interface FooterButton {
  text: string;
  appearance: "primary" | "secondary";
  onClick: () => void;
}

interface ConfirmationProps {
  title: string;
  content: string;
  isDialogOpen: boolean; // Controlled state for dialog visibility
  onDialogClose: () => void; // Function to close the dialog
  footerButtons: FooterButton[]; // Array of footer buttons
}

export const Confirmation: React.FC<ConfirmationProps> = ({
  title,
  content,
  isDialogOpen,
  onDialogClose,
  footerButtons,
}) => {
  const dialogId = useId("dialog-");

  return (
    <Dialog open={isDialogOpen} onOpenChange={onDialogClose}>
      <DialogSurface
        aria-labelledby={`${dialogId}-title`}
        aria-describedby={`${dialogId}-content`}
      >
        <DialogBody>
          <DialogTitle id={`${dialogId}-title`}>{title}</DialogTitle>
          <DialogContent id={`${dialogId}-content`}>{content}</DialogContent>
          <DialogActions>
            {/* Render the footer buttons dynamically */}
            {footerButtons.map((button, index) => (
              <Button
                key={index}
                appearance={button.appearance}
                onClick={() => {
                  button.onClick();
                  onDialogClose(); // Close the dialog after an action
                }}
              >
                {button.text}
              </Button>
            ))}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
