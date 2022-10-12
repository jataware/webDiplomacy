import * as React from "react";
import { styled } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import EyeIcon from "@mui/icons-material/RemoveRedEye";
import EndIcon from "@mui/icons-material/DoDisturbOn";

import {
  getGameApiRequest
} from "../utils/api";

import { BaseButton, PurpleButton, purpleColor } from ".";

/**
 *
 **/
const Game = ({game, displayProperties, style, hideActions}) => {

  const isDesktop = useMediaQuery('(min-width:1000px)');

  const [loadingEndGame, setLoadingEndGame] = React.useState(false);

  const observeGame = () => {
    const gameUrl = `?gameID=${game.gameID}`;
    window.open(gameUrl, '_blank');
  };

  const endGame = () => {
    setLoadingEndGame(true);
    getGameApiRequest("game/draw", {gameID: game.gameID});
  };

  const downloadMessages = () => {
    setLoadingEndGame(true);
    http://localhost/
    window.open("/api.php?route=game/messages&gameID=" + game.gameID, "_blank")
  };

  return (
    <Box
      sx={{
        pt: 1,
        marginBottom: 2,
        cursor: "default",
        "&:hover": {
          filter: "brightness(0.9)",
          borderColor: "rgba(190,190,190, 1.2)"
        },
        maxWidth: "100%",
        position: "relative",
        ...style
      }}
    >

      <ul style={{
        padding: "0 8px 8px 8px",
        display: "flex",
        maxWidth: "100%"
      }}>

        {loadingEndGame && (
          <div style={{
            position: "absolute",
            backgroundImage: "linear-gradient(to bottom right, rgba(70,73,84, 0.5), rgb(32,35,50), rgb(32,35,50))",
            zIndex: 3,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }} />
        )}

        {displayProperties
          .map(gameProperty => (
            <li
              key={gameProperty}
              style={{
                listStyle: "none",
                display: "flex",
                width: "8rem",
                alignItems: "center"
              }}>
              <Typography>
                {game[gameProperty]}
              </Typography>
            </li>
        ))}
        {!hideActions && (
          <Box
            component="li"
            sx={(theme) => ({
              listStyle: "none",
              display: "inherit",
              width: isDesktop ? "9rem" : "6rem",
            })}
          >
            {isDesktop ? (
              <>
                <PurpleButton
                  onClick={observeGame}
                  variant="outlined"
                >
                  Observe
                </PurpleButton>
                <PurpleButton
                  onClick={downloadMessages}
                  variant="outlined"
                >
                  Messages
                </PurpleButton>
              &nbsp;&nbsp;
              <BaseButton
                onClick={endGame}
                color="warning"
                variant="outlined"
              >
                End
              </BaseButton>
              </>
            ) : (
              <>
                <IconButton
                  onClick={observeGame}
                  sx={{
                    color: purpleColor
                  }}>
                  <EyeIcon />
                </IconButton>
                <IconButton
                  onClick={endGame}
                  color="warning"
                >
                  <EndIcon />
                </IconButton>
              </>
            )}
          </Box>
        )}
      </ul>


      <div style={{
        display: "flex",
        alignItems: "center",
        height: "2rem",
        paddingLeft: 8,
        paddingRight: 8,
        overflow: "hidden"
      }}>
        {game.members.map(memberPlayer => (
          <Typography
            key={memberPlayer.userID}
            variant="caption"
            style={{marginRight: "1rem", color: "gray"}}
          >
          {memberPlayer.username}
          </Typography>
      ))}
      </div>

    </Box>
  );
}

export default Game;
