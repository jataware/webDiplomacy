import * as React from "react";
import "@aws-amplify/ui-react/styles.css"; // eslint-disable-line
import "./assets/css/App.css";
import { Authenticator } from "@aws-amplify/ui-react";
import { API, Auth } from 'aws-amplify';
import WDMain from "./components/ui/WDMain";
import WDLobby from "./components/ui/WDLobby";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import {
  fetchPlayerIsAdmin, loadGame, isAdmin,
  fetchPlayerActiveGames, playerActiveGames, fetchUsername
} from "./state/game/game-api-slice";
import TournamentDashboard from "./Tournament/Dashboard";
import { ConsentPage } from "./Consent";

import { SnackbarBus, GlobalNotificationsDialog } from "./components/ui/UserErrorNotifiers";

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
    console.log('Error updating user consent information:', e);
    throw e;
  }
}

/**
 *
 **/
const AuthIRBHandler = ({user, signOut, children, acceptedConsent, setAcceptedConsent}) => {

  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {

    let isMounted = true;

    console.log("acceptedConsent", acceptedConsent);

    if (acceptedConsent) {
      setReady(true);
      return;
    }

    console.log("Refetching user consent data");

    Auth
      .currentAuthenticatedUser({ bypassCache: true })
      .then((nonCachedUser) => {
        const hasAccepted = Boolean(nonCachedUser.attributes['custom:accepted-terms-at']);
        setAcceptedConsent(hasAccepted);
      }).finally(() => {
        if (isMounted) {
          setReady(true);
        }
      })

    return () => {
      isMounted = false
    }
  }, [acceptedConsent]);

  // TODO Loading animation
  if (!ready) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  if (!acceptedConsent) {
    console.log('Player user has not accepted IRB consent.');

    return (
      <ConsentPage
        onDecline={signOut}
        onAccept={() => {
          handleIRBAccept(user)
            .then(() => {
              setAcceptedConsent(true);
            })
            .catch((e) => {
              // TODO display a snackbar with failure
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
  const dispatch = useAppDispatch();

  const currentGameID = urlParams.get("gameID");
  const adminDashboard = urlParams.get("admin");

  const [acceptedConsent, setAcceptedConsent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const intervalRef = React.useRef();

  function pollGameData() {
    dispatch(fetchPlayerActiveGames());
    dispatch(fetchPlayerIsAdmin());
    dispatch(fetchUsername());
  }

  React.useEffect(() => {

    console.log("App init.");

    let isMounted = true

    setLoading(true);
    let promises = [
      dispatch(fetchPlayerActiveGames()),
      dispatch(fetchPlayerIsAdmin()),
      dispatch(fetchUsername())
    ];

    Promise
      .all(promises)
      .then(([games, playerAdmin]) => {
        if (isMounted) {
          setLoading(false);
        }
      })
    .catch((e) => {
      // TODO Snackbar
    });

    if (!adminDashboard) {
      intervalRef.current = setInterval(pollGameData, 8000);
    }

    return () => {
      isMounted = false;

      if (!adminDashboard) {
        clearInterval(intervalRef.current);
      }
    }

  }, []);

  const userCurrentActiveGames = useAppSelector(playerActiveGames);
  const Admin = useAppSelector(isAdmin);

  // TODO loading animation?
  if (loading) {
    return (
      <div>
      </div>
    );
  }

  if (!Admin) {

    const shouldRedirectToGameNow = Boolean(userCurrentActiveGames.length && !currentGameID);
    const isUserInCurrentGame = Boolean(currentGameID && userCurrentActiveGames.length && userCurrentActiveGames
      .find(g => g.gameID == currentGameID));

    const userActiveGame = userCurrentActiveGames.length ? userCurrentActiveGames[0].gameID : null;
    const gameUrl = window.location.origin + window.location.pathname + `?gameID=${userActiveGame}`;

    /* console.log("shouldRedirectToGameNow", shouldRedirectToGameNow);
     * console.log("isUserInCurrentGame", isUserInCurrentGame);
     * console.log("userActiveGame", userActiveGame)
     * console.log("gameUrl", gameUrl); */

    // We're in Lobby and should go our active game:
    if (shouldRedirectToGameNow) {
      // This works because user active games are where the player member is "Playing" and game isn't "Finished"
      console.log("======= Redirecting to game now.");
      window.location.href = gameUrl;
      return null;
    }
  }

  let MainElement = WDMain;

  if (adminDashboard && Admin) {
    MainElement = TournamentDashboard;
    // This works because users should only have 1 active game at a time during tournament:
  }  else if (currentGameID) {
    dispatch(loadGame(String(currentGameID)));
  } else {
    MainElement = WDLobby;
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
      <SnackbarBus />
      <GlobalNotificationsDialog />
    </div>
  )
};

export default App;
