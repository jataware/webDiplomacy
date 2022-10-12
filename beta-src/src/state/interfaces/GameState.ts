import GameDataResponse from "./GameDataResponse";
import GameErrorResponse from "./GameErrorResponse";
import GameOverviewResponse from "./GameOverviewResponse";
import GameStateMaps from "./GameStateMaps";
import GameStatusResponse from "./GameStatusResponse";
import GameMessages from "./GameMessages";
import OrderState from "./OrderState";
import OrdersMeta from "./SavedOrders";
import TerritoriesMeta from "./TerritoriesState";
import ViewedPhaseState from "./ViewedPhaseState";
import { LegalOrders } from "../../utils/state/gameApiSlice/extraReducers/fetchGameData/precomputeLegalOrders";
import GameAlert from "./GameAlert";
import { OrderSubmissionUserIntent } from "../../interfaces/state/OrderSubmission";
import Vote from "../../enums/Vote";
import PlayerActiveGames from "./PlayerActiveGames";

export type ApiStatus = "idle" | "loading" | "succeeded" | "failed";

export interface GameState {
  apiStatus: ApiStatus;
  data: GameDataResponse; // Directly from API
  error: GameErrorResponse;
  maps: GameStateMaps; // Computed as a function of GameDataResponse
  overview: GameOverviewResponse; // Directly from API
  ordersMeta: OrdersMeta; // Stateful, tracks user order input
  ownUnits: string[]; // Computed as a function of GameDataResponse
  territoriesMeta: TerritoriesMeta;
  viewedPhaseState: ViewedPhaseState; // Stateful, tracks what phase the user views.
  status: GameStatusResponse; // Directly from API
  messages: GameMessages;
  outstandingOverviewRequests: boolean; // Stateful, restricts querying api for overview
  outstandingMessageRequests: boolean; // Stateful, restricts querying api for messages
  savingOrdersInProgress: OrderSubmissionUserIntent | null; // Stateful, non-null when we have an active request to save orders.
  votingInProgress: { [key in Vote]: string | null }; // Stateful, non-null "Yes" or "No" values indicate we have an active vote query to set vote to "Yes" or to "No".
  needsGameOverview: boolean; // Stateful, determines when game overview needs urgent refresh
  needsGameData: boolean; // Stateful, determines when game data has changed and needs refresh
  order: OrderState;
  legalOrders: LegalOrders; // Computed as a function of GameOverviewResponse, GameDataResponse, GameStateMaps
  alert: GameAlert;
  activeGames: PlayerActiveGames;
  admin: boolean;
  numConsecutiveGetFailures: number; // How many consecutive GET API requests to the server were failures.
}
