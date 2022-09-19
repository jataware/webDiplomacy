import * as React from "react";
import "@aws-amplify/ui-react/styles.css"; // eslint-disable-line
import "./assets/css/App.css";
import { Authenticator, ThemeProvider } from "@aws-amplify/ui-react";
import WDMain from "./components/ui/WDMain";
import { useAppDispatch } from "./state/hooks";
import { loadGame } from "./state/game/game-api-slice";

const App: React.FC = function (): React.ReactElement {
  const urlParams = new URLSearchParams(window.location.search);
  const currentGameID = urlParams.get("gameID");
  const dispatch = useAppDispatch();
  dispatch(loadGame(String(currentGameID)));
  return (
    <ThemeProvider>
      <div className="App">
        {/* The following line prevents the UI from being scaled down when the viewport is small.
           That leads to a very bad experience for this UI, with part of the map cut off. */}
        <meta name="viewport" content="width=device-width, user-scalable=no" />

        <Authenticator>
          <WDMain />
        </Authenticator>
      </div>
    </ThemeProvider>
  );
};

export default App;
