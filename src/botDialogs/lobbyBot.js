/**
 * Shows the user all active games and allows him to create a new game or join an existing one
 *
 * @providesModule LobbyBot
 */

function initLobbybot(botFrameworkApi, rpgChatBotApi) {
    function welcomeToLobby(session) {
        //open sessions bug fix
        if (!rpgChatBotApi.sessionCache[session.userData.sessionId]) {
            rpgChatBotApi.sessionCache[session.userData.sessionId] = session;
        }
        botFrameworkApi.builder.Prompts.text(session, rpgChatBotApi.messages.lobby.welcome);
        session.send(rpgChatBotApi.messages.lobby.options);
    }

    function lobbyOptions(session) {
        botFrameworkApi.builder.Prompts.text(session, rpgChatBotApi.messages.lobby.options);
    }
    
    function lobbyActionParser(session, results) {
        if (results.response.indexOf('new game') >= 0) {
            session.send(rpgChatBotApi.messages.lobby.newGame);
            session.userData.gameId = rpgChatBotApi.dungeonMaster.createNewGame(session.userData.sessionId, session.userData.name);
            session.replaceDialog('/game-wait-for-turn');
            return;
        }

        if (results.response.indexOf('join') >= 0) {
            //TODO add join game parser
            var _gameID = results.response.replace('join', '').trim();

            session.userData.gameId = rpgChatBotApi.dungeonMaster.joinGame(session.userData.sessionId, session.userData.name, _gameID);

            if (session.userData.gameId) {
                session.send(rpgChatBotApi.messages.lobby.joiningGame);
                session.replaceDialog('/game-wait-for-turn');
                return;
            } else {
                session.send(rpgChatBotApi.messages.lobby.gameIdNotFound);
                session.replaceDialog('/game-lobby-repeat');
            }
        }

        if (results.response.indexOf('list') >= 0) {
            //TODO print active sessions
            
        }

        session.send(rpgChatBotApi.messages.lobby.noAction);
        session.replaceDialog('/game-lobby-repeat');
    }

    botFrameworkApi.bot.dialog('/game-lobby', [
        welcomeToLobby,
        lobbyActionParser
    ]);

    botFrameworkApi.bot.dialog('/game-lobby-repeat', [
        lobbyOptions,
        lobbyActionParser
    ]);
    
}

module.exports = {
    init: initLobbybot
};