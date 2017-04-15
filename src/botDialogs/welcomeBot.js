/**
 * Initial bot, welcomes the user, and sends him to lobby bot after learning the user name
 *
 * @providesModule WelcomeBot
 */

const uuidV1 = require('uuid/v1');

function initWelcomeBot(botFrameworkApi, rpgChatBotApi) {
    botFrameworkApi.bot.dialog('/', [
        function (session, args, next) {
            if (!session.userData.name) {
                session.beginDialog('/profile');
            } else {
                next();
            }
        },
        function (session, results) {
            //session.send('Hello %s! Welcome to the dungeon!', session.userData.name);

            //TODO find cool picture
            var msg = new botFrameworkApi.builder.Message(session)
                .addAttachment({
                    contentUrl: 'https://wiki.godvillegame.com/images/1/1e/Dungeon.jpg',
                    contentType: 'image/png',
                    name: rpgChatBotApi.messages.welcome.hello
                });

            session.send(msg);

            session.userData.sessionId = session.userData.id || uuidV1();
            rpgChatBotApi.sessionCache[session.userData.sessionId] = session;
            session.beginDialog('/game-lobby');
        }
    ]);

    botFrameworkApi.bot.dialog('/profile', [
        function (session) {
            botFrameworkApi.builder.Prompts.text(session, 'Hi! What is your name?');
        },
        function (session, results) {
            session.userData.name = results.response;
            session.endDialog();
        }
    ]);
}

module.exports = {
    init: initWelcomeBot
};