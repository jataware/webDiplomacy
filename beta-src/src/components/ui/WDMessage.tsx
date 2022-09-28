import * as React from "react";
import DOMPurify from "dompurify";
import { Box, IconButton } from "@mui/material"; // TODO import individually
import { useAppSelector } from "../../state/hooks";
import {
  gameOverview,
} from "../../state/game/game-api-slice";
import ApiRoute from "../../enums/ApiRoute";
import {
  postGameApiRequest,
} from "../../utils/api";
import Device from "../../enums/Device";
import useViewport from "../../hooks/useViewport";
import getDevice from "../../utils/getDevice";
import { turnAsDate } from "../../utils/formatTime";
import { GameMessage } from "../../state/interfaces/GameMessages";
import { CountryTableData } from "../../interfaces/CountryTableData";
import Popover from "@mui/material/Popover";
import backstabIcon from '../../assets/png/backstab.png';
import clipboardImg from "../../assets/png/clipboard-3.png";
import Typography from "@mui/material/Typography";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
import ArrowUpIcon from "@mui/icons-material/ArrowDropUpOutlined";
import GoodIcon from '@mui/icons-material/GppGoodRounded';
import DoneIcon from '@mui/icons-material/DoneRounded';

interface WDMessageProps {
  message: GameMessage;
  userCountry: CountryTableData | null;
  allCountries: CountryTableData[];
  viewedPhaseIdx: number;
}

// NOTE Maybe use app actions to have changes flow through app instead of manual sync.
// With more time, investigate. No big deal for our purposes.
async function saveSuspectedIncomingDeception(message, gameID, answer) {

  const { timeSent, fromCountryID, toCountryID } = message;

  try {
    await postGameApiRequest(
      ApiRoute.ANNOTATE_MESSAGE,
      {
        gameID,
        timeSent,
        fromCountryID,
        toCountryID,
        answer,
        direction: "incoming"
      },
    );

  } catch(e) {
    console.log('Request to annotate message failed, e:', e);
  }
}

// Useful for the future here or under WDPress.tsx
/* const getUniqueMsgID = (message) => `${message.toCountryID}-${message.fromCountryID}-${message.timeSent}`; */

const ResearchPopover = ({isOpen, anchorEl, handleClose, handleDeceptive, handleTrustworthy}) => {
  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
          borderRadius: 0
        }
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Box
        className="popover-outer"
        sx={{
          pt: 1,
        }}>
        <Box
          className="popover-inner"
          sx={{
            p: 2.5,
            backgroundColor: "white",
            border: "2px solid gray",
            borderRadius: 1.5
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              top: 0,
              left: 0,
              marginTop: "-10px",
              display: "flex",
              justifyContent: "center"
            }}
          >
            <ArrowUpIcon sx={{color: "gray", fontSize: "2rem"}} />
          </Box>

          <Typography
            variant="h5"
            gutterBottom
          >
            Research Annotation
          </Typography>

          <Typography paragraph>How are you feeling about this message?</Typography>

          <Box>
            <Button
              sx={{mr: 1}}
              startIcon={
                <Icon>
                  <img
                    src={backstabIcon}
                    width="30"
                    height="30"
                    alt="Backstab Deception Icon"
                  />
                </Icon>
              }
            >
              Deceptive
            </Button>

            <Button
              startIcon={
                <GoodIcon
                  width="30"
                  height="30"
                  alt="Trustworthy Icon"
                />
              }
            >
              Trustworthy
            </Button>
          </Box>

          <br />
          <Typography variant="caption">Internally saved for research. Not shared with any users.</Typography>
        </Box>
      </Box>
    </Popover>
  );
}


const WDMessage: React.FC<WDMessageProps> = function ({
  message,
  userCountry,
  allCountries,
  viewedPhaseIdx,
}): React.ReactElement {

  const [viewport] = useViewport();
  const device = getDevice(viewport);
  const mobileLandscapeLayout =
    device === Device.MOBILE_LANDSCAPE ||
    device === Device.MOBILE_LG_LANDSCAPE ||
    device === Device.MOBILE;

  const { user, gameID, turn: currentGameTurn } = useAppSelector(gameOverview);

  const [isAnnotatedDeceptive, setAnnotatedDeceptive] = React.useState(message.suspectedIncomingDeception === "1");

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const isPopOverOpen = Boolean(anchorEl);

  const annotateMessage = (message) => {
    const answer = isAnnotatedDeceptive ? "0" : "1";
    saveSuspectedIncomingDeception(message, gameID, answer);
    setAnnotatedDeceptive(!isAnnotatedDeceptive);
  };

  const isUserRecipient = Boolean(message?.toCountryID && (message?.toCountryID === user?.member?.countryID));
  const isMessageCurrentTurn = message.turn === currentGameTurn;

  const getCountry = (countryID: number) =>
    allCountries.find((cand) => cand.countryID === countryID);

  const fromCountry = getCountry(message.fromCountryID);
  const msgWidth = mobileLandscapeLayout ? "170px" : "250px";
  const justify =
    userCountry && message.fromCountryID === userCountry.countryID
      ? "end"
      : "start";
  const msgTime = new Date(0);
  msgTime.setUTCSeconds(message.timeSent);

  return (
    <div className={`flex justify-${justify}`}>
      <div
        id={`message-${message.timeSent}`}
        className={`p-3 m-2 bg-slate-100 max-w-[${msgWidth}] rounded-lg`}
      >
        <div className="flex-col">
          <div>
            {/* Dynamic JIT is not working if is not previously declared.
            https://github.com/tailwindlabs/tailwindcss/discussions/6763
            Do not delete the line below. */}
            <div className="hidden max-w-[170px] max-w-[250px] justify-end justify-start" />
            <span style={{ color: fromCountry?.color, fontWeight: "bold" }}>
              {fromCountry?.country.toUpperCase().slice(0, 3)}
            </span>
            {": "}
            {/* Here's a robust but dangerous choice...
            The messages are all sanitized in gamemessage.php, and newlines
            converted to <br/>
            */}
            <span
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(message.message, {
                  ALLOWED_TAGS: ["br", "strong"],
                }),
              }}
            />
          </div>
          <div className="flex text-xs mt-1 text-gray-500 italic">
            <div className="flex-1">
              {message.turn < viewedPhaseIdx && (
                <>{turnAsDate(message.turn, "Classic")}</>
              )}
            </div>

            <Box
              ml="0"
              className="ml-4"
              display="flex"
              alignItems="center"
              justifyContent="space-between">
              {(isUserRecipient && isMessageCurrentTurn) || true && (
                <Box
                  className="research-actions"
                  sx={{
                    border: "1px solid gray",
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    padding: "4px",
                    mr: 1
                  }}
                >
                  <Icon sx={{borderRadius: 1}}>
                    <img src={clipboardImg} width="20" height="25" />
                  </Icon>

                  &nbsp;

                  <IconButton
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                    color="warning"
                    sx={{
                      background: isAnnotatedDeceptive ? "#ffcc88" : "#eaeaea",
                      padding: 0.25,
                      mr: "2px"
                    }}
                  >
                    <img src={backstabIcon} width="25" height="30" />
                  </IconButton>

                  <IconButton
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                    color="success"
                    sx={{
                      background: isAnnotatedDeceptive ? "#ffcc88" : "#eaeaea",
                      fontSize: "0.25rem",
                      p: 0.5,
                      mr: "2px"
                    }}
                  >
                    <GoodIcon />
                  </IconButton>
                </Box>
              )}
              {msgTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Box>
          </div>
        </div>
      </div>

      <ResearchPopover
        isOpen={isPopOverOpen}
        anchorEl={anchorEl}
        handleClose={handlePopoverClose} />

    </div>
  );
};

export default WDMessage;

/* onClick={() => annotateMessage(message)} */
