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

export const redColor = "rgb(236,93,98)";
export const grayColor = "rgb(202,210,245)";
export const purpleColor = "rgb(109, 97, 246)";

export const randomColors = [
  "rgb(233, 30, 99)",  // pink
  "rgb(3, 169, 244)",  // light blue
  "rgb(156, 39, 176)", // purple
  "rgb(255, 152, 0)",  // orange
  "rgb(205, 220, 57)", // lime
  "rgb(255, 193, 7)",  // amber
  "rgb(244, 67, 54)",  // red
  "rgb(0, 188, 212)",  // cyan
  "rgb(63, 81, 181)",  // indigo
];

export const BaseButton = styled(Button)(() => `
  border-radius: 4px;
  text-transform: uppercase;
`);


export const PurpleButton = styled(BaseButton)(() => `
  border-color: ${purpleColor};
  color: ${purpleColor};

  &:hover {
    filter: brightness(130%);
    border-color: ${purpleColor};
  }
`);
