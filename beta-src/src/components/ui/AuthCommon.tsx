import React from "react";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

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

export const ApplicationBar = ({signOut, sx, menuItems, position="static"}) => {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position={position}
      sx={{boxShadow: "none", ...sx}}
    >
      <Toolbar sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>

        {menuItems && (
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {menuItems.map(data => (
              <MenuItem
                key={data.text}
                onClick={() => {
                handleClose();
                data.action();
              }}>{data.text}</MenuItem>
            ))}
          </Menu>
        )}

        <Box sx={{display: 'flex'}}>
          <IconButton
            onClick={handleClick}
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
}
