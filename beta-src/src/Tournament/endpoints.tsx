
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

export async function fetchAllPlayers() {
  try {
    const players = await getGameApiRequest(
      "players/all",
      {hello: "world"}
    );

    return players.data;

  } catch(e) {
    console.log('Request to fetch players failed, e:', e);
    return [];
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

    return ongoingGames.data || []; // Array with IDs for all ongoing games

  } catch(e) {
    console.log('Request to fetch ongoinggames failed, e:', e);
    return [];
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

    if (!waitingGames.data) {
      console.log('waiting games data rsponse empty, debug:', waitingGames);
    }

    return waitingGames.data ? waitingGames.data : []; // Array with IDs for all ongoing games

  } catch(e) {
    console.log('Request to fetch ongoinggames failed, e:', e);
    return [];
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

    return overview.data.data;

  } catch(e) {
    console.log('Request to fetch ongoinggames failed, e:', e);
    return {};
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
    return [];
  }
}

/**
 *
 **/
export async function fetchAllGameDataforIDs(IDs=[]) {

  if (!Array.isArray(IDs)) {
    console.error("Previous API call to fetch IDs failed. Fetch Game data receive non-array and will skip for now.");

    return [];
  }

  try {

    const result = await Promise
      .all(IDs.map(fetchGameOverview));

    return result;

  } catch(e) {
    console.log('Request to fetch all game data by IDs failed, e:', e);
    return [];
  }

}

export async function fetchWaitingPlayers() {
  try {
    const players = await getGameApiRequest(
      "players/waiting",
      {hello: "world"}
    );

    if (!players.data) {
      console.log('waiting players data response empty, debug:', players);
    }

    return players.data ? players.data : [];

  } catch(e) {
    console.log('Request to fetch players failed, e:', e);
    return [];
  }
}
