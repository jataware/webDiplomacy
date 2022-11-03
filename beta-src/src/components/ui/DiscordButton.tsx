
import * as React from "react";
import Button from '@mui/material/Button';

import discordLogoSvgFull from "../../assets/svg/discord-logo-blue.svg";


const DiscordButton = (props) => {
  return (
    <Button
      component="a"
      target="_blank"
      href="https://www.discord.gg/gAVWYx7Cr9"
    >
      <img
        src={discordLogoSvgFull}
        style={{height: "2rem"}}
      />
    </Button>
  );
};

export default DiscordButton;
