import React, { useMemo } from "react";
import Position from "../../enums/Position";

interface WDPositionContainerProps {
  children: React.ReactNode;
  position?: Position;
  bottom?: number;
  zIndex?: number;
}

/**
 * This component is used to position a box and its children absolute
 */
const WDPositionContainer: React.FC<WDPositionContainerProps> = function ({
  children,
  position,
  bottom,
  zIndex,
  styleOverrides={} // TODO apply these again once we try out the app, to align floating layout
}): React.ReactElement {
  const placement = useMemo(() => {
    switch (position) {
      case Position.BOTTOM_LEFT:
        return `bottom-${bottom} left-3`;
      case Position.BOTTOM_RIGHT:
        return `bottom-${bottom} right-3`;
      case Position.BOTTOM_MIDDLE:
        return `bottom-${bottom} left-1/2 -translate-x-1/2`;
      case Position.TOP_RIGHT:
        return "right-3 top-3";
      case Position.TOP_LEFT:
      default:
        return "left-3 top-3";
    }
  }, [position, bottom]);

  return <div className={`absolute ${placement} z-${zIndex}`}>{children}</div>;
};

WDPositionContainer.defaultProps = {
  position: Position.TOP_LEFT,
  bottom: 2,
  zIndex: 20,
};

export default WDPositionContainer;

// style={{
//   touchAction: "none",
//   pointerEvents: "none", // this component is for layout alone, it shouldn't mask out clicks behind it
//   ...placement,
// }}
