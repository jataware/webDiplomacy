import * as React from "react";
import DOMPurify from "dompurify";
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import identity from "lodash/identity";
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
import Divider from '@mui/material/Divider';
import AssignmentIcon from '@mui/icons-material/Assignment';

interface WDMessageProps {
  message: GameMessage;
  userCountry: CountryTableData | null;
  allCountries: CountryTableData[];
  viewedPhaseIdx: number;
}

const DECEPTIVE = "yes";
const TRUSTWORTHY = "no";
const NULL = "clear";

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

// Not used anymore. Leaving here in case we change our mind.
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

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

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

  // We don't re-fetch messages on each annotation change, so we store this locally in order
  // to show the button as highlighted (user selected this option). Not perfect but good enough
  // for our tournament purposes.
  const [isAnnotatedDeceptive, setAnnotatedDeceptive] = React.useState(message.suspectedIncomingDeception === DECEPTIVE);
  const [isAnnotatedTrustworthy, setAnnotatedTrustworthy] = React.useState(message.suspectedIncomingDeception === TRUSTWORTHY);

  const annotateMessage = (message, answer) => { // answer 0 or 1

    let answerToSave = answer;

    if (isAnnotatedDeceptive && answer === DECEPTIVE || isAnnotatedTrustworthy && answer === TRUSTWORTHY) {
      answerToSave = NULL;
    }

    saveSuspectedIncomingDeception(message, gameID, answerToSave);

    setAnnotatedDeceptive(answerToSave === DECEPTIVE);
    setAnnotatedTrustworthy(answerToSave === TRUSTWORTHY);
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

          <div className="text-xs mt-1 text-gray-500 italic" style={{textAlign: "right"}}>
            {msgTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
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
              {isUserRecipient && (
                <Box
                  className="research-actions"
                  sx={{
                    backgroundColor: "#e5edfc",
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    padding: "4px",
                    mr: 0.75,
                  }}
                >

                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography
                          variant="h6"
                          sx={{fontSize: "1rem"}}
                          color="inherit">
                          Research Question
                        </Typography>
                        <p>Select incoming message perception.</p>
                        <Typography variant="caption">
                          Answer not shared with opponents.
                        </Typography>
                        <Typography variant="caption" component="p">
                          Can only annotate on turn received.
                        </Typography>
                      </React.Fragment>
                    }
                    placement="left"
                  >
                    <AssignmentIcon sx={{color: "#6887fd", cursor: "help"}} />
                  </HtmlTooltip>

                  &nbsp;

                  <Button
                    size="small"
                    variant={isAnnotatedDeceptive ? "outlined" : ""}
                    onClick={ isMessageCurrentTurn ? () => annotateMessage(message, DECEPTIVE) : identity }
                    sx={{
                      cursor: !isMessageCurrentTurn ? "default" : "pointer",
                      p: 0.5,
                      mr: "2px",
                      borderRadius: "4px",
                      borderColor: "rgb(33, 150, 243)",
                      borderWidth: 3,
                      color: "rgb(244 244 244)",
                      backgroundColor: "rgb(156, 39, 176)",
                      "&:hover": {
                        backgroundColor: "rgb(156, 39, 176)",
                        filter: "brightness(1.2)",
                        borderRadius: "4px",
                        borderColor: "rgb(33, 150, 243)",
                        borderWidth: 3,
                      }
                    }}
                  >
                    Deceptive
                  </Button>

                  <Divider
                    sx={{
                      borderColor: "#9cbaf3"
                    }}
                    orientation="vertical"
                    flexItem
                  />

                  <Button
                    size="small"
                    variant={isAnnotatedTrustworthy ? "outlined" : ""}
                    onClick={isMessageCurrentTurn ? () => annotateMessage(message, TRUSTWORTHY) : identity}
                    sx={{
                      cursor: !isMessageCurrentTurn ? "default" : "pointer",
                      ml: "2px",
                      mr: "2px",
                      p: 0.5,
                      borderColor: "rgb(33, 150, 243)",
                      borderWidth: 3,
                      borderRadius: "4px",
                      color: "rgb(97 80 29)",
                      backgroundColor: "rgb(255, 193, 7)",
                      "&:hover": {
                        backgroundColor: "rgb(255, 193, 7)",
                        filter: "brightness(1.1)",
                        borderColor: "rgb(33, 150, 243)",
                        borderRadius: "4px",
                        borderWidth: 3,
                      }
                    }}
                  >
                    Trustworthy
                  </Button>
                </Box>
              )}
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WDMessage;
