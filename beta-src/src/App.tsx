import * as React from "react";
import "@aws-amplify/ui-react/styles.css"; // eslint-disable-line
import "./assets/css/App.css";
import { Authenticator } from "@aws-amplify/ui-react";
import { API, Auth } from 'aws-amplify';
import WDMain from "./components/ui/WDMain";
import WDLobby from "./components/ui/WDLobby";
import { fetchPlayerIsAdmin, loadGame, isAdmin} from "./state/game/game-api-slice";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { fetchPlayerActiveGames, playerActiveGames } from "./state/game/game-api-slice";
import TournamentDashboard from "./Tournament/Dashboard";
import { ConsentPage } from "./Consent";

function userAPIConsent(authUser) {
  const token = authUser.signInUserSession.idToken.jwtToken;

  console.log("token", token);

  const requestInfo = {
    headers: {
      Authorization: token
    }
  };

  console.log("Posting to webDiplomacyExtAPI");

  return API.post('webDiplomacyExtAPI', '/consent', requestInfo);
}

async function handleIRBAccept(user) {
  try {
    const result = await userAPIConsent(user);
    return true;

  } catch(e) {
    // TODO Unable to accept consent. What shall we do here.
    console.log('Error updating user consent information:', e);
    throw e;
  }
}

/**
 *
 **/
const AuthIRBHandler = ({user, signOut, children}) => {

  if (!user) {
    console.log("Error: We've made it so far here but there is not user available.");
  }

  const [accepted, setAccepted] = React.useState(false);

  const hasAcceptedConsent = user.attributes['custom:accepted-terms-at'] || accepted;

  if (!hasAcceptedConsent) {
    console.log('Has not accepted consent');

    return (
      <ConsentPage
        onDecline={signOut}
        onAccept={() => {
          handleIRBAccept(user)
            .then(() => {
              console.log('accepted');
              setAccepted(true);
            });
        }} />
    );
  }

  return children;
};

/**
 *
 **/
const App: React.FC = function (): React.ReactElement {

  const urlParams = new URLSearchParams(window.location.search);
  const currentGameID = urlParams.get("gameID");
  const dispatch = useAppDispatch();

  console.log("currentGameID", currentGameID);

  const adminDashboard = urlParams.get("admin");

  const [fetchedGames, setFetchedGames] = React.useState(false);
  const [fetchedAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    if (!fetchedGames) {
      console.log("App fetching games.");
      dispatch(fetchPlayerActiveGames());
      // TODO continue fetching games ocassionally on interval until we are assigned one
      setFetchedGames(true);
    }

    if (!fetchedAdmin) {
      console.log('called fetchPlayerIsAdmin');
      dispatch(fetchPlayerIsAdmin());
      setIsAdmin(true);
    }
  }, [fetchedGames, fetchedAdmin]);

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

  console.log("isUserInCurrentGame", isUserInCurrentGame);

  if (shouldRedirectToGame && !Admin) {
    window.location.replace(window.location.href + `?gameID=${userCurrentActiveGames[0].gameID}`);
  }

  /* console.log('window.location', window.location); */

  if (!isUserInCurrentGame && userCurrentActiveGames.length && currentGameID && !Admin) {
    window.location.replace(window.location.origin + window.location.pathname);
  }

  let MainElement = WDMain;

  // TODO check user type to allow admins to spectate
  if (userCurrentActiveGames.length === 0 && !Admin) {
     MainElement = WDLobby;
  } else {
    dispatch(loadGame(String(currentGameID)));
  }

  return (
    <div className="App">
    {/* The following line prevents the UI from being scaled down when the viewport is small.
  That leads to a very bad experience for this UI, with part of the map cut off. */}
      <meta name="viewport" content="width=device-width, user-scalable=no" />
      <Authenticator
        variation="modal"
        signUpAttributes={['email']}
      >
        {({ signOut, user }) => (
          <AuthIRBHandler
            signOut={signOut}
            user={user}>
            <MainElement
              signOut={signOut}
            />
          </AuthIRBHandler>
        )}
      </Authenticator>
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
