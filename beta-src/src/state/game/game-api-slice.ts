import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import ApiRoute from "../../enums/ApiRoute";
import {
  getGameApiRequest,
  postGameApiRequest,
  submitOrders,
} from "../../utils/api";
import GameDataResponse from "../interfaces/GameDataResponse";
import GameErrorResponse from "../interfaces/GameErrorResponse";
import GameOverviewResponse from "../interfaces/GameOverviewResponse";
import { ApiStatus, GameState } from "../interfaces/GameState";
import GameStatusResponse from "../interfaces/GameStatusResponse";
import GameMessages, { MessageStatus } from "../interfaces/GameMessages";
import ViewedPhaseState from "../interfaces/ViewedPhaseState";
import { RootState } from "../store";
import initialState from "./initial-state";
import OrdersMeta from "../interfaces/SavedOrders";
import OrderState from "../interfaces/OrderState";
import mergeMessageArrays from "../../utils/state/mergeMessageArrays";
import updateOrder from "../../utils/state/updateOrder";
import updateOrdersMeta from "../../utils/state/updateOrdersMeta";
import UpdateOrdersMetaAction from "../../interfaces/state/UpdateOrdersMetaAction";
import SavedOrdersConfirmation from "../../interfaces/state/SavedOrdersConfirmation";
import OrderSubmission from "../../interfaces/state/OrderSubmission";
import resetOrder from "../../utils/state/resetOrder";
import processMapClick from "../../utils/state/gameApiSlice/reducers/processMapClick";
import fetchGameDataFulfilled from "../../utils/state/gameApiSlice/extraReducers/fetchGameData/fulfilled";
import TerritoriesMeta from "../interfaces/TerritoriesState";
import fetchGameOverviewFulfilled from "../../utils/state/gameApiSlice/extraReducers/fetchGameOverview/fulfilled";
import fetchGameStatusFulfilled from "../../utils/state/gameApiSlice/extraReducers/fetchGameStatus/fulfilled";
import {
  saveOrdersPending,
  saveOrdersFulfilled,
  saveOrdersRejected,
} from "../../utils/state/gameApiSlice/extraReducers/saveOrders/fulfilled";
import shallowArraysEqual from "../../utils/shallowArraysEqual";
import { setAlert } from "../interfaces/GameAlert";
import PlayerActiveGames from "../interfaces/PlayerActiveGames";
import {
  handleGetSucceeded,
  handleGetFailed,
  handlePostSucceeded,
  handlePostFailed,
} from "../../utils/state/gameApiSlice/extraReducers/handleSucceededFailed";

export const fetchGameData = createAsyncThunk(
  ApiRoute.GAME_DATA,
  async (queryParams: { countryID?: string; gameID: string }) => {
    const { data } = await getGameApiRequest(ApiRoute.GAME_DATA, queryParams);
    // console.log("fetchGameData");
    // console.log(data);
    return data as GameDataResponse;
  },
);

export const fetchGameOverview = createAsyncThunk(
  ApiRoute.GAME_OVERVIEW,
  async (queryParams: { gameID: string }) => {
    const {
      data: { data },
    } = await getGameApiRequest(ApiRoute.GAME_OVERVIEW, queryParams);
    // console.log("fetchGameOverview");
    // console.log(data);
    return data as GameOverviewResponse;
  },
);

export const fetchGameStatus = createAsyncThunk(
  ApiRoute.GAME_STATUS,
  async (queryParams: { countryID?: string; gameID: string }) => {
    const { data } = await getGameApiRequest(ApiRoute.GAME_STATUS, queryParams);
    // console.log("fetchGameStatus");
    // console.log(data);
    return data as GameStatusResponse;
  },
);

export const fetchGameMessages = createAsyncThunk(
  ApiRoute.GAME_MESSAGES,
  async (queryParams: {
    gameID: string;
    countryID?: string;
    sinceTime?: string;
  }) => {
    const {
      data: { data },
    } = await getGameApiRequest(
      ApiRoute.GAME_MESSAGES,
      queryParams,
      // set a 60 second timeout.
      // Timeout is important because we rate-limit to
      // one outstanding request at a time.
      60000,
    );
    return data as GameMessages;
  },
);

export const fetchPlayerActiveGames = createAsyncThunk(
  ApiRoute.PLAYERS_ACTIVE_GAMES,
  async () => {
    const { data } = await getGameApiRequest(ApiRoute.PLAYERS_ACTIVE_GAMES, {});
    return data as { games: PlayerActiveGames };
  },
);

export const fetchPlayerIsAdmin = createAsyncThunk(
  ApiRoute.PLAYER_IS_ADMIN,
  async () => {
    const { data } = await getGameApiRequest(ApiRoute.PLAYER_IS_ADMIN, {});
    return data as { isAdmin: boolean };
  },
);

export const sendMessage = createAsyncThunk(
  ApiRoute.SEND_MESSAGE,
  async (queryParams: {
    gameID: string;
    countryID: string;
    toCountryID: string;
    message: string;
  }) => {
    const response = await postGameApiRequest(
      ApiRoute.SEND_MESSAGE,
      queryParams,
    );
    return response.data as unknown as GameMessages;
  },
);

export const setVoteStatus = createAsyncThunk(
  ApiRoute.GAME_SETVOTE,
  async (queryParams: {
    countryID: string;
    gameID: string;
    vote: string;
    voteOn: string;
  }) => {
    const { data } = await postGameApiRequest(
      ApiRoute.GAME_SETVOTE,
      queryParams,
    );
    return data;
  },
);

export const markMessagesSeen = createAsyncThunk(
  ApiRoute.MESSAGES_SEEN,
  async (queryParams: {
    countryID: string;
    gameID: string;
    seenCountryID: string;
  }) => {
    const { data } = await postGameApiRequest(
      ApiRoute.MESSAGES_SEEN,
      queryParams,
    );
    return data;
  },
);

export const markBackFromLeft = createAsyncThunk(
  ApiRoute.SET_BACK_FROM_LEFT,
  async (queryParams: { countryID: string; gameID: string }) => {
    const { data } = await postGameApiRequest(
      ApiRoute.SET_BACK_FROM_LEFT,
      queryParams,
    );
    return data;
  },
);

export const saveOrders = createAsyncThunk(
  "game/submitOrders",
  async (data: OrderSubmission, thunkAPI) => {
    const formData = new FormData();
    formData.set("orderUpdates", JSON.stringify(data.orderUpdates));
    formData.set("context", data.context);
    formData.set("contextKey", data.contextKey);
    let response;
    try {
      response = await submitOrders(formData, data.queryParams);
    } catch (e) {
      console.log("Exception submitting orders");
      console.log(e);
      const result: SavedOrdersConfirmation = {
        invalid: true,
        notice:
          "Error saving orders, no server response or network connection timed out",
        orders: {},
      };
      // Reject this value because it indicates an error with the connection itself
      return thunkAPI.rejectWithValue(result);
    }
    // console.log({ response });
    // Sometimes webdip sends back a response that doesn't have the "x-json" header at all,
    // instead it has an HTML page displaying an error message.
    // We're of course not going to try to render a whole HTML page, so instead we simply
    // manually construct an error message.
    const confirmation: string = response.headers["x-json"];
    if (!confirmation) {
      const result: SavedOrdersConfirmation = {
        invalid: true,
        notice:
          "Error saving orders, no server response or game already advanced to next phase",
        orders: {},
      };
      // Return this value normally without rejecting it since it's not a problem
      // with the connection, it's webdip declaring our order illegal or something like that.
      return result;
    }
    const parsed: SavedOrdersConfirmation = JSON.parse(
      confirmation.substring(1, confirmation.length - 1),
    );
    return parsed;
  },
);

export const loadGameData =
  (gameID: string, countryID?: string) => async (dispatch) => {
    await Promise.all([
      dispatch(fetchGameData({ gameID, countryID })),
      dispatch(fetchGameStatus({ gameID, countryID })),
      dispatch(fetchPlayerActiveGames()),
    ]);
  };

export const loadGame = (gameID: string) => async (dispatch) => {
  const response = await dispatch(
    fetchGameOverview({
      gameID,
    }),
  );
  if (response.payload) {
    const countryID = response.payload.user?.member.countryID;
    const { phase } = response.payload;
    if (phase === "Pre-game") {
      return;
    }

    await loadGameData(gameID, countryID);
  }
};

/**
 * createSlice handles state changes properly without reassiging state, but
 * eslint does not know this. therefore, no-param-reassign is disabled for
 * the createSlice block of code below or functions therein.
 */

/* eslint-disable no-param-reassign */

const gameApiSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    resetOrder,
    updateOrder(state, action) {
      updateOrder(state, action.payload);
    },
    updateOrdersMeta(state, action: UpdateOrdersMetaAction) {
      updateOrdersMeta(state, action.payload);
    },
    updateTerritoriesMeta(state, action) {
      state.territoriesMeta = action.payload;
    },
    processMapClick,
    processMessagesSeen(state, action) {
      const countryID = action.payload;
      state.messages.newMessagesFrom = state.messages.newMessagesFrom.filter(
        (e) => e !== countryID,
      );
      state.messages.messages
        .filter((m) => [m.fromCountryID, m.toCountryID].includes(countryID))
        .forEach((m) => {
          m.status = MessageStatus.READ;
        });
    },
    setNeedsGameOverview(state, action) {
      state.needsGameOverview = action.payload;
    },
    setNeedsGameData(state, action) {
      state.needsGameData = action.payload;
    },
    changeViewedPhaseIdxBy(state, action) {
      let newIdx = state.viewedPhaseState.viewedPhaseIdx + action.payload;
      newIdx = Math.min(newIdx, state.status.phases.length - 1);
      newIdx = Math.max(newIdx, 0);
      state.viewedPhaseState.viewedPhaseIdx = newIdx;
      state.viewedPhaseState.latestPhaseViewed = Math.max(
        state.viewedPhaseState.latestPhaseViewed,
        newIdx,
      );
    },
    setViewedPhase(state, action) {
      const newIdx = action.payload;
      state.viewedPhaseState.viewedPhaseIdx = newIdx;
      state.viewedPhaseState.latestPhaseViewed = Math.max(
        state.viewedPhaseState.latestPhaseViewed,
        newIdx,
      );
    },
    setViewedPhaseToLatestPhaseViewed(state) {
      state.viewedPhaseState.viewedPhaseIdx =
        state.viewedPhaseState.latestPhaseViewed;
    },
    setViewedPhaseToLatest(state) {
      state.viewedPhaseState.viewedPhaseIdx = state.status.phases.length - 1;
    },
    setAlert(state, action) {
      setAlert(state.alert, action.payload);
    },
    hideAlert(state, action) {
      state.alert.visible = false;
    },
    selectMessageCountryID(state, action) {
      state.messages.countryIDSelected = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      // fetchGameData
      .addCase(fetchGameData.pending, (state) => {
        // console.log("fetchGameData pending!");
        state.apiStatus = "loading";
      })
      .addCase(fetchGameData.fulfilled, fetchGameDataFulfilled)
      .addCase(fetchGameData.rejected, (state, action) => {
        // console.log("fetchGameData rejected!");
        handleGetFailed(state, action);
      })
      // fetchGameOverview
      .addCase(fetchGameOverview.pending, (state) => {
        state.outstandingOverviewRequests = true;
        state.apiStatus = "loading";
      })
      .addCase(fetchGameOverview.fulfilled, fetchGameOverviewFulfilled)
      .addCase(fetchGameOverview.rejected, (state, action) => {
        state.outstandingOverviewRequests = false;
        handleGetFailed(state, action);
      })
      // fetchGameStatus
      .addCase(fetchGameStatus.pending, (state) => {
        state.apiStatus = "loading";
      })
      .addCase(fetchGameStatus.fulfilled, fetchGameStatusFulfilled)
      .addCase(fetchGameStatus.rejected, (state, action) => {
        handleGetFailed(state, action);
      })
      .addCase(fetchPlayerActiveGames.fulfilled, (state, action) => {
        if (typeof action.payload.games !== "undefined") {
          handleGetSucceeded(state);
          state.activeGames = action.payload.games;
        } else {
          handleGetFailed(state, action);
        }
      })
      .addCase(fetchPlayerIsAdmin.fulfilled, (state, action) => {
        if (typeof action.payload) {  
          state.admin = true;
        } else {
          state.admin = false;
        }
      })
      // saveOrders
      .addCase(saveOrders.pending, saveOrdersPending)
      .addCase(saveOrders.fulfilled, saveOrdersFulfilled)
      .addCase(saveOrders.rejected, saveOrdersRejected)
      // setVoteStatus
      .addCase(setVoteStatus.pending, (state, action) => {
        state.apiStatus = "loading";
        const { vote, voteOn } = action.meta.arg;
        state.votingInProgress = { ...state.votingInProgress, [vote]: voteOn };
      })
      .addCase(setVoteStatus.fulfilled, (state, action) => {
        const { vote } = action.meta.arg;
        state.votingInProgress = { ...state.votingInProgress, [vote]: null };
        handlePostSucceeded(state);
        if (state.overview.user) {
          const newVotes = action.payload.split(",").filter((s) => !!s);
          state.overview.user.member.votes = newVotes;
          state.overview.members.forEach((member) => {
            if (member.countryID === state.overview.user?.member.countryID) {
              member.votes = newVotes;
            }
          });
        }
      })
      .addCase(setVoteStatus.rejected, (state, action) => {
        handlePostFailed(state, "Error sending vote, network connection issue");
        const { vote } = action.meta.arg;
        state.votingInProgress = { ...state.votingInProgress, [vote]: null };
      })
      .addCase(markBackFromLeft.fulfilled, (state, action) => {
        state.status.status = "Playing";
      })
      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        if (action.payload) {
          handlePostSucceeded(state);
          const { messages } = action.payload;
          const allMessages = mergeMessageArrays(
            state.messages.messages,
            messages,
          );
          state.messages.messages = allMessages;
        } else {
          handlePostFailed(
            state,
            "Error sending message, network connection issue",
          );
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        handlePostFailed(
          state,
          "Error sending message, network connection issue",
        );
      })
      // Fetch Game Messages
      .addCase(fetchGameMessages.pending, (state, action) => {
        state.outstandingMessageRequests = true;
      })
      .addCase(fetchGameMessages.rejected, (state, action) => {
        state.outstandingMessageRequests = false;
        handleGetFailed(state, action);
      })
      .addCase(fetchGameMessages.fulfilled, (state, action) => {
        state.outstandingMessageRequests = false;
        if (action.payload) {
          handleGetSucceeded(state);
          const { messages, newMessagesFrom, time } = action.payload;
          if (messages) {
            const messagesWithStatus = messages.map((m) => {
              return {
                ...m,
                status:
                  // eslint-disable-next-line no-nested-ternary
                  newMessagesFrom.includes(m.fromCountryID) ||
                  newMessagesFrom.includes(m.toCountryID) // needed for ALL
                    ? state.messages.time === 0
                      ? MessageStatus.UNKNOWN
                      : MessageStatus.UNREAD
                    : MessageStatus.READ,
              };
            });
            const allMessages = mergeMessageArrays(
              state.messages.messages,
              messagesWithStatus,
            );
            if (state.messages.messages.length !== allMessages.length) {
              state.messages.messages = allMessages;
            }
          }
          if (newMessagesFrom) {
            // Only use the new newMessagesFrom if it has distinct values
            // Otherwise, use the old value to preserve reference equality
            // so that selectors recognize nothing changed and less of the UI
            // needs to redraw
            if (
              !shallowArraysEqual(
                state.messages.newMessagesFrom,
                newMessagesFrom,
              )
            ) {
              state.messages.newMessagesFrom = newMessagesFrom;
            }
          }
          if (time) {
            // console.log(`Messages fetched at time=${time}`);
            state.messages.time = time;
          }
        } else {
          handleGetFailed(state, action);
        }
      });
  },
});
/* eslint-enable no-param-reassign */

export const gameApiSliceActions = gameApiSlice.actions;

export const gameApiStatus = ({ game: { apiStatus } }: RootState): ApiStatus =>
  apiStatus;
export const gameData = ({ game: { data } }: RootState): GameDataResponse =>
  data;
export const gameError = ({ game: { error } }: RootState): GameErrorResponse =>
  error;
export const gameOverview = ({
  game: { overview },
}: RootState): GameOverviewResponse => overview;
export const gameStatus = ({
  game: { status },
}: RootState): GameStatusResponse => status;
export const gameOrdersMeta = ({
  game: { ordersMeta },
}: RootState): OrdersMeta => ordersMeta;
export const gameOrder = ({ game: { order } }: RootState): OrderState => order;
export const gameTerritoriesMeta = ({
  game: { territoriesMeta },
}: RootState): TerritoriesMeta => territoriesMeta;
// gameMessages considered harmful, because part of the GameMessages object is a
// counter that tracks the last query timestamp, which means that if you use this
// selector rather than a more specific one, your component will update basically
// every time the server is queries for messages, regardless of whether
// the messages changed or not.
// export const gameMessages = ({ game: { messages } }: RootState): GameMessages =>
//  messages;
export const gameMaps = ({ game: { maps } }: RootState) => maps;
export const gameViewedPhase = ({
  game: { viewedPhaseState },
}: RootState): ViewedPhaseState => viewedPhaseState;
export const gameLegalOrders = ({ game: { legalOrders } }: RootState) =>
  legalOrders;
export const gameAlert = ({ game: { alert } }: RootState) => alert;
export const playerActiveGames = ({ game: { activeGames } }: RootState) =>
  activeGames;
export const isAdmin = ({ game: { admin } }: RootState) =>
  admin;
export default gameApiSlice.reducer;
