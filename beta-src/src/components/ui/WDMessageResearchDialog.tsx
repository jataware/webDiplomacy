import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import clipboardImg from "../../assets/png/clipboard-3.png";

function MessageResearchDialog({open, setOpen, saveResponse, message, toCountry}) {

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
          maxWidth: 650,
          border: "2px solid #000",
          p: 1
        },
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          fontSize: "1.5rem",
          p: "1.25rem 1rem 0rem",
          fontWeight: "bold"
        }}
      >
        Your message has been submitted!
      </DialogTitle>

      <Box sx={{
        m: 1,
      }}>
        <DialogContent sx={{p: 2, pb: 0}}>

          <Box display="flex">
            <img src={clipboardImg} style={{width: "6rem", height: "6rem"}} />

              <Box flex="1">
                <Typography variant="h5" sx={{m: "0.5rem 0", color: "#96d59d", fontWeight: "bold"}}>
                Research Follow-up
              </Typography>

              <Typography variant="h6">
                You just sent this message to {toCountry}:
              </Typography>

              <Typography
                gutterBottom
                component="div"
                variant="body1"
                sx={(theme) => ({
                  maxHeight: "11rem",
                  overflowY: "auto",
                  width: 'fit-content',
                  color: theme.palette.text.secondary,
                  bgcolor: theme.palette.grey[50],
                  border: `1px solid ${theme.palette.grey[300]}`,
                  padding: "0.75rem 1rem",
                  margin: "0.75rem 0 0.75rem",
                  fontSize: '1.25rem'
                })}>
                {message}
              </Typography>
            </Box>
          </Box>

          <br />

          <Typography
            variant="h5"
            sx={{
              color: "#eca197",
              fontWeight: "bold"
            }}
          >
            Research Question
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
          >
            Was this message meant to deceive {toCountry}?
          </Typography>

        </DialogContent>

        <DialogActions sx={{justifyContent: "left"}}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => saveResponse("yes")}
          >
            Yes
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => saveResponse("no")}
          >
            No
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => saveResponse("unsure")}>
            Unsure
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default MessageResearchDialog;
