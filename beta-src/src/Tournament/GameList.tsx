import * as React from "react";
import { styled } from "@mui/material/styles";
import isEmpty from "lodash/isEmpty";


import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { grayColor } from ".";
import { fetchAllGameDataforIDs, fetchOngoingGames } from "./endpoints";
import Game from "./Game";

const gamePropertyMappings = {
  processStatus: "status",
  gameID: "id"
};

/**
 * TODO wrapper that calls game type, and this one receives as props
 **/
export const GameList = ({title, games, hideActions=false}) => {

  const isDesktop = useMediaQuery('(min-width:1000px)');

  const desktopOnlyProperties = ["gameID", "gameOver", "phase"];

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
        {title}
      </Typography>

      {!isEmpty(games) ? (
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
          {!hideActions && (
            <li
              style={{textTransform: "uppercase", width: "8rem"}}
            >
              <Typography sx={{
                fontWeight: "bold"
              }}>
                Actions
              </Typography>
            </li>
          )}
        </Box>
        <div
          style={{
            marginTop: 2,
            maxHeight: "15rem",
            overflowY: "auto",
          }}
        >
          {games.map((game, idx) => (
            <Game
              style={{backgroundColor: idx % 2 === 0 ? "#272728ab" : "#282c3b" }}
              key={game.gameID}
              game={game}
              displayProperties={gamePropertiesToDisplay}
              hideActions={hideActions}
            />
          ))}
        </div>
      </Box>
      ) : (
        <Typography variant="body1">
          {`There are no ${title}.`}
        </Typography>
      )}
    </section>
  );
};

export const OngoingGames = (props) => {
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

  return (
    <GameList
      title="Ongoing Games"
      games={ongoingGames}
    />
  );
}
