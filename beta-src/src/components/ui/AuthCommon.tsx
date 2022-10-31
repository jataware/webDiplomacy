import React from "react";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { useAppSelector } from "../../state/hooks";
import {
  isAdmin,
  username
} from "../../state/game/game-api-slice";

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

export const ApplicationBar = ({signOut, sx, menuItems=[], position="static"}) => {

  const currentUsername = useAppSelector(username);
  const admin = useAppSelector(isAdmin);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let displayableMenuItems = [
    {
      text: currentUsername
    }
  ];
  if (admin) {
    displayableMenuItems.push({text: `Admin: ${true}`})
  }
  displayableMenuItems = displayableMenuItems.concat(menuItems);

  return (
    <AppBar
      position={position}
      sx={{boxShadow: "none", ...sx}}
    >
      <Toolbar sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {displayableMenuItems.map(data => (
              <MenuItem
                key={data.text}
                onClick={() => {
                  handleClose();
                  data.action();
                }}>{data.text}</MenuItem>
            ))}
          </Menu>

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
