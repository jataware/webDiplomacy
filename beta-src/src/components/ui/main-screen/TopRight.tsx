import React, { ReactElement } from "react";
import Position from "../../../enums/Position";
import WDPositionContainer from "../WDPositionContainer";
import WDHomeIcon from "../icons/WDHomeIcon";

const TopRight = function (): ReactElement {
  return (
    <WDPositionContainer
      styleOverrides={{marginTop: "56px"}}
      position={Position.TOP_RIGHT}>
      <a href="/">
      </a>
    </WDPositionContainer>
  );
};

export default TopRight;

/* 
 * <WDHomeIcon /> */
