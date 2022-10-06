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

import { grayColor } from ".";
import { fetchAllGameDataforIDs, fetchOngoingGames } from "./endpoints";
import Game from "./Game";

const gamePropertyMappings = {
  processStatus: "status",
  gameID: "id"
};

/**
 *
 **/
const GameList = (props) => {

  const isDesktop = useMediaQuery('(min-width:1000px)');

  const desktopOnlyProperties = ["gameID", "gameOver", "phase"];

  const [ongoingGames, setOngoingGames] = React.useState([]);

  React.useEffect(() => {
    fetchOngoingGames()
    .then(ongoingGamesIDs => {
      // IDs
      fetchAllGameDataforIDs(ongoingGamesIDs)
      .then(games => {
        setOngoingGames(games);
      });
    });

  }, []);

  const gamePropertiesToDisplay = ["gameID", "name", "turn", "processStatus", "phase", "gameOver"]
    .filter(property => {
      if (!isDesktop && desktopOnlyProperties.includes(property)) {
        return false;
      }
      return true;
    });

  return (
    <section
      style={{
        padding: "1rem",
        backgroundColor: "rgb(47,50,67)",
      }}
    >
      <Typography
        sx={{color: grayColor, textTransform: "uppercase"}}
        variant="h5"
        paragraph>
        Ongoing Games
      </Typography>

      <Box component="article">
        <Box component="ul"
          sx={{
            p: 1,
            display: "flex",
            justifyContent: "start",
            alignItems: "center"
        }}>
          {gamePropertiesToDisplay
            .map(propertyName => (
              <li
                key={propertyName}
                style={{textTransform: "uppercase", width: "8rem"}}>
                <Typography sx={{
                  fontWeight: "bold"
                }}>
                  {gamePropertyMappings[propertyName] || propertyName}
                </Typography>
              </li>
          ))}
          <li
            style={{textTransform: "uppercase", width: "8rem"}}
          >
            <Typography sx={{
              fontWeight: "bold"
            }}>
              Actions
            </Typography>
          </li>
        </Box>
        <div style={{maxHeight: "15rem", overflowY: "auto"}}>
        {ongoingGames.map(game => (
          <Game
            key={game.gameID}
            game={game}
            displayProperties={gamePropertiesToDisplay} />
        ))}
        </div>
      </Box>
    </section>
  );
};

export default GameList;
