import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

import identity from "lodash/identity";

import DiscordButton from "./DiscordButton";

import { useAppDispatch, useAppSelector } from "../../state/hooks";

import {
  userErrorCode
} from "../../state/game/game-api-slice";

/**
 * To be used to confirm user actions
 **/
export const SnackbarBus = ({
  /* open */
  message="Test Message"
}) => {

  /* const handleClose = identity; // TODO get open state/toggler from app store */

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  }

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={60000}
      onClose={handleClose}
      message={message}
      action={action}
    />
  );
};


const messages = {
  "401": "Your user was not assigned a username correctly. Please contact an administrator through Discord."
};

/**
 * To be used to display global notifications (warnings/errors) to users.
 * Not reusable yet-...
 **/
export const GlobalNotificationsDialog = (props) => {
  const { handleOk, ...other } = props;

  const handleClose = () => {
    setOpen(false);
  }

  const errorCode = useAppSelector(userErrorCode);

  console.log("errorCode", errorCode);

  if (errorCode === "401") {
    console.log("401 User is not authorized.");
  }

  const handleCancel = () => {
    handleClose();
  };

  const message = errorCode ? messages[errorCode] : null;

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '95%', maxHeight: 600, maxWidth: "50rem" } }}
      maxWidth="xs"
      open={Boolean(errorCode)}
      {...other}
    >
      <DialogTitle>An Error Occurred</DialogTitle>

      <DialogContent dividers>
        {message}
      </DialogContent>

      <DialogActions>
        <DiscordButton />
        {handleOk && (
          <Button onClick={handleOk}>
            Ok
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
