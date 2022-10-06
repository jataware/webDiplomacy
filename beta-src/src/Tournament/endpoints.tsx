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


/**
 * TODO maybe use?
 **/
export function endpointFactory(path, paramKey) {
  return async function(paramValue) {
    try {
      const response = await getGameApiRequest(
        path,
        paramKey ? {[paramKey]: paramValue} : {hello: "world"}
      );

      return response.data;

    } catch(e) {
      console.log(`Request to fetch ${path} failed, e:`, e);
    }
  }
}

// TODO Move these fetch definitions to their own files

export async function fetchAllPlayers() {
  try {
    const players = await getGameApiRequest(
      "players/all",
      {hello: "world"}
    );

    return players.data;

  } catch(e) {
    console.log('Request to fetch players failed, e:', e);
  }
}

/**
 *
 **/
export async function fetchOngoingGames() {
  try {
    const ongoingGames = await getGameApiRequest(
      "game/ongoingGames",
      {hello: "world"}
    );

    return ongoingGames.data; // Array with IDs for all ongoing games

  } catch(e) {
    console.log('Request to fetch ongoinggames failed, e:', e);
  }
}

/**
 *
 **/
export async function fetchWaitingGames() {
  try {
    const waitingGames = await getGameApiRequest(
      "game/waitingGames",
      {hello: "world"}
    );

    return waitingGames.data; // Array with IDs for all ongoing games

  } catch(e) {
    console.log('Request to fetch ongoinggames failed, e:', e);
  }
}

/**
 *
 **/
export async function fetchGameOverview(ID) {

  try {
    const overview = await getGameApiRequest(
      "game/overview",
      {gameID: ID}
    );

    return overview.data.data; // Array with IDs for all ongoing games

  } catch(e) {
    console.log('Request to fetch ongoinggames failed, e:', e);
  }

}

/**
 *
 **/
export async function fetchGameMembers(ID) {
  try {
    const response = await getGameApiRequest(
      "game/members",
      {gameID: ID}
    );

    return response.data.data.members; // Array with IDs for all ongoing games

  } catch(e) {
    console.log('Request to fetch ongoinggames failed, e:', e);
  }
}

/**
 *
 **/
export async function fetchAllGameDataforIDs(IDs) {
  try {

    const result = await Promise
      .all(IDs.map(fetchGameOverview));

    return result;

  } catch(e) {
    console.log('Request to fetch all game data by IDs failed, e:', e);
  }

}

export async function fetchWaitingPlayers() {
  try {
    const players = await getGameApiRequest(
      "players/waiting",
      {hello: "world"}
    );

    return players.data;

  } catch(e) {
    console.log('Request to fetch players failed, e:', e);
  }
}
