import * as React from "react";
import { styled } from "@mui/material/styles";
import isEmpty from "lodash/isEmpty";
import random from "lodash/random";
import sortBy from "lodash/sortBy";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import {
  getGameApiRequest
} from "../utils/api";

import { randomColors, grayColor, purpleColor } from ".";
import { fetchWaitingPlayers, fetchWaitingGames, fetchAllGameDataforIDs } from "./endpoints";

/**
 *
 **/
const GamePlayerBox = ({gameId, gameName, players}) => {

  const color = React.useMemo(() => {return randomColors[random(randomColors.length - 1)]}, [gameName]);

  const playersToDisplay = isEmpty(players) ? [{username: "<Empty>", userID: 0}] : players;

  return (
    <Box>
      <Typography
        sx={{
          color: color,
          fontSize: "1rem",
          fontWeight: "bold"
        }}
        gutterBottom
        variant="h6"
      >
        {gameName}
      </Typography>
      <Paper sx={{minWidth: "9rem"}}>
        <List>
          {playersToDisplay.map(player => (
            <ListItem
              key={player.userID}
              sx={{cursor: "default"}}
              button
            >
              {player.username}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

/**
 *
 **/
const GameAssignment = (props) => {

  const [unassignedPlayers, setUnassignedPlayers] = React.useState([]);

  React.useEffect(() => {
    fetchWaitingPlayers()
      .then(response => {
        setUnassignedPlayers(response);
      })
  }, []); // TODO on mount only for now

  const [waitingGames, setWaitingGames] = React.useState([]);

  React.useEffect(() => {
    fetchWaitingGames() // IDs
      .then(waitingGameIDs => {

        fetchAllGameDataforIDs(waitingGameIDs)
          .then(games => {
            setWaitingGames(games);
          });
      })
  }, []); // TODO on mount only for now

  /**
   * Currently assigns players in order.
   **/
  const assignAllPlayers = () => {
    const sortedGames = sortBy(waitingGames, (i) => i.members.length ? -i.members.length : 0);

    let gameIndex = 0;
    let currGame = sortedGames[gameIndex];

    if (!currGame) {
      console.log("No more games to add players to.");
      return;
    }

    let currMemberCount = currGame.members.length;

    unassignedPlayers
      .forEach(player => {

        if (currMemberCount >= 7) {
          gameIndex++;
          currGame = sortedGames[gameIndex];
          currMemberCount = currGame?.members?.length;
        }

        if (!currGame) {
          console.log("No more games to add players to.");
          return;
        }

        getGameApiRequest(
          "game/join",
          {
            gameID: currGame.gameID,
            userID: player.id
          }
        );

        currMemberCount++;
      });

  };


  return (
    <section
    style={{
      padding: "1rem",
        backgroundColor: "rgb(47,50,67)"
      }}
    >
      <Typography
        sx={{color: grayColor, textTransform: "uppercase"}}
        variant="h5">
        Game Assignment
      </Typography>

      <Box sx={{
        display: "flex",
        flexWrap: "wrap"
      }}>

        <Box>
          <Typography
            sx={{
              color: grayColor,
              marginTop: 2,
            }}
            variant="h6"
            gutterBottom
          >
            Waiting Players
          </Typography>

          <Paper
            sx={{
              width: 200,
              height: 250,
              display: "flex",
              flexDirection: "column"
            }}>
            <List
              sx={{
                overflowY: "auto",
                height: 210
              }}
              component="div"
              role="list">
              {unassignedPlayers.map(player => (
                <ListItem
                  key={player.id}
                  role="listitem"
                  button
                  sx={{cursor: "default"}}
                >
                  {player.id} &nbsp; {player.username} ({player.lastScore})
                </ListItem>
              ))}
            </List>
              <Button
                onClick={assignAllPlayers}
                disabled={isEmpty(unassignedPlayers)}
                sx={{
                  width: "100%",
                  fontWeight: "bold",
                  flex: 1,
                  borderRadius: "1px",
                  backgroundColor: purpleColor,
                  color: "white",
                  "&:hover": {
                    backgroundColor: purpleColor,
                    filter: "brightness(1.1)"
                  }
                }}
                variant="contained"
                color="info"
              >
                Assign All
                &nbsp;
                <span
                  style={{fontSize: "0.5rem"}}
                >
                  ({unassignedPlayers.length})
                </span>
              </Button>

          </Paper>
        </Box>

        <ArrowRightIcon sx={{
          color: "#514966",
          alignSelf: "center",
          marginTop: "3rem",
          fontSize: "4rem"
        }} />

        {/* TODO for each new game waiting for players to be filled: */}
        <Box sx={{
          marginTop: 2,
          flex: 1
        }}>
          <Typography
            sx={{color: grayColor}}
            variant="h6"
            gutterBottom
          >
            Open Games
          </Typography>

          <Grid
            container
            spacing={2}
          >
            {waitingGames.map(gameItem => (
              <Grid
                item
                key={gameItem.gameID}
              >
                <GamePlayerBox
                  gameId={gameItem.gameID}
                  gameName={gameItem.name}
                  players={gameItem.members}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

    </section>
  );
}

export default GameAssignment;
