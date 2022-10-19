import React from "react";
import identity from "lodash/identity";

import { ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";

import webDiplomacyTheme from "../webDiplomacyTheme";
import { store } from "../state/store";

import Lobby from "../components/ui/WDLobby";
import { Amplify } from "aws-amplify";

import awsExports from "../aws-exports";

Amplify.configure(awsExports);

export default {
  title: "Tournament/WDLobby",
  component: Lobby,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <ThemeProvider theme={webDiplomacyTheme}>
          <Story />
        </ThemeProvider>
      </Provider>
    )
  ]
};

const Template = (args) => <Lobby {...args} />;

export const Main = Template.bind({});

Main.args = {
  signOut: identity,
};
