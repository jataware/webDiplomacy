import * as React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
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

import "./assets/css/AdminDashboard.css";

/* import { DataGrid } from "@mui/x-data-grid"; */
/* import Tabs from '@mui/material/Tabs';
 * import Tab from '@mui/material/Tab'; */

import unsplash1 from "./assets/waiting-room-backgrounds/unsplash1.jpg";

/* const redColor = "rgb(236,93,98)"; */
const grayColor = "rgb(202,210,245)";
const purpleColor = "rgb(109, 97, 246)";

const users = [
  { id: 1, username: 'lonelyHippo', game: 'World' },
  { id: 2, username: 'degradedLizard', game: 'is Awesome' },
  { id: 3, username: 'happyPterodactyl', game: 'is Amazing' },
];
const games = [
  { id: 1, name: "Hello", turn: 6, status: "Not-processing", phase: "", gameOver: "Yes" },
  { id: 2, name: "DataGridPro", turn: 0, status: "Crashed", phase: "Pre-game", gameOver: null },
  { id: 3, name: "MUI", turn: 0, status: "Processing", phase: "Diplomacy", gameOver: null },
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

const unassignedPlayers = [
  {id: 1, username: 'lolaPlays'},
  {id: 2, username: 'happyPath1'},
  {id: 3, username: 'neoForever'},
  {id: 4, username: 'loremJitsu'},
  {id: 5, username: '007timesThree'},
  {id: 6, username: 'fifthElement'},
  {id: 7, username: 'silverCow'},
  {id: 8, username: 'rapidSilvester'},
];

const randomColors = [
  "rgb(233, 30, 99)",  // pink
  "rgb(3, 169, 244)",  // light blue
  "rgb(156, 39, 176)", // purple
  "rgb(255, 152, 0)",  // orange
  "rgb(205, 220, 57)", // lime
  "rgb(255, 193, 7)",  // amber
  "rgb(244, 67, 54)",  // red
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

  /* const gameProperties = Object.keys(game); */

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
            Available Players
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
          color: "white",
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

const GameList = (props) => {

  const isDesktop = useMediaQuery('(min-width:1000px)');

  const desktopOnlyProperties = ["id", "gameOver", "phase"];

  const gamePropertiesToDisplay = Object
    .keys(games[0])
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

      {/* display: "table",
          width: "100%" */}
      <Box
        component="article"
        sx={{
        }}
      >
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
                  {propertyName}
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
        {games.map(game => (
          <Game
            key={game.id}
            game={game}
            displayProperties={gamePropertiesToDisplay} />
        ))}
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

                <p>Player here</p>

              </section>

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
