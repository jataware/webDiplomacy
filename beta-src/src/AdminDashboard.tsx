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
} from "./utils/api";

import "./assets/css/AdminDashboard.css";

/* import Tabs from '@mui/material/Tabs';
 * import Tab from '@mui/material/Tab'; */

import unsplash1 from "./assets/waiting-room-backgrounds/unsplash1.jpg";

const redColor = "rgb(236,93,98)";
const grayColor = "rgb(202,210,245)";
const purpleColor = "rgb(109, 97, 246)";

const randomColors = [
  "rgb(233, 30, 99)",  // pink
  "rgb(3, 169, 244)",  // light blue
  "rgb(156, 39, 176)", // purple
  "rgb(255, 152, 0)",  // orange
  "rgb(205, 220, 57)", // lime
  "rgb(255, 193, 7)",  // amber
  "rgb(244, 67, 54)",  // red
  "rgb(0, 188, 212)",  // cyan
  "rgb(63, 81, 181)",  // indigo
];

const BaseButton = styled(Button)(() => `
  border-radius: 4px;
  text-transform: uppercase;
`);

const PurpleButton = styled(BaseButton)(() => `
  border-color: ${purpleColor};
  color: ${purpleColor};

  &:hover {
    filter: brightness(130%);
    border-color: ${purpleColor};
  }
`);

/**
 * TODO maybe use?
 **/
function endpointFactory(path, paramKey) {
  return async function(paramValue) {
    try {
      const response = await getGameApiRequest(
        path,
        paramKey ? {[paramKey]: paramValue} : {hello: "world"}
      );

      return response.data;

    } catch(e) {
      console.log(`Request to fetch ${path} failed, e:`, e);
    }
  }
}

// TODO Move these fetch definitions to their own files

async function fetchAllPlayers() {
  try {
    const players = await getGameApiRequest(
      "players/all",
      {hello: "world"}
    );

    return players.data;

  } catch(e) {
    console.log('Request to fetch players failed, e:', e);
  }
}

/**
 *
 **/
async function fetchOngoingGames() {
  try {
    const ongoingGames = await getGameApiRequest(
      "game/ongoingGames",
      {hello: "world"}
    );

    return ongoingGames.data; // Array with IDs for all ongoing games

  } catch(e) {
    console.log('Request to fetch ongoinggames failed, e:', e);
  }
}

/**
 *
 **/
async function fetchWaitingGames() {
  try {
    const waitingGames = await getGameApiRequest(
      "game/waitingGames",
      {hello: "world"}
    );

    return waitingGames.data; // Array with IDs for all ongoing games

  } catch(e) {
    console.log('Request to fetch ongoinggames failed, e:', e);
  }
}

/**
 *
 **/
async function fetchGameOverview(ID) {

  try {
    const overview = await getGameApiRequest(
      "game/overview",
      {gameID: ID}
    );

    return overview.data.data; // Array with IDs for all ongoing games

  } catch(e) {
    console.log('Request to fetch ongoinggames failed, e:', e);
  }

}

/**
 *
 **/
async function fetchGameMembers(ID) {
  try {
    const response = await getGameApiRequest(
      "game/members",
      {gameID: ID}
    );

    return response.data.data.members; // Array with IDs for all ongoing games

  } catch(e) {
    console.log('Request to fetch ongoinggames failed, e:', e);
  }
}

/**
 *
 **/
async function fetchAllGameDataforIDs(IDs) {
  try {

    const result = await Promise
      .all(IDs.map(fetchGameOverview));

    return result;

  } catch(e) {
    console.log('Request to fetch all game data by IDs failed, e:', e);
  }

}

async function fetchWaitingPlayers() {
  try {
    const players = await getGameApiRequest(
      "players/waiting",
      {hello: "world"}
    );

    return players.data;

  } catch(e) {
    console.log('Request to fetch players failed, e:', e);
  }
}

const PlayerList = (props) => {

  const [players, setPlayers] = React.useState([]);

  const isDesktop = useMediaQuery('(min-width:600px)');

  React.useEffect(() => {
    fetchAllPlayers()
      .then(responsePlayers => {
        setPlayers(responsePlayers);
      })
  }, []); // TODO only on mount for now

  return (
    <section
      style={{
        padding: "1rem",
        backgroundColor: "rgb(47,50,67)"
      }}
    >

      <Typography
        sx={{color: grayColor, textTransform: "uppercase"}}
        variant="h5"
        paragraph>
        All Players
      </Typography>

      <Grid
        container
        spacing={1}
      >
        {players.map(player => (
          <Grid
            key={player.id}
            sx={{
              width: isDesktop ? "auto" : "100%"
            }}
            item>
            <Card>
              <div>
              {player.tempBan && (
                <Tooltip title="This user has a temporary ban.">
                  <EndIcon sx={{position: "absolute", color: "red", top: "0.5rem", right: "0.5rem"}} />
                </Tooltip>
              )}
              <CardHeader
                avatar={
                  <Avatar
                    sx={{
                      backgroundColor: player.type === "User" ? purpleColor : redColor,
                    }}
                  >
                    {player.id}
                  </Avatar>
                }
                title={player.username}
                subheader={`Games: ${player.gameCount}`}
              />
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>

      <br />

    </section>
  );
}

const Navigation = (props) => {
  return (
    <nav>
      <Box
        component="ul"
        sx={{
          display: "flex", flexDirection: "row",
          "& > li": {
            paddingRight: 1.5,
          }
        }}>
        <li>
          <Button
            color="secondary"
            sx={{
              borderRadius: 1,
              textTransform: "uppercase"
            }}
          >
            Assign
          </Button>
        </li>
        <li>
          <Button
            color="secondary"
            sx={{
              borderRadius: 1,
              textTransform: "uppercase"
            }}
          >
            Games
          </Button>
        </li>
        <li>
          <Button
            color="secondary"
            sx={{
              borderRadius: 1,
              textTransform: "uppercase"
            }}
          >
            Players
          </Button>
        </li>
      </Box>
    </nav>
  );
}

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
        paddingRight: 8
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
              marginTop: 2
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
                  {player.id} &nbsp; {player.username}
                </ListItem>
              ))}
            </List>
              <Button
                onClick={assignAllPlayers}
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

const gamePropertyMappings = {
  processStatus: "status",
  gameID: "id"
};

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


/**
 *
 **/
const TournamentDashboard = (props) => {

  const isDesktop = useMediaQuery('(min-width:600px)');

  const [creatingGame, setCreatingGame] = React.useState(false);
  const startCreateGame = () => {setCreatingGame(true)};

  const [inputGameName, setInputGameName] = React.useState("");

  const handleCreateGame = () => {
    getGameApiRequest("game/create", {gameName: inputGameName, variantID: 1}); // 1 for classic; 15 for  1v1
    setCreatingGame(false);
  }

  return (
    <Box sx={{display: "flex", flexDirection: "column", color: "white"}}>

      <div
        className="sticky-background"
        style={{
          backgroundImage: `url(${unsplash1})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          width: "100vw",
          height: "100vh",
          position: "fixed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >

        <Box
          sx={{
            width: "90%",
            padding: "2rem",
            backgroundImage: "linear-gradient(to bottom, rgba(70,73,84, 0.5), rgb(32,35,50), rgb(32,35,50), rgb(32,35,50))",
            height: "92%",
            display: "block"
          }}
        >

          <Box className="header-nav-container" sx={{height: "7.5rem"}}>
            <Typography
              variant="h3"
              sx={{maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}
            >
              Tournament Management
            </Typography>

            <Box sx={{
              display: "flex",
              marginTop: 2.25
            }}>
              <Navigation />

              <Button
                onClick={startCreateGame}
                sx={{
                  borderRadius: 1,
                  backgroundColor: purpleColor,
                  textTransform: "uppercase",
                  "&:hover": {
                    backgroundColor: purpleColor,
                    filter: "brightness(1.1)"
                  }
                }}
                variant="contained"
                color="info"
              >
                {isDesktop ? (
                  <span>
                    Create Game
                  </span>
                ) : (
                  <AddIcon sx={{fontSize: "1.2rem", p: "none"}} />
                )}
              </Button>
            </Box>
          </Box>

          <div style={{
            height: "calc(100% - 8rem)",
            overflowY: "auto"
          }}>

            {/* TODO maybe flex/grid for better use of space */}
            <Box
              component="main"
            >

              <GameAssignment />

              <br />

              <GameList />

              <br />

              <PlayerList />

            </Box> {/* main */}

            <br />

            <footer>
              <Typography variant="caption">
                Hello World.
              </Typography>
            </footer>
          </div>

        </Box> {/* 90% height gradient container */}

      </div> {/* sticky-background */}


      <Dialog
        open={creatingGame}
        onClose={() => { setCreatingGame(false); }}
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            maxWidth: 450,
            border: "2px solid #000",
            p: 1
          },
        }}
      >
        <DialogTitle>
          Create Game
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{display: "flex", p: 1, pl: 0, pr: 0}}
          >
            <TextField
              sx={{minWidth: "15rem", marginRight: "0.75rem"}}
              autoFocus
              label="Game Name"
              variant="outlined"
              value={inputGameName}
              onChange={e => setInputGameName(e.target.value)}
            />
            <PurpleButton
              onClick={handleCreateGame}
              variant="outlined">
              Create
            </PurpleButton>
          </Box>
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default TournamentDashboard;
