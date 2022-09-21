import * as React from "react";

import "./assets/css/App.css";
import WDMain from "./components/ui/WDMain";
import WDLobby from "./components/ui/WDLobby";
import { useAppDispatch } from "./state/hooks";
import { loadGame } from "./state/game/game-api-slice";
import { useAppSelector } from "./state/hooks";
import { playerActiveGames } from "./state/game/game-api-slice";

const App: React.FC = function (): React.ReactElement {
  const urlParams = new URLSearchParams(window.location.search);
  const currentGameID = urlParams.get("gameID");
  const dispatch = useAppDispatch();
  const userCurrentActiveGames = useAppSelector(playerActiveGames);
  console.log("userCurrentActiveGames", userCurrentActiveGames);
  if (userCurrentActiveGames.length === 0) {
    var mainElement = <WDLobby />;
  }
  else
  {
    dispatch(loadGame(String(currentGameID)));
    var mainElement = <WDMain />;
  }
  

  return (
    <div className="App">
    {/* The following line prevents the UI from being scaled down when the viewport is small.
  That leads to a very bad experience for this UI, with part of the map cut off. */}
      <meta name="viewport" content="width=device-width, user-scalable=no" />
      {mainElement}
    </div>
  )
};

export default App;
