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

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import unsplash1 from "../assets/waiting-room-backgrounds/unsplash1.jpg";

import {
  getGameApiRequest
} from "../utils/api";

import { PurpleButton, purpleColor } from ".";

import GameAssignment from "./GameAssignment";
import { OngoingGames } from "./GameList";
import PlayerList from "./PlayerList";
import AllGames from "./AllGames";


const DashboardTab = styled(Tab)`
  border-radius: 1px;
  text-transform: uppercase;
  color: white;

  &:hover {
    backgroundColor: rgba(250,250,250,0.5);
  }
`;

/**
 *
 **/
const TabUnderline = () => (
  <Box sx={{
    position: "absolute",
    bottom: 0,
    zIndex: 2,
    left: 0,
    right: 0,
    top: 0,
    borderBottom: `2px solid ${purpleColor}` }} />
);

/**
 *
 **/
const Navigation = ({selectedTab, setSelectedTab}) => {


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
            onClick={() => setSelectedTab(0)}
            color="secondary"
            sx={{
              borderRadius: 1,
              textTransform: "uppercase",
              position: "relative"
            }}
          >
            {selectedTab === 0 && (
              <TabUnderline />
            )}

            Assign
          </Button>
        </li>
        <li>
          <Button
            onClick={() => setSelectedTab(1)}
            color="secondary"
            sx={{
              borderRadius: 1,
              textTransform: "uppercase"
            }}
          >
            {selectedTab === 1 && (
              <TabUnderline />
            )}
            Games
          </Button>
        </li>
        <li>
          <Button
            onClick={() => setSelectedTab(2)}
            color="secondary"
            sx={{
              borderRadius: 1,
              textTransform: "uppercase"
            }}
          >
            {selectedTab === 2 && (
              <TabUnderline />
            )}
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

  const [selectedTab, setSelectedTab] = React.useState(0);

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
            padding: "1.5rem 2rem",
            backgroundImage: "linear-gradient(to bottom, rgba(70,73,84, 0.5), rgb(32,35,50), rgb(32,35,50), rgb(32,35,50))",
            height: "92%",
            display: "block"
          }}
        >

          <Box className="header-nav-container" sx={{height: "6.7rem"}}>
            <Typography
              variant="h3"
              sx={{maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}
            >
              Tournament Management
            </Typography>

            <Box sx={{
              display: "flex",
              marginTop: 1.5,
            }}>
              <Navigation
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />
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

              {selectedTab === 0 && (
                <>
                  <GameAssignment />
                  <br />
                  <OngoingGames />
                </>
              )}

              {selectedTab === 1 && (
                <AllGames />
              )}

              {selectedTab === 2 && (
                <PlayerList />
              )}

            </Box> {/* main */}

            <br />

            <footer>
              <Typography variant="caption">
                Diplomacy Dashboard.
              </Typography>
            </footer>
          </div>

        </Box> {/* 90% height gradient container */}

      </div> {/* sticky-background */}


      <Dialog
        open={creatingGame}
        onClose={() => { setCreatingGame(false); setInputGameName(""); }}
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
