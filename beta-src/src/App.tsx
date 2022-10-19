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

  if (!ready) {
    return (
      <div>
        <p>Loading Form..</p>
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
  const currentGameID = urlParams.get("gameID");
  const dispatch = useAppDispatch();

  const adminDashboard = urlParams.get("admin");

  const [acceptedConsent, setAcceptedConsent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);


  React.useEffect(() => {

    console.log("App init.");

    let isMounted = true

    setLoading(true);
    let promises = [
      dispatch(fetchPlayerActiveGames()),
      dispatch(fetchPlayerIsAdmin())
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

    return () => {
      isMounted = false
    }

  }, []);

  const userCurrentActiveGames = useAppSelector(playerActiveGames);
  const Admin = useAppSelector(isAdmin);

  if (loading) {
    return (
      <div>
        <p>Loading ..</p>
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

  if (!Admin) {
    const shouldRedirectToGame = userCurrentActiveGames.length && !currentGameID;

    /* console.log("window.location", window.location); */

    if (shouldRedirectToGame) {
      window.location.replace(window.location.origin + window.location.pathname + `?gameID=${userCurrentActiveGames[0].gameID}`);
      return null;
    }

    const isUserInCurrentGame = Boolean(currentGameID && userCurrentActiveGames.length && userCurrentActiveGames
      .find(g => g.gameID == currentGameID));

    if (!isUserInCurrentGame && userCurrentActiveGames.length && currentGameID) {
      window.location.replace(window.location.origin + window.location.pathname);
      return null;
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
