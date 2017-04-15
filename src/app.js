var restify = require('restify');
var builder = require('botbuilder');

var mathOverrides = require('./helpers/mathOverrides');

var messageProcessor = require('./gameLogic/messageProcessor');
var welcomeBot = require('./botDialogs/welcomeBot');
var lobbyBot = require('./botDialogs/lobbyBot');
var gameBot = require('./botDialogs/gameBot');

var dungeonMaster = require('./gameLogic/dungeonMaster');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var microsoftLuisAppId = process.env['MicrosoftLuisAppId'];
var microsoftLuisAppKey = process.env['MicrosoftLuisAppKey'];

//this key is registered by Deni
var LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/' + microsoftLuisAppId + '?subscription-key=' + microsoftLuisAppKey +'&timezoneOffset=0.0&verbose=true&q=';
var bot = new builder.UniversalBot(connector);
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
server.post('/api/messages', connector.listen());

//all Microsoft bot framework API's go here
var botFrameworkApi = {
    bot: bot,
    builder: builder,
    recognizer: recognizer
};

//all RPG-Chat-bot API methods go here
var rpgChatBotApi = {
    sessionCache: {},
    gameList: {},
    dungeonMaster: null
};

//initialize the bots
welcomeBot.init(botFrameworkApi, rpgChatBotApi);
lobbyBot.init(botFrameworkApi, rpgChatBotApi);
gameBot.init(botFrameworkApi, rpgChatBotApi);
rpgChatBotApi.dungeonMaster = dungeonMaster.init(botFrameworkApi, rpgChatBotApi);
rpgChatBotApi.messageProcessor = messageProcessor.init(rpgChatBotApi);