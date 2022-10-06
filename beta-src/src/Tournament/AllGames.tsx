import * as React from "react";
import { styled } from "@mui/material/styles";
import isEmpty from "lodash/isEmpty";
import random from "lodash/random";
import sortBy from "lodash/sortBy";

import Avatar from '@mui/material/Avatar';

import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Tooltip from '@mui/material/Tooltip';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import useMediaQuery from "@mui/material/useMediaQuery";
import EyeIcon from "@mui/icons-material/RemoveRedEye";
import EndIcon from "@mui/icons-material/DoDisturbOn";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import {
  getGameApiRequest
} from "../utils/api";

import { grayColor } from ".";
import { fetchAllGameDataforIDs } from "./endpoints";

const gamePropertyMappings = {
  processStatus: "status",
  gameID: "id"
};

import { GameList } from "./GameList";

/**
 * TODO wrapper that calls game type, and this one receives as props
 **/
const AllGames = (props) => {

  const [crashedGames, setCrashedGames] = React.useState([]);
  const [finishedGames, setFinishedGames] = React.useState([]);

  React.useEffect(() => {

    getGameApiRequest("game/crashedgames", {hello: "word"})
      .then(ids => {
        // IDs
        fetchAllGameDataforIDs(ids)
          .then(games => {
            setCrashedGames(games);
          });
      });

    getGameApiRequest("game/finishedgames", {hello: "word"})
      .then(id => {
        // IDs
        fetchAllGameDataforIDs(ids)
          .then(games => {
            setFinishedGames(games);
          });
      });

  }, []); // TODO only on mount for now

  return (
    <GameList
      title="Crashed Games"
      games={crashedGames}
    />
    <br />
    <GameList
      title="Finished Games"
      games={finishedGames}
    />
  );
}

export default AllGames;
