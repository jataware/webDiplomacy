import * as React from "react";

import "./assets/css/App.css";
import WDMain from "./components/ui/WDMain";
import WDLobby from "./components/ui/WDLobby";
import { fetchPlayerIsAdmin, loadGame, isAdmin} from "./state/game/game-api-slice";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { fetchPlayerActiveGames, playerActiveGames } from "./state/game/game-api-slice";
import TournamentDashboard from './Tournament/Dashboard';

const App: React.FC = function (): React.ReactElement {

  const urlParams = new URLSearchParams(window.location.search);
  const currentGameID = urlParams.get("gameID");
  const dispatch = useAppDispatch();
  console.log('currentGameID', currentGameID);
  const adminDashboard = urlParams.get("admin");

  const [fetchedGames, setFetchedGames] = React.useState(false);
  const [fetchedAdmin, setIsAdmin] = React.useState(false);

  if (!fetchedGames) {
    console.log('App fetching games.');
    dispatch(fetchPlayerActiveGames());
    // TODO continue fetching games ocassionally on interval until we are assigned one
    setFetchedGames(true);
  }

  if (!fetchedAdmin) {
    console.log('called fetchPlayerIsAdmin');
    dispatch(fetchPlayerIsAdmin());
    setIsAdmin(true);
  }

  const userCurrentActiveGames = useAppSelector(playerActiveGames);
  const Admin = useAppSelector(isAdmin);
  if (Admin)
  {
    if (adminDashboard) {
      return (
        <div>
          {/* The following line prevents the UI from being scaled down when the viewport is small.
              That leads to a very bad experience for this UI, with part of the map cut off. */}
          <meta name="viewport" content="width=device-width, user-scalable=no" />
          <TournamentDashboard />
        </div>
      )
    }
  }

  console.log("userCurrentActiveGames", userCurrentActiveGames);
  console.log("isAdmin", Admin);

  const shouldRedirectToGame = userCurrentActiveGames.length && !currentGameID;

  const isUserInCurrentGame = Boolean(currentGameID && userCurrentActiveGames.length && userCurrentActiveGames
    .find(g => g.gameID == currentGameID));

  console.log('isUserInCurrentGame', isUserInCurrentGame);

  if (shouldRedirectToGame && !Admin) {
    window.location.replace(window.location.href + `?gameID=${userCurrentActiveGames[0].gameID}`);
  }

  /* console.log('window.location', window.location); */

  if (!isUserInCurrentGame && userCurrentActiveGames.length && currentGameID && !Admin) {
    window.location.replace(window.location.origin + window.location.pathname);
  }

  // TODO check user type (admin) to allow admins spectatew
  if (userCurrentActiveGames.length === 0 && !Admin) {
    var mainElement = <WDLobby />;
  }
  else {
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

/*
   User types
   - User: to distinguish between a registered user and a guest person navigating to app
   - Player: A type of user. non-admin user that is assigned to and plays games.
   - Admin: Non-player user that manages game assignment, can expectate, use admin dashboard.

   Rules

   - User not logged in => Redirect to login page (App.tsx)
   - GameID on URL does not exist => Stay/Redirect to Lobby (WdMain.tsx)
   - GameID on url exists, player not assigned to game => Redirect to Lobby
   - Player on Lobby, then assigned to Game => Redirect to Game ID route
   - Player assigned to Game => Display app
   - Admin user on any game url => spectate game
   - Game ends for a Player => Dialog of result is shown to Player. Dialog contains button to go back to Lobby to await for next game.
   - Game ends while admin is spectating. Display dialog, allow admin to stay on game or leave towards admin dashboard.

*/
