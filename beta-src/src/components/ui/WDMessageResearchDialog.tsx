import * as React from "react";
import Button from "@mui/material/Button";
import { Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

function MessageResearchDialog({open, setOpen, dialogContents, saveResponse}) {

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      fullWidth
      aria-describedby="alert-dialog-description"
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: 600,
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">
        Your message has been submitted
      </DialogTitle>
      <DialogContent>
        {dialogContents}
      </DialogContent>
      <DialogActions>
        <Button
          color="info"
          onClick={() => saveResponse("yes")}
        >
          Yes
        </Button>
        <Button
          onClick={() => saveResponse("no")}
        >
          No
        </Button>
        <Button
          onClick={() => saveResponse("unsure")}>
          Unsure
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MessageResearchDialog;
