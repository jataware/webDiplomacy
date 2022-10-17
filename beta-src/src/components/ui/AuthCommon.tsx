import React from "react";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';

const LogOutButton = ({onClick}) => {
  return (
    <Button
      onClick={onClick}
      style={{
        fontSize: "15px",
        color: "white",
      }}>Log off</Button>
  );
}

export const ApplicationBar = ({signOut}) => (
  <AppBar position="static" sx={{boxShadow: "none"}}>
    <Toolbar sx={{
      display: 'flex',
      justifyContent: 'space-between',
    }}>
      <Box sx={{display: 'flex'}}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <LogOutButton onClick={signOut} />
    </Toolbar>
  </AppBar>
);
