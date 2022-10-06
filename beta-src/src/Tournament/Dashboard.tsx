import * as React from "react";
import { styled } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import useMediaQuery from "@mui/material/useMediaQuery";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import "../assets/css/AdminDashboard.css";

/* import Tabs from '@mui/material/Tabs';
 * import Tab from '@mui/material/Tab'; */

import unsplash1 from "../assets/waiting-room-backgrounds/unsplash1.jpg";

import {
  getGameApiRequest
} from "../utils/api";

import { PurpleButton, purpleColor } from ".";

import GameAssignment from "./GameAssignment";
import GameList from "./GameList";
import PlayerList from "./PlayerList";


/**
 *
 **/
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
    setInputGameName("");
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
