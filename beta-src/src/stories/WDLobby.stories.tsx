import React from "react";
import identity from "lodash/identity";

import Lobby from "../components/ui/WDLobby";

export default {
  title: "Tournament/WDLobby",
  component: Lobby,
};

const Template = (args) => <Lobby {...args} />;

export const Main = Template.bind({});

Main.args = {
  signOut: identity,
};
