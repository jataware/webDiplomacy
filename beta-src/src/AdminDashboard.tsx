import * as React from "react";
import { styled } from "@mui/material/styles";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import Tooltip from '@mui/material/Tooltip';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import random from "lodash/random";
import AddIcon from '@mui/icons-material/Add';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import useMediaQuery from '@mui/material/useMediaQuery';
import EyeIcon from '@mui/icons-material/RemoveRedEye';
import EndIcon from '@mui/icons-material/DoDisturbOn';

import {
  postGameApiRequest,
  getGameApiRequest
} from "./utils/api";

/* import ApiRoute from "./enums/ApiRoute"; */

import "./assets/css/AdminDashboard.css";

/* import Tabs from '@mui/material/Tabs';
 * import Tab from '@mui/material/Tab'; */

import unsplash1 from "./assets/waiting-room-backgrounds/unsplash1.jpg";

const redColor = "rgb(236,93,98)";
const grayColor = "rgb(202,210,245)";
const purpleColor = "rgb(109, 97, 246)";

const users = [
  { id: 1, username: 'lonelyHippo', game: 'World' },
  { id: 2, username: 'degradedLizard', game: 'is Awesome' },
  { id: 3, username: 'happyPterodactyl', game: 'is Amazing' },
];
const games = [
  { gameID: 1, name: "Hello", turn: 6, processStatus: "Not-processing", phase: "", gameOver: "Yes" },
  { gameID: 2, name: "DataGridPro", turn: 0, processStatus: "Crashed", phase: "Pre-game", gameOver: null },
  { gameID: 3, name: "MUI", turn: 0, processStatus: "Processing", phase: "Diplomacy", gameOver: null },
];

/* const userColumns = [
 *   {field: "username", headerName: "Username"},
 *   {field: "game", headerName: "Game Name"},
 * ]; */

/* const gameColumns = [
 *   {field: "name", headerName: "Name", flex: 1 },
 *   {field: "turn", headerName: "Turn", width: 150},
 *   {field: "status", headerName: "Status", flex: 1},
 *   {field: "phase", headerName: "Phase", width: 150},
 * ]; */

/* const unassignedPlayers = [
 *   {id: 1, username: 'lolaPlays'},
 *   {id: 2, username: 'happyPath1'},
 *   {id: 3, username: 'neoForever'},
 *   {id: 4, username: 'loremJitsu'},
 *   {id: 5, username: '007timesThree'},
 *   {id: 6, username: 'fifthElement'},
 *   {id: 7, username: 'silverCow'},
 *   {id: 8, username: 'rapidSilvester'},
 * ]; */

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

// TODO probably move these fetch definitions to their own files

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
/* function fetchAllGameData(ID) {
 * 
 *   try {
 * 
 *     return Promise
 *       .all([fetchGameOverview(ID), fetchGameMembers(ID)])
 *       .then(([overview, members]) => {
 *         return {
 *           overview, members
 *         };
 *       });
 * 
 *   } catch(e) {
 *     console.log('Request to fetch all game data failed, e:', e);
 *   }
 * 
 * } */

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

  // POST
  /* game/create | gameName
   * game/join  | 'gameID', 'userID' */

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

  React.useEffect(() => {
    fetchAllPlayers()
      .then(responsePlayers => {
        setPlayers(responsePlayers);
      })
  }, []); // TODO only on mount for now

  console.log("players on playerList:", players);

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
        spacing={2}
      >
        {players.map(player => (
          <Grid
            key={player.id}
            item>
            <Card sx={{position: "relative"}}>
              <>
              {player.tempBan && (
                <Tooltip title="This user has a temporary ban.">
                  <EndIcon sx={{position: "absolute", color: "red", top: "0.5rem", right: "0.5rem"}} />
                </Tooltip>
              )}
              <CardHeader
                avatar={
                  <Avatar
                    sx={{ backgroundColor: player.type === "User" ? purpleColor : redColor}}
                  >
                    {player.id}
                  </Avatar>
                }
                title={player.username}
                subheader={`Games played: ${player.gameCount}`}
              />
              </>
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

  return (
    <Box
      sx={{
        border: "1px solid lightgrey",
        p: 1,
        marginBottom: 1,
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "rgba(130,130,130,0.4)"
        },
        maxWidth: "100%"
      }}
    >

      <ul style={{display: "flex", maxWidth: "100%"}}>
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
                variant="outlined"
              >
                Observe
              </PurpleButton>
            &nbsp;&nbsp;
            <BaseButton
              color="warning"
              variant="outlined"
            >
              End
            </BaseButton>
            </>
          ) : (
            <>
              <IconButton sx={{
                color: purpleColor
              }}>
                <EyeIcon />
              </IconButton>
              <IconButton color="warning">
                <EndIcon />
              </IconButton>
            </>
          )}
        </Box>
      </ul>
    </Box>
  );
}

const GamePlayerBox = ({gameName}) => {

  const color = React.useMemo(() => {return randomColors[random(randomColors.length - 1)]}, [gameName]);

  const [players, setPlayers] = React.useState([`Player ${random(90)}`, `Player ${random(90)}`, `Player ${random(90)}`]);

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
          {players.map(playerUsername => (
            <ListItem
              key={playerUsername}
              button
            >
              {playerUsername}
            </ListItem>
          ))}
          <ListItem
            button
          >
            <div style={{
              height: "3rem",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <AddIcon />
            </div>
          </ListItem>
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

  // TODO waitingGames result unused for now
  const [waitingGames, setWaitingGames] = React.useState([]);

  React.useEffect(() => {
    fetchWaitingGames() // IDs
      .then(waitingGameIDs => {

        /* console.log('waiting game IDs', waitingGameIDs); */

        /* fetchAllGameDataforIDs(waitingGameIDs)
         *   .then(games => {
         *     setWaitingGames(games);
         *   }); */

        // TODO for each  waiting game ID, fetch game data:
        /* setUnassignedPlayers(response); */
      })
  }, []); // TODO on mount only for now

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

          <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
            <List
              component="div"
              role="list">
              {unassignedPlayers.map(player => (
                <ListItem
                  key={player.id}
                  role="listitem"
                  button
                >
                  {player.id} &nbsp; {player.username}
                </ListItem>
              ))}
            </List>
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
            {/* TODO loop through games in state */}
            <Grid item>
              <GamePlayerBox
                gameId="1"
                gameName="Testing IT"
              />
            </Grid>

            <Grid item>
              <GamePlayerBox
                gameId="2"
                gameName="Yoga Tournament"
              />
            </Grid>

            <Grid item>
              <GamePlayerBox
                gameId="3"
                gameName="Weekend"
              />
            </Grid>
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

  /* console.log('ongoing games', ongoingGames); */

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

const TournamentDashboard = (props) => {
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

          <Typography
            gutterBottom
            variant="h3"
          >
            Tournament Management
          </Typography>

          <Navigation />

          <br />

          <Button
            sx={{
              borderRadius: 1,
              backgroundColor: purpleColor,
              textTransform: "uppercase"
            }}
            variant="contained"
            color="info"
          >
            Create Game
          </Button>

          <div style={{
            marginTop: "1.5rem",
            height: "80%",
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
                Nullam eu ante vel est convallis dignissim.  Fusce suscipit, wisi nec facilisis facilisis, est dui fermentum leo, quis tempor ligula erat quis odio.  Nunc porta vulputate tellus.  Nunc rutrum turpis sed pede.  Sed bibendum.  Aliquam posuere.  Nunc aliquet, augue nec adipiscing interdum, lacus tellus malesuada massa, quis varius mi purus non odio.  Pellentesque condimentum, magna ut suscipit hendrerit, ipsum augue ornare nulla, non luctus diam neque sit amet urna.  Curabitur vulputate vestibulum lorem.  Fusce sagittis, libero non molestie mollis, magna orci ultrices dolor, at vulputate neque nulla lacinia eros.  Sed id ligula quis est convallis tempor.  Curabitur lacinia pulvinar nibh.  Nam a sapien.
              </Typography>
            </footer>
          </div>

        </Box> {/* 90% height gradient container */}

      </div> {/* sticky-background */}

    </Box>

  );
};

export default TournamentDashboard;

/* <DataGrid
 * autoHeight
 * rows={games}
 * columns={gameColumns} /> */
