import * as React from "react";

import {
  getGameApiRequest
} from "../utils/api";

import { fetchAllGameDataforIDs } from "./endpoints";

const gamePropertyMappings = {
  processStatus: "status",
  gameID: "id"
};

import { GameList } from "./GameList";

/**
 *
 **/
const AllGames = (props) => {

  const [crashedGames, setCrashedGames] = React.useState([]);
  const [finishedGames, setFinishedGames] = React.useState([]);

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {

    setLoading(true);

    Promise.all([
    getGameApiRequest("game/crashedgames", {hello: "word"})
      .then(ids => {
        fetchAllGameDataforIDs(ids.data)
          .then(games => {
            setCrashedGames(games);
          });
      }),

    getGameApiRequest("game/finishedgames", {hello: "word"})
      .then(ids => {
        fetchAllGameDataforIDs(ids.data)
          .then(games => {
            setFinishedGames(games);
          });
      })
    ]).finally(() => {
      setLoading(false);
    });

  }, []); // TODO only on mount for now

  return (
    <div>

      <GameList
        loading={loading}
        title="Crashed Games"
        games={crashedGames}
      />

      <br />

      <GameList
        loading={loading}
        title="Finished Games"
        games={finishedGames}
        hideActions
      />

    </div>
  );
}

export default AllGames;

