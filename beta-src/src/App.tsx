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

  const requestInfo = {
    headers: {
      Authorization: token
    }
  };

  return API.post('webDiplomacyExtAPI', '/consent', requestInfo);
}

async function handleIRBAccept(user) {
  try {
    const result = await userAPIConsent(user);
    return result;
  } catch(e) {
    // TODO Unable to accept consent. What shall we do here.
    console.log('Error updating user consent information:', e);
    throw e;
  }
}

/**
 *
 **/
const AuthIRBHandler = ({user, signOut, children, acceptedConsent, setAcceptedConsent}) => {

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const noCacheUser = Auth
      .currentAuthenticatedUser({ bypassCache: true })
      .then((nonCachedUser) => {
        const hasAccepted = Boolean(nonCachedUser.attributes['custom:accepted-terms-at']);
        setAcceptedConsent(hasAccepted);
      }).finally(() => {
        setLoading(false);
      })
  }, [acceptedConsent, loading]);

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!acceptedConsent) {
    console.log('Player user has not accepted IRB consent');

    return (
      <ConsentPage
        onDecline={signOut}
        onAccept={() => {
          handleIRBAccept(user).then(result => {
            setAcceptedConsent(true);
          })
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

  const adminDashboard = urlParams.get("admin");

  const [acceptedConsent, setAcceptedConsent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {

    setLoading(true);
    let promises = [
      dispatch(fetchPlayerActiveGames()),
      dispatch(fetchPlayerIsAdmin())
    ];

    Promise
      .all(promises)
      .then(([games, playerAdmin]) => {
        setLoading(false);
      });

  }, []);

  const userCurrentActiveGames = useAppSelector(playerActiveGames);
  const Admin = useAppSelector(isAdmin);

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (adminDashboard && Admin) {
    return (
      <div>
        {/* The following line prevents the UI from being scaled down when the viewport is small.
            That leads to a very bad experience for this UI, with part of the map cut off. */}
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <TournamentDashboard />
      </div>
    )
  }

  if(!Admin) {
    const shouldRedirectToGame = userCurrentActiveGames.length && !currentGameID;

    if (shouldRedirectToGame) {
      window.location.replace(window.location.href + `?gameID=${userCurrentActiveGames[0].gameID}`);
      return;
    }

    const isUserInCurrentGame = Boolean(currentGameID && userCurrentActiveGames.length && userCurrentActiveGames
      .find(g => g.gameID == currentGameID));

    if (!isUserInCurrentGame && userCurrentActiveGames.length && currentGameID) {
      window.location.replace(window.location.origin + window.location.pathname);
      return;
    }
  }

  let MainElement = WDMain;

  if ((userCurrentActiveGames.length === 0 && !Admin) || (!currentGameID && Admin)) {
     MainElement = WDLobby;
  } else if (currentGameID) {
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
            acceptedConsent={acceptedConsent}
            setAcceptedConsent={setAcceptedConsent}
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
