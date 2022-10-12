enum ApiRoute {
  // fetch
  GAME_OVERVIEW = "game/overview",
  GAME_DATA = "game/data",
  GAME_STATUS = "game/status",
  GAME_MESSAGES = "game/getmessages",
  PLAYERS_ACTIVE_GAMES = "players/active_games",
  PLAYER_IS_ADMIN = "players/isAdmin",
  // post
  SEND_MESSAGE = "game/sendmessage",
  ANNOTATE_MESSAGE = "game/annotatemessage",
  MESSAGES_SEEN = "game/messagesseen",
  GAME_SETVOTE = "game/setvote",
  SET_BACK_FROM_LEFT = "game/markbackfromleft",
  WEBSOCKETS_AUTHENTICATION = "websockets/authentication",
}

export default ApiRoute;
