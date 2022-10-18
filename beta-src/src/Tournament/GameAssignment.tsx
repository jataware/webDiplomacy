import * as React from "react";
import { styled } from "@mui/material/styles";
import isEmpty from "lodash/isEmpty";
import random from "lodash/random";
import sortBy from "lodash/sortBy";

import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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

  const sortedPlayers = sortBy(players, player => {
    return player.username;
  });

  const color = React.useMemo(() => {return randomColors[random(randomColors.length - 1)]}, [gameName]);

  const [{isOver}, drop] = useDrop(() => ({
    accept: "PLAYER",
    drop: () => ({ name: gameName, id: gameId }),
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  const playersToDisplay = isEmpty(players) ? [{username: "<Empty>", userID: 0}] : sortedPlayers;

  return (
    <Box
      ref={drop}
      sx={{
        border: `2px solid ${isOver ? "purple" : "none"}`
      }}
    >
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
const DraggableListItem = ({children, onDrop, player, ...props}) => {

  const [{ opacity, isDragging }, dragRef, dragPreview] = useDrag(
    () => ({
      type: "PLAYER",
      item: { id: player.id,
              name: player.username },
      end: (item, monitor) => {
			  const dropResult = monitor.getDropResult();
			  if (item && dropResult) {

				  console.log(`Added player #${item.id} ${item.name} into game #${dropResult.id} ${dropResult.name}!`);

          onDrop(item.id, dropResult.id);
			  }
		  },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
        isDragging: monitor.isDragging()
      })
    }),
    []
  );

  return isDragging ? (
    <div ref={dragPreview} />
  ) : (
    <ListItem
      {...props}
      ref={dragRef}
      role="listitem"
      button
      sx={{cursor: "grab", opacity}}
    >
      {children}
    </ListItem>
  );
};

/**
 *
 **/
const GameAssignment = (props) => {

  const [unassignedPlayers, setUnassignedPlayers] = React.useState([]);

  const [waitingGames, setWaitingGames] = React.useState([]);

  const [loading, setLoading] = React.useState(false);

  const intervalRef = React.useRef();

  function fetchData() {
    fetchWaitingPlayers()
      .then(response => {
        if (response) {
          setUnassignedPlayers(response);
        }
      });

    return fetchWaitingGames() // IDs
      .then(waitingGameIDs => {

        fetchAllGameDataforIDs(waitingGameIDs)
          .then(games => {
            if (games) {
              setWaitingGames(games);
            }
          });
      });
  }

  const handleIndividualPlayerAdd = (playerId, gameId) => {
    getGameApiRequest(
      "game/join",
      {
        gameID: gameId,
        userID: playerId
      }
    ).finally(() => {
      fetchData();
    });
  };

  React.useEffect(() => {

    setLoading(true);

    fetchData()
      .finally(() => {
        setLoading(false);
      });

    intervalRef.current = setInterval(() => {
      fetchData();
    }, 5000);

    return function() {
      clearInterval(intervalRef.current);
    }

  }, []);

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

    fetchData();

  };

  return (
    <DndProvider backend={HTML5Backend}>
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

        {loading && (
          <span>Loading content...</span>
        )}

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
                  <DraggableListItem
                    onDrop={handleIndividualPlayerAdd}
                    player={player}
                    key={player.id}
                  >
                    {player.username} ({player.lastScore})
                  </DraggableListItem>
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
    </DndProvider>
  );
}

export default GameAssignment;
