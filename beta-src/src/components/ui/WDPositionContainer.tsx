import * as React from "react";
import Box from "@mui/material/Box";
import { useMemo } from "react";
import Position from "../../enums/Position";

interface WDPositionContainerProps {
  children: React.ReactNode;
  position?: Position;
}

const MOBILE_DISTANCE = 16;
const TABLET_UP_DISTANCE = 24;
const Z_INDEX = 2;

const responsiveDistance = {
  mobile: MOBILE_DISTANCE,
  tablet: TABLET_UP_DISTANCE,
  desktop: TABLET_UP_DISTANCE,
} as const;

/**
 * This component is used to position a box and its children absolute
 */
const WDPositionContainer: React.FC<WDPositionContainerProps> = function ({
  children,
  position,
  styleOverrides={}
}): React.ReactElement {
  const placement = useMemo(() => {
    switch (position) {
      case Position.BOTTOM_LEFT:
        return { bottom: responsiveDistance, left: responsiveDistance };
      case Position.BOTTOM_RIGHT:
        return { bottom: responsiveDistance, right: responsiveDistance };
      case Position.TOP_RIGHT:
        return { right: responsiveDistance, top: responsiveDistance };
      case Position.TOP_LEFT:
      default:
        return { left: responsiveDistance, top: responsiveDistance };
    }
  }, [position]);

  return (
    <Box
      sx={{
        touchAction: "none",
        position: "absolute",
        zIndex: Z_INDEX,
        pointerEvents: "none", // this component is for layout alone, it shouldn't mask out clicks behind it
        ...placement,
        ...styleOverrides
      }}
    >
      {children}
    </Box>
  );
};

WDPositionContainer.defaultProps = {
  position: Position.TOP_LEFT,
};

export default WDPositionContainer;
