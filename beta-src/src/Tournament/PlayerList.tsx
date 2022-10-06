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

import { grayColor, purpleColor, redColor } from ".";
import { fetchAllPlayers } from "./endpoints";

/**
 *
 **/
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
        spacing={2}
      >
        {players.map(player => (
          <Grid
            key={player.id}
            sx={{
              width: isDesktop ? "13rem" : "100%",
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
                        backgroundColor: player.type === "User" ? "rgb(152 138 235)" : redColor,
                        fontSize: "1rem"
                      }}
                    >
                      {player.gameCount}
                    </Avatar>
                  }
                  title={player.username}
                  subheader={`ID: ${player.id}`}
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

export default PlayerList;
