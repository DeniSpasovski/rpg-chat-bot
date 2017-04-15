/**
 * All dialogs related to a single game, acction parsing next move.
 *
 * @providesModule GameBot
 */

function initGameBot(botFrameworkApi, rpgChatBotApi) {
    botFrameworkApi.bot.dialog('/game-wait-for-turn', [
        function (session) {
            //TODO add logic to show that you need to wait
            botFrameworkApi.builder.Prompts.text(session, rpgChatBotApi.messages.gameMaster.yourMove);
        },
        function (session, results) {
            botFrameworkApi.recognizer.recognize(session, function (err, intents, entities) {
                rpgChatBotApi.dungeonMaster.interpretPlayerAction(session, results.response, intents);
                session.replaceDialog('/game-wait-for-turn');
            });
        }
    ]);
}

module.exports = {
    init: initGameBot
};