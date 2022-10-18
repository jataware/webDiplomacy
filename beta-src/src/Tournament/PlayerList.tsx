import * as React from "react";
import { styled } from "@mui/material/styles";
import isEmpty from "lodash/isEmpty";
import random from "lodash/random";
import sortBy from "lodash/sortBy";

import Avatar from '@mui/material/Avatar';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Tooltip from '@mui/material/Tooltip';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import EndIcon from "@mui/icons-material/DoDisturbOn";

import { grayColor, redColor } from ".";
import { fetchAllPlayers } from "./endpoints";

/**
 *
 **/
const PlayerList = (props) => {

  const [players, setPlayers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const isDesktop = useMediaQuery('(min-width:600px)');

  React.useEffect(() => {

    setLoading(true);

    fetchAllPlayers()
      .then(responsePlayers => {
        if (responsePlayers) {
          setPlayers(responsePlayers);
          setLoading(false);
        }
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
                        {player.lastScore}
                      </Avatar>
                    }
                    title={player.username}
                    subheader={
                      (
                        <div>
                          <p>
                            ID: {player.id}
                          </p>
                          <p>
                            Games: {player.gameCount}
                          </p>
                          <p>
                            Messages: {player.totalMessagesSent}
                          </p>
                          <p>
                            Annotated: {player.totalMessagesAnnotated}
                          </p>
                        </div>
                      )
                    }
                  />
                </div>
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
