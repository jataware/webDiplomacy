import React from "react";
import identity from "lodash/identity";
import { ConsentPage } from "../Consent";

export default {
  title: "Tournament/IRB Consent Form",
  component: ConsentPage,
};

const Template = (args) => <ConsentPage {...args} />;

export const Main = Template.bind({});

Main.args = {
  onAccept: identity,
  onDecline: identity
};
