import React, { ReactElement } from "react";
import Position from "../../../enums/Position";
import WDPositionContainer from "../WDPositionContainer";
import HomeIcon from '@mui/icons-material/HomeSharp';
import IconButton from "@mui/material/IconButton";

const TopRight = function (): ReactElement {
  return (
    <WDPositionContainer
      styleOverrides={{marginTop: "56px"}}
      position={Position.TOP_RIGHT}>
      <IconButton
        component="a"
        href="/beta"
        size="large"
        color="info"
      >
        <HomeIcon color="info" />
      </IconButton>
    </WDPositionContainer>
  );
};

export default TopRight;
