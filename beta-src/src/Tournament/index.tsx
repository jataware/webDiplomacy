import * as React from "react";
import { styled } from "@mui/material/styles";

import Button from "@mui/material/Button";

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
