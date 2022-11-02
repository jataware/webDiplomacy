import * as React from "react";
import sortBy from "lodash/sortBy";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import EyeIcon from "@mui/icons-material/RemoveRedEye";
import EndIcon from "@mui/icons-material/DoDisturbOn";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { fetchChatMessages } from "../state/game/game-api-slice";
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

  const [confirmEndGameOpen, setConfirmEndGameOpen] = React.useState(false);

  const [endGameName, setEndGameName] = React.useState("");

  const observeGame = () => {
    const gameUrl = `?gameID=${game.gameID}`;
    window.open(gameUrl, '_blank');
  };

  const startEndGame = () => {
    setConfirmEndGameOpen(true);
  };

  const endGame = () => {
    if (endGameName.replaceAll(" ", "") === game.name.replaceAll(" ", "")) {
      setLoadingEndGame(true); // Remove/reset this state once we refetch data on ~intervals
      getGameApiRequest("game/draw", {gameID: game.gameID});
      setConfirmEndGameOpen(false);
      setEndGameName("");
    } else {
      setEndGameName("No match");
      console.log("names didnt match:", endGameName, game.name);
    }
  };

  const downloadMessages = () => {
    getGameApiRequest("game/messages", {gameID: game.gameID}).then(results => {
      console.log('result', results);
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(results)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = game.gameID + ".json";
      link.click();
    });
  };

  const sortedPlayers = sortBy(game.members, player => {
    return player.username;
  });

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
              &nbsp;&nbsp;
                <PurpleButton
                  onClick={downloadMessages}
                  variant="outlined"
                >
                  Chat
                </PurpleButton>
              &nbsp;&nbsp;
              <BaseButton
                onClick={startEndGame}
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
                  onClick={startEndGame}
                  color="warning"
                >
                  <EndIcon />
                </IconButton>
              </>
            )}
            <Dialog
              open={confirmEndGameOpen}
              onClose={() => { setConfirmEndGameOpen(false); setEndGameName(""); }}
              fullWidth
              sx={{
                "& .MuiDialog-paper": {
                  maxWidth: 500,
                  border: "2px solid #000",
                  p: 1
                },
              }}
            >
              <DialogTitle>
                End Game
              </DialogTitle>
              <DialogContent>
                <Typography
                  variant="body1"
                  gutterBottom>
                  Please confirm game name in order to end it.
                </Typography>
                <Box
                  sx={{display: "flex", p: 1, pl: 0, pr: 0}}
                >
                  <TextField
                    sx={{minWidth: "15rem", marginRight: "0.75rem"}}
                    autoFocus
                    placeholder="Enter game name"
                    label="Game Name"
                    variant="outlined"
                    value={endGameName}
                    onChange={e => setEndGameName(e.target.value)}
                  />
                  <PurpleButton
                    onClick={endGame}
                    variant="outlined">
                    End
                  </PurpleButton>
                </Box>
              </DialogContent>
            </Dialog>
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
        {sortedPlayers.map((memberPlayer, idx) => (
          <Typography
            key={memberPlayer.userID}
            variant="body2"
            sx={{
              marginRight: "1rem",
              color: idx % 2 === 0 ? "#7a74db" : "#9f7620",
              fontWeight: "bold",
              "&:after": {
                paddingLeft: "10px",
                "content": "'|'",
                color: "#797878"
              }
            }}
          >
          {memberPlayer.username}({memberPlayer.score})
          </Typography>
      ))}
      </div>

    </Box>
  );
}

export default Game;
