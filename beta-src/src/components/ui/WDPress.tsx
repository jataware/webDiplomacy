import React, { FC, ReactNode, ReactElement, useRef, useEffect } from "react";
import {
  Box,
  Stack,
  IconButton,
  TextField,
  ButtonGroup,
  Divider,
} from "@mui/material";
import { Email, Send } from "@mui/icons-material";
import useLocalStorageState from "use-local-storage-state";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import useViewport from "../../hooks/useViewport";
import getDevice from "../../utils/getDevice";
import WDMessageList from "./WDMessageList";
import { CountryTableData } from "../../interfaces";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import {
  gameApiSliceActions,
  gameOverview,
  markMessagesSeen,
  sendMessage,
} from "../../state/game/game-api-slice";
import { store } from "../../state/store";
import ApiRoute from "../../enums/ApiRoute";
import {
  postGameApiRequest,
} from "../../utils/api";
import MessageResearchDialog from "./WDMessageResearchDialog";

interface WDPressProps {
  children: ReactNode;
  userCountry: CountryTableData | null;
  allCountries: CountryTableData[];
}

const ALL_COUNTRY = "ALL";

const WDPress: FC<WDPressProps> = function ({
  children,
  userCountry,
  allCountries,
}): ReactElement {
  /* const [viewport] = useViewport(); */
  /* const device = getDevice(viewport); */
  const dispatch = useAppDispatch();

  const padding = 0;
  const [messageStack, setMessageStack] = useLocalStorageState("messageStack", {
    defaultValue: {},
  });

  const { user, gameID, pressType, phase } = useAppSelector(gameOverview);

  const messages = useAppSelector(({ game }) => game.messages.messages);
  const countryIDSelected = useAppSelector(
    ({ game }) => game.messages.countryIDSelected,
  );

  const newMessagesFrom = useAppSelector(
    ({ game }) => game.messages.newMessagesFrom,
  );

  const [researchDialogOpen, setResearchDialogOpen] = React.useState(false);
  const [lastMessageData, setLastMessageData] = React.useState({
    gameID: 0,
    fromCountryID: 3,
    fromCountry: "",
    toCountry: "",
    toCountryID: 0,
    message: ""
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // scroll to the bottom of the message list
    // FIXME: should this happen if we get a message from a 3rd party?
    messagesEndRef.current?.scrollIntoView();
  }, [messages, countryIDSelected]);

  async function saveResearchResponse (answer) {

    const savedMessage = messages.find(message => {
      return message.fromCountryID === lastMessageData.fromCountryID &&
             message.toCountryID === lastMessageData.toCountryID &&
             message.message === lastMessageData.message;
    })

    if (!savedMessage) {
      console.error('There\'s been an error and we couldn\'t find the saved message to annotate.');
      return;
    }

    const { fromCountryID, toCountryID, timeSent } = savedMessage;

    try {
      const response = await postGameApiRequest(
        ApiRoute.ANNOTATE_MESSAGE,
        {
          gameID,
          timeSent,
          fromCountryID,
          toCountryID,
          answer,
          direction: "outgoing"
        },
      );

    } catch(e) {
      console.log('Request to annotate message failed, e:', e);
    } finally {
      setResearchDialogOpen(false);
    }
  }

  const clickSend = () => {

    if (!userCountry) {
      return;
    }
    const message = messageStack[countryIDSelected];

    if (message) {
      dispatch(
        sendMessage({
          gameID: String(gameID),
          countryID: String(userCountry.countryID),
          toCountryID: String(countryIDSelected),
          message
        }),
      );

      const recipientCountryData = allCountries.find(country => country.countryID === countryIDSelected);

      setLastMessageData({
        gameID: gameID,
        fromCountryID: userCountry.countryID,
        fromCountry: userCountry.country,
        toCountry: recipientCountryData?.country || ALL_COUNTRY, // Special constant
        toCountryID: recipientCountryData?.countryID || 0,
        message
      });
      setResearchDialogOpen(true);
    }
    const ms = { ...messageStack };

    ms[countryIDSelected] = "";
    setMessageStack(ms);
  };

  const dispatchMessagesSeen = (countryID) => {
    // need to update locally and on the server
    // because we don't immediately re-fetch message data from the server
    dispatch(gameApiSliceActions.processMessagesSeen(countryID));
    if (userCountry) {
      dispatch(
        markMessagesSeen({
          countryID: String(userCountry.countryID),
          gameID: String(gameID),
          seenCountryID: String(countryID),
        }),
      );
    }
  };

  // capture enter for end, shift-enter for newline
  const keydownHandler = (e) => {
    const keyCode = e.which || e.keyCode;
    const ENTER = 13;
    if (keyCode === ENTER && !e.shiftKey) {
      e.preventDefault();
      clickSend();
    }
  };

  const makeCountryButton = ({ country, countryID, color }) => {
    return (
      <Button
        key={countryID}
        sx={{
          p: 1,
          "&.MuiButton-text": { color },
        }}
        color="primary"
        onClick={() => {
          dispatchMessagesSeen(countryID);
          dispatch(gameApiSliceActions.selectMessageCountryID(countryID));
        }}
        size="small"
        variant={countryIDSelected === countryID ? "contained" : "text"}
        startIcon={newMessagesFrom.includes(countryID) ? <Email /> : ""}
      >
        {country.slice(0, 3).toUpperCase()}
      </Button>
    );
  };

  let countryButtons = allCountries
    .filter((country) => country.countryID !== userCountry?.countryID)
    .sort((a, b) => a.countryID - b.countryID)
    .map(makeCountryButton);
  const allButton = makeCountryButton({
    country: "ALL",
    countryID: 0,
    color: "primary",
  });
  countryButtons = userCountry ? [allButton, ...countryButtons] : [allButton];

  const canMsg =
    pressType === "Regular" ||
    (pressType === "PublicPressOnly" && countryIDSelected === 0) ||
    (pressType === "RulebookPress" &&
      ["Diplomacy", "Finished"].includes(phase));

  return (
    <Box
      sx={{ p: padding }}
      onClick={() => dispatchMessagesSeen(countryIDSelected)} // clicking anywhere in the window means you've seen it
    >
      <Stack alignItems="center" sx={{ p: padding }}>
        <ButtonGroup
          className="dialogue-countries"
          sx={{
            display: "inline",
            padding: "6px 0px",
            width: userCountry ? "auto" : "95%",
          }}
        >
          {countryButtons}
        </ButtonGroup>
      </Stack>
      <WDMessageList
        messages={messages}
        allCountries={allCountries}
        userCountry={userCountry}
        countryIDSelected={countryIDSelected}
        messagesEndRef={messagesEndRef}
      />
      {userCountry && (
        <Box>
          <Stack alignItems="center" direction="row">
            <TextField
              id="user-msg"
              label="Send Message"
              variant="outlined"
              value={messageStack[countryIDSelected] || ""}
              multiline
              maxRows={4}
              onChange={(text) => {
                const ms = { ...messageStack };
                ms[countryIDSelected] = text.target.value;
                setMessageStack(ms);
              }}
              onKeyDown={keydownHandler}
              fullWidth
              disabled={!canMsg}
              sx={{ m: "0 0 0 6px" }}
              InputProps={{
                endAdornment: (
                  <>
                    <Divider orientation="vertical" />
                    <IconButton
                      onClick={clickSend}
                      disabled={!messageStack[countryIDSelected] || !canMsg}
                    >
                      <Send
                        color={
                          messageStack[countryIDSelected] && canMsg
                            ? "primary"
                            : "disabled"
                        }
                      />
                    </IconButton>
                  </>
                ),
                style: {
                  padding: "4px 0 4px 8px", // needed to cancel out extra height induced by the button
                },
              }}
            />
          </Stack>
        </Box>
      )}
      <MessageResearchDialog
        open={researchDialogOpen}
        setOpen={setResearchDialogOpen}
        toCountry={lastMessageData.toCountry}
        message={lastMessageData.message}
        saveResponse={saveResearchResponse}
      />
    </Box>
  );
};

export default WDPress;
