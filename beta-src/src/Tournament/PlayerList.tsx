import * as React from "react";
import { styled } from "@mui/material/styles";
import isEmpty from "lodash/isEmpty";
import random from "lodash/random";
import sortBy from "lodash/sortBy";
import identity from "lodash/identity";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Tooltip from '@mui/material/Tooltip';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import EndIcon from "@mui/icons-material/DoDisturbOn";

import CutIcon from '@mui/icons-material/ContentCut';
import BanIcon from '@mui/icons-material/DoNotDisturbAlt';

import { grayColor, redColor } from ".";
import { fetchAllPlayers } from "./endpoints";

import {
  getGameApiRequest
} from "../utils/api";

/**
 *
 **/
const PlayerList = (props) => {

  const [players, setPlayers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const isDesktop = useMediaQuery('(min-width:600px)');

  function fetchData() {
    return fetchAllPlayers().then(responsePlayers => {
      setPlayers(responsePlayers);
    });
  }

  function cutPlayer(id) {
    getGameApiRequest(
      "player/setPlayerState",
      {userID: id, state: "Cut"}
    ).then(() => {
      fetchData();
    })
  }

  function banPlayer(id) {
    getGameApiRequest(
      "player/setPlayerState",
      {userID: id, state: "Banned"}
    ).then(() => {
      fetchData();
    })
  }

  React.useEffect(() => {

    setLoading(true);

    fetchData()
      .then(() => {
          setLoading(false);
      })
  }, []);

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

      {loading ? (
        <span>Loading content...</span>
      ) : (
        <Grid
          container
          spacing={2}
        >
          {players.map(player => (
            <Grid
              key={player.id}
              sx={{
                width: isDesktop ? "14rem" : "100%",
              }}
              item>
              <Card>
                <CardHeader
                  sx={{
                    pb: 1
                  }}
                  avatar={
                    <Avatar
                      sx={{
                        backgroundColor: player.type === "User" ? "rgb(152 138 235)" : redColor
                      }}
                    >
                    </Avatar>
                  }
                  title={player.username}
                  subheader={`ID: ${player.id}`}
                />

                <CardContent sx={{pt: 0, pb: 0}}>
                  <ul>
                    <li>
                      Last Score: {player.lastScore}
                    </li>
                    <li>
                      Games: {player.gameCount || 0}
                    </li>
                    <li>
                      Messages/Annotated: {player.totalMessagesSent || 0} / {player.totalMessagesAnnotated || 0}
                    </li>
                    <li>
                      Status: {player.status || "Active"}
                    </li>
                  </ul>
                </CardContent>

                <CardActions disableSpacing>
                  <IconButton onClick={() => cutPlayer(player.id)} color="warning">
                    <CutIcon />
                  </IconButton>
                  <IconButton onClick={() => banPlayer(player.id)} color="error">
                    <BanIcon />
                  </IconButton>
                </CardActions>

              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <br />

    </section>
  );
}

export default PlayerList;
