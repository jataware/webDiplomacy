import * as React from "react";
import { Box, Button, useTheme } from "@mui/material";
import UIState from "../../../enums/UIState";
import Season from "../../../enums/Season";

interface GamePhaseIconProps {
  disabled?: boolean;
  icon: Season | UIState.ACTIVE;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  year: number;
  phaseLabel: string;
}

const WDGamePhaseIcon: React.FC<GamePhaseIconProps> = function ({
  disabled,
  icon,
  onClick,
  year,
  phaseLabel,
}): React.ReactElement {
  const theme = useTheme();
  const dropShadow = theme.palette.svg.filters.dropShadows[0];
  const squareSide = 64;
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      sx={{
        position: "relative",
        fontSize: 12,
        top: -10,
        padding: 0,
        minHeight: squareSide,
        minWidth: squareSide,
        borderRadius: "50%",
      }}
    >
      {icon === UIState.ACTIVE && (
        <svg fill="none" filter={dropShadow} height={50} width={50}>
          <circle cx={25} cy={25} r={22} fill="#000" />
          <path d="m28 17-9 8 9 8" stroke="#fff" strokeWidth={3} />
        </svg>
      )}
      {icon === Season.AUTUMN && (
        <svg fill="none" filter={dropShadow} height={31} width={27}>
          <path
            d="M19.31 21.29c.12-.62 3.78-3.38 6.94-5.83l-1.18-.38a.85.85 0 0 1-.56-1l1.16-4.18-3.18.87a1 1 0 0 1-1.26-.84l-.15-1.27-3.27 3.15a.38.38 0 0 1-.64-.35l1.31-7-1.84 1a.59.59 0 0 1-.81-.25L13.14 0l-2.68 5.21a.6.6 0 0 1-.82.25l-1.84-1 1.31 7a.38.38 0 0 1-.64.35L5.21 8.66 5.06 9.9a1 1 0 0 1-1.27.84L.58 9.87l1.16 4.18a.85.85 0 0 1-.56 1L0 15.43c3.16 2.45 6.82 5.21 6.94 5.83s-1 2.35-1 2.35a38.53 38.53 0 0 1 5.38-1.41c.94 0 1.17.85 1.17 1.7s-.55 6.45-.27 6.65a2.65 2.65 0 0 0 1.78 0c.22-.2-.27-5.8-.27-6.65s.23-1.68 1.17-1.7c1.825.34 3.623.811 5.38 1.41 0 0-1.11-1.59-.97-2.32z"
            fill="#fff"
          />
        </svg>
      )}
      {icon === Season.SPRING && (
        <svg fill="none" filter={dropShadow} height={32} width={25}>
          <g fill="#fff">
            <path d="m18.87.574-3.42 3.281L12.038 0l-3.42 3.855L5.198.574S-2.82 14.489 11.981 17h.103C26.867 14.49 18.87.574 18.87.574zM24.016 19.526c.3-.987-4.167-.329-4.75-.078-1.249.528-3.585 1.731-4.055 4.561s.154 3.376-.077 3.68c-.231.302 2.832.44 3.961.155a5.78 5.78 0 0 0 2.266-1.07 5.859 5.859 0 0 0 1.61-1.934c1.301-2.155.762-4.38 1.045-5.314zM.044 19.526c-.3-.987 4.168-.329 4.75-.078 1.249.528 3.585 1.731 4.055 4.561s-.154 3.376.077 3.68c.231.302-2.832.44-3.961.155a5.781 5.781 0 0 1-2.266-1.07 5.86 5.86 0 0 1-1.61-1.934C-.17 22.685.326 20.46.043 19.526z" />
          </g>
          <path
            d="M12.125 9.187V31"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      )}
      {icon === Season.WINTER && (
        <svg fill="none" filter={dropShadow} height={35} width={31}>
          <path
            clipRule="evenodd"
            d="m29.54 25.188.49.53a.178.178 0 0 1-.047.155.179.179 0 0 1-.153.055l-.7-.16c-1.36-.3-2.666-.81-3.87-1.51l-.19-.1-.1 2a.52.52 0 0 1-.22.39l-.19.13a.3.3 0 0 1-.36 0l-.15-.13a.49.49 0 0 1-.19-.42l.14-2.54-.88-.51-.2 3.56a.53.53 0 0 1-.21.39l-.23.16a.29.29 0 0 1-.36 0l-.21-.18a.52.52 0 0 1-.18-.41l.23-4.17-.84-.49-.17 3.07a.479.479 0 0 1-.21.39l-.23.16a.29.29 0 0 1-.36 0l-.22-.19a.54.54 0 0 1-.17-.4l.1-3.16.18-.47-.94-.54-1 1.77h-2v1.08l.5.08 2.79 1.49a.538.538 0 0 1 .26.35v.28a.3.3 0 0 1-.16.33l-.25.11a.51.51 0 0 1-.45 0l-2.76-1.43v1l3.78 1.91a.5.5 0 0 1 .27.35v.27a.3.3 0 0 1-.16.33l-.25.11a.51.51 0 0 1-.45 0l-3.19-1.62v1l2.3 1.14a.51.51 0 0 1 .28.37v.21a.3.3 0 0 1-.17.31l-.21.1a.521.521 0 0 1-.44 0l-1.76-.89v.21a13.93 13.93 0 0 1-.59 4.11l-.22.68a.18.18 0 0 1-.175.138.18.18 0 0 1-.175-.138l-.21-.68a13.62 13.62 0 0 1-.63-4.11v-.21l-1.72.88a.521.521 0 0 1-.44 0l-.22-.1a.29.29 0 0 1-.16-.31v-.21a.521.521 0 0 1 .27-.37l2.27-1.15v-1l-3.18 1.65a.51.51 0 0 1-.45 0l-.25-.11a.32.32 0 0 1-.17-.33l.06-.27a.5.5 0 0 1 .27-.35l3.72-1.89v-1l-2.8 1.39a.51.51 0 0 1-.45 0l-.25-.11a.32.32 0 0 1-.17-.33l.06-.28a.542.542 0 0 1 .26-.35l2.78-1.49.5-.08v-1.07h-2l-1-1.75-.93.53.21.61.1 3.16a.499.499 0 0 1-.18.39l-.21.19a.29.29 0 0 1-.36 0l-.23-.16a.51.51 0 0 1-.22-.39l-.16-3.06-.84.48.22 4.17a.49.49 0 0 1-.17.41l-.21.19a.29.29 0 0 1-.36 0l-.23-.16a.51.51 0 0 1-.21-.39l-.2-3.57-.88.51.14 2.54a.49.49 0 0 1-.19.42l-.16.13a.29.29 0 0 1-.35 0l-.19-.14a.51.51 0 0 1-.22-.39l-.1-2-.17.08a14 14 0 0 1-3.87 1.51l-.7.15a.18.18 0 0 1-.17-.3l.48-.53a13.777 13.777 0 0 1 3.25-2.59l.18-.11-1.71-1.07a.5.5 0 0 1-.22-.38v-.24a.3.3 0 0 1 .19-.3l.2-.07a.48.48 0 0 1 .45.05l2.08 1.44.89-.51-3-1.95a.5.5 0 0 1-.22-.38v-.28a.29.29 0 0 1 .2-.3l.26-.09a.519.519 0 0 1 .44.05l3.5 2.29.84-.49-2.57-1.68a.51.51 0 0 1-.23-.38v-.27a.3.3 0 0 1 .2-.31l.27-.09a.5.5 0 0 1 .43 0l2.7 1.71.31.4.93-.54-1-1.75 1-1.75-.94-.55-.32.4-2.69 1.66a.5.5 0 0 1-.43 0l-.27-.09a.3.3 0 0 1-.2-.31v-.27a.55.55 0 0 1 .23-.39l2.57-1.67-.84-.49-3.49 2.28a.521.521 0 0 1-.45.06l-.26-.09a.29.29 0 0 1-.2-.3v-.28a.48.48 0 0 1 .23-.38l3-1.95-.88-.51-2.08 1.44a.54.54 0 0 1-.45.05l-.2-.08a.28.28 0 0 1-.18-.3v-.23a.5.5 0 0 1 .23-.38l1.64-1.07-.18-.11a13.571 13.571 0 0 1-3.24-2.6l-.49-.52a.19.19 0 0 1 .17-.31l.7.16a13.73 13.73 0 0 1 3.87 1.51l.18.19.1-2a.51.51 0 0 1 .22-.39l.19-.14a.32.32 0 0 1 .36 0l.15.13a.51.51 0 0 1 .19.43l-.14 2.54.88.51.2-3.57a.53.53 0 0 1 .21-.39l.23-.16a.29.29 0 0 1 .36 0l.21.18a.55.55 0 0 1 .18.41l-.23 4.17.84.49.17-3.07a.45.45 0 0 1 .21-.38l.23-.16a.29.29 0 0 1 .36 0l.22.18a.539.539 0 0 1 .17.4l-.1 3.16-.18.47 1 .49 1-1.74h1.93v-1.11l-.5-.07-2.79-1.5a.52.52 0 0 1-.26-.35v-.28a.28.28 0 0 1 .16-.32l.25-.12a.51.51 0 0 1 .45 0l2.76 1.44v-1l-3.8-1.87a.54.54 0 0 1-.27-.36v-.27a.28.28 0 0 1 .16-.32l.25-.12a.51.51 0 0 1 .45 0l3.21 1.59v-1l-2.32-1.11a.51.51 0 0 1-.28-.37v-.2a.31.31 0 0 1 .17-.32l.21-.09a.49.49 0 0 1 .44 0l1.78.85v-.21c-.009-1.392.19-2.777.59-4.11l.22-.68a.18.18 0 0 1 .35 0l.21.68c.418 1.33.63 2.716.63 4.11v.21l1.76-.85a.49.49 0 0 1 .44 0l.18.07a.3.3 0 0 1 .16.32v.2a.519.519 0 0 1-.27.37l-2.27 1.15v1l3.19-1.62a.51.51 0 0 1 .45 0l.25.12a.3.3 0 0 1 .17.32l-.06.27a.54.54 0 0 1-.28.34l-3.72 1.88v1l2.74-1.42a.51.51 0 0 1 .45 0l.24.14a.3.3 0 0 1 .17.32l-.06.28a.52.52 0 0 1-.26.35l-2.78 1.5-.5.07v1.16h2l1 1.73 1-.55-.19-.55-.1-3.16a.52.52 0 0 1 .18-.4l.21-.19a.29.29 0 0 1 .36 0l.23.16a.51.51 0 0 1 .22.39l.16 3.06.84-.48-.22-4.17a.49.49 0 0 1 .17-.41l.21-.19a.3.3 0 0 1 .36 0l.23.15a.51.51 0 0 1 .21.39l.2 3.57.88-.51-.14-2.54a.49.49 0 0 1 .19-.42l.14-.22a.29.29 0 0 1 .35 0l.19.13a.509.509 0 0 1 .22.39l.1 2 .17-.06a13.43 13.43 0 0 1 3.87-1.51l.7-.16a.18.18 0 0 1 .17.3l-.48.53a14.08 14.08 0 0 1-3.25 2.6l-.18.1 1.76.92a.51.51 0 0 1 .22.39v.23a.3.3 0 0 1-.19.3l-.2.07a.48.48 0 0 1-.45 0l-2.13-1.39-.89.51 3 2a.51.51 0 0 1 .22.39v.27a.3.3 0 0 1-.2.31l-.26.08a.521.521 0 0 1-.44 0l-3.5-2.28-.84.48 2.57 1.68a.53.53 0 0 1 .23.38v.28a.29.29 0 0 1-.2.3l-.27.09a.5.5 0 0 1-.43-.05l-2.63-1.66-.31-.39-1 .55 1 1.76-1 1.73.94.54.32-.39 2.67-1.66a.5.5 0 0 1 .43-.05l.27.09a.29.29 0 0 1 .2.3v.28a.55.55 0 0 1-.23.38l-2.57 1.68.84.48 3.51-2.33a.52.52 0 0 1 .45-.06l.26.09a.3.3 0 0 1 .2.31v.27a.52.52 0 0 1-.23.39l-3 2 .88.51 2.04-1.44a.48.48 0 0 1 .45 0l.2.07a.28.28 0 0 1 .18.3v.23a.48.48 0 0 1-.23.38l-1.64 1.08.27.1c1.207.695 2.3 1.572 3.24 2.6zm-14.62-4.52 2.79-1.61v-3.23l-2.79-1.62-2.8 1.62v3.23zm.1-1.84-1.31-.76v-1.51l1.31-.76 1.31.76v1.51z"
            fill="#fff"
            fillRule="evenodd"
          />
        </svg>
      )}
      <Box
        sx={{
          position: "absolute",
          textAlign: "center",
          width: squareSide,
          left: 0,
          bottom: "-7px",
          color: "#fff",
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
      >
        <span style={{ filter: dropShadow }}>{year}</span>
      </Box>
      <Box
        sx={{
          position: "absolute",
          textAlign: "center",
          width: squareSide,
          left: 0,
          bottom: "-22px",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        <span style={{ filter: dropShadow }}>{phaseLabel}</span>
      </Box>
    </Button>
  );
};

WDGamePhaseIcon.defaultProps = {
  onClick: undefined,
  disabled: false,
};

export default WDGamePhaseIcon;
