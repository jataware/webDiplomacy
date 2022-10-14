import React from "react";
import ReactDOM from "react-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { Amplify } from "aws-amplify";
import webDiplomacyTheme from "./webDiplomacyTheme";
import "./assets/css/index.css";
import App from "./App";
import { store } from "./state/store";
import awsExports from "./aws-exports";

Amplify.configure(awsExports);

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={webDiplomacyTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById("root"),
);
