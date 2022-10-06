import * as React from "react";
import { styled } from "@mui/material/styles";
import isEmpty from "lodash/isEmpty";
import random from "lodash/random";
import sortBy from "lodash/sortBy";

import Avatar from '@mui/material/Avatar';

import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Tooltip from '@mui/material/Tooltip';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import useMediaQuery from "@mui/material/useMediaQuery";
import EyeIcon from "@mui/icons-material/RemoveRedEye";
import EndIcon from "@mui/icons-material/DoDisturbOn";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import {
  getGameApiRequest
} from "../utils/api";

import { BaseButton, PurpleButton, purpleColor } from ".";

/**
 *
 **/
const Game = ({game, displayProperties}) => {

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

  return (
    <Box
      sx={{
        border: "1px solid lightgrey",
        pt: 1,
        marginBottom: 1.5,
        cursor: "default",
        "&:hover": {
          outline: "auto",
        },
        maxWidth: "100%",
        position: "relative",
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
      </ul>


      <div style={{
        backgroundColor: "rgba(38, 38, 38,0.5)",
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
