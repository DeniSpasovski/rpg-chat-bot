const uuidV1 = require('uuid/v1');

var dungeon = require('./models/dungeon');
var actionProcessor = require('./actionProcessor');
var gameObjectTypes = require('./enums/gameObjectTypes');

function generateNewDungeon() {
    return new dungeon(3);
}

function dungeonMaster(botFrameworkApi, rpgChatBotApi) {
    var _actionProcessor = new actionProcessor();

    function createNewGame(playerId, playerName) {
        var gameId = uuidV1();
        rpgChatBotApi.gameList[gameId] = generateNewDungeon();
        sendMessageToPlayer(playerId, rpgChatBotApi.messages.gameMaster.name, rpgChatBotApi.messages.gameMaster.newGameId.replace("%s", gameId));
        this.joinGame(playerId, playerName, gameId);
        return gameId;
    }

    function joinGame(playerId, playerName, gameId) {
        if (rpgChatBotApi.gameList[gameId] && !rpgChatBotApi.gameList[gameId].gameOver) {
            rpgChatBotApi.gameList[gameId].addPlayer(playerId, playerName, gameObjectTypes.Player);
            sendMessage(gameId, playerId, rpgChatBotApi.messages.gameMaster.name, rpgChatBotApi.messages.gameMaster.joinedGame.replace("%s", playerName));

            var newTurnStory = generateTurnStory(gameId);
            sendMessagesToPlayer(playerId, rpgChatBotApi.messages.gameMaster.turnStory, newTurnStory);
            return gameId;
        }

        return null;
    }

    //interprets single player action
    function interpretPlayerAction(session, response, intents) {
        var intent = intents.intent;
        var entities = intents.entities;
        var gameId = session.userData.gameId;
        var playerId = session.userData.sessionId;

        if (!rpgChatBotApi.gameList[gameId] || (rpgChatBotApi.gameList[gameId] && rpgChatBotApi.gameList[gameId].gameOver)) {
            session.send(rpgChatBotApi.messages.lobby.notFound, session.userData.gameId);
            session.replaceDialog('/game-lobby');
            return;
        }

        if (!rpgChatBotApi.gameList[gameId].getPlayerAction(playerId)) {
            if (rpgChatBotApi.gameList[gameId].getPlayer(playerId).isAlive()) {
                if (intent == "help") {
                    sendMessagesToPlayer(playerId, rpgChatBotApi.messages.gameMaster.name, rpgChatBotApi.multiMessage.help);
                } else {
                    var action = _actionProcessor.validateAction(intent, entities);
                    if (action.error) {
                        session.send(action.error, action);
                    } else {
                        rpgChatBotApi.gameList[gameId].pushAction(playerId, action);
                        session.send(rpgChatBotApi.messages.gameMaster.actionChoosen, action.print());
                        runGameLoop(gameId);
                    }
                }
            } else {
                session.send(rpgChatBotApi.messages.gameMaster.deadPlayer);
            }
        } else {
            session.send(rpgChatBotApi.messages.gameMaster.actionCantBeChoosen);
        }
    }

    //checks if all players chose action and iterates game loop
    function runGameLoop(gameId) {
        //setTimeout to get it out of the stack so that user messages flow
        setTimeout(function (gameId) {
            var dungeon = rpgChatBotApi.gameList[gameId];
            if (_actionProcessor.checkIfAllPlayersChooseAction(dungeon)) {
                var gameLoopStory = _actionProcessor.runGameLoop(dungeon);
                broadcastMessages(gameId, rpgChatBotApi.messages.gameMaster.actionReplay, gameLoopStory);
                if (dungeon.arePlayerAlive()) {
                    if (dungeon.isPrinceAlive()) {
                        var newTurnStory = generateTurnStory(gameId);
                        broadcastMessages(gameId, rpgChatBotApi.messages.gameMaster.turnStory, newTurnStory);
                        broadcastMessages(gameId, rpgChatBotApi.messages.gameMaster.name, [rpgChatBotApi.messages.gameMaster.yourMove]);
                    } else {
                        dungeon.gameOver = true;
                        broadcastMessages(gameId, rpgChatBotApi.messages.gameMaster.name, [rpgChatBotApi.messages.gameMaster.gameOverYouWin]);
                        sendPicture(gameId, "http://legogenre.com/wp-content/uploads/2015/03/PockyLU_Lego_BlueLion_Castle_Army.jpg", rpgChatBotApi.messages.gameMaster.gameOverYouWin);
                    }
                } else {
                    dungeon.gameOver = true;
                    broadcastMessages(gameId, rpgChatBotApi.messages.gameMaster.name, [rpgChatBotApi.messages.gameMaster.gameOverYouLoose]);
                    sendPicture(gameId, "http://legogenre.com/wp-content/uploads/2013/06/Diegoboy_TheLannistersSendTheirRegards.jpg", rpgChatBotApi.messages.gameMaster.gameOverYouLoose);
                }
            }
        }, 10, gameId);
    }

    function generateTurnStory(gameId) {
        var dungeon = rpgChatBotApi.gameList[gameId];
        var activeMapSpots = dungeon.getActiveMapSpots();
        var messages = activeMapSpots.map(function (mapSpot) {
            var message = mapSpot.players.map(function (player) {
                return player.playerName;
            }).join(", ");

            if (mapSpot.players.length > 1) {
                message += " " + rpgChatBotApi.messages.gameStory.multiPlayer;
            } else {
                message += " " + rpgChatBotApi.messages.gameStory.singlePlayer;
            }

            message += " in the ";


            if (dungeon.gameMap[mapSpot.position.x] && dungeon.gameMap[mapSpot.position.x][mapSpot.position.y]) {
                message += dungeon.gameMap[mapSpot.position.x][mapSpot.position.y].description;
            } else {
                message += mapSpot.players.length > 1 ? rpgChatBotApi.messages.locations.deathValleyMultiPlayer : rpgChatBotApi.messages.locations.deathValleySinglePlayer;
            }

            message += ". ";

            if (mapSpot.npcs.length > 0) {
                if (mapSpot.npcs.length == 1) {
                    if (mapSpot.npcs[0].gameObjectType === gameObjectTypes.Prince.name) {
                        if (mapSpot.players.length > 1) {
                            message += rpgChatBotApi.messageProcessor.chooseRandomMessage(rpgChatBotApi.multiMessage.gameStory.foundPrinceMulti);
                        } else {
                            message += rpgChatBotApi.messageProcessor.chooseRandomMessage(rpgChatBotApi.multiMessage.gameStory.foundPrinceAlone);
                        }
                    } else {
                        message += rpgChatBotApi.messageProcessor.chooseRandomMessage(rpgChatBotApi.multiMessage.gameStory.npcNearby) + mapSpot.npcs[0].gameObjectType;
                        message += rpgChatBotApi.messageProcessor.chooseRandomMessage(rpgChatBotApi.multiMessage.gameStory.npcAction);
                    }
                } else {
                    message += rpgChatBotApi.messageProcessor.chooseRandomMessage(rpgChatBotApi.multiMessage.gameStory.multiNPC);
                }
            } else {
                message += rpgChatBotApi.messageProcessor.chooseRandomMessage(rpgChatBotApi.multiMessage.gameStory.noNPC);
            }

            ///TODO debug only
            message += "\n coordinates " + mapSpot.position.x + " " + mapSpot.position.y;

            return message;
        });
        var currentTurnMessage = rpgChatBotApi.messages.gameMaster.turn + dungeon.turn;
        return [currentTurnMessage].concat(messages);
    }

    function sendPicture(gameId, pictureUrl, pictureName) {
        var dungeon = rpgChatBotApi.gameList[gameId];
        dungeon.getPlayerList().forEach(function (player) {
            if (rpgChatBotApi.sessionCache[player.playerId]) {
                var msg = new botFrameworkApi.builder.Message(rpgChatBotApi.sessionCache[player.playerId])
                    .addAttachment({
                        contentUrl: pictureUrl,
                        contentType: 'image/png',
                        name: pictureName
                    });
                rpgChatBotApi.sessionCache[player.playerId].send(msg);
            }
        });
    }


    function sendMessage(gameId, playerId, userName, message) {
        var dungeon = rpgChatBotApi.gameList[gameId];
        dungeon.getPlayerList().forEach(function (player) {
            if (player.playerId != playerId && rpgChatBotApi.sessionCache[player.playerId]) {
                rpgChatBotApi.sessionCache[player.playerId].send(userName + ': ' + message);
            }
        });
    }

    function sendMessageToPlayer(playerId, userName, message) {
        if (rpgChatBotApi.sessionCache[playerId]) {
            rpgChatBotApi.sessionCache[playerId].send(userName + ': ' + message);
        }
    }

    function sendMessagesToPlayer(playerId, userName, messages) {
        if (rpgChatBotApi.sessionCache[playerId]) {
            rpgChatBotApi.sessionCache[playerId].send(userName + ':\n\n' + messages.join("\n\n"));
        }
    }

    function broadcastMessages(gameId, title, messages) {
        var dungeon = rpgChatBotApi.gameList[gameId];
        dungeon.getPlayerList().forEach(function (player) {
            if (rpgChatBotApi.sessionCache[player.playerId]) {
                rpgChatBotApi.sessionCache[player.playerId].send(title + ':\n\n' + messages.join("\n\n"));
            }
        });
    }

    function broadcastMessage(gameId, userName, message) {
        var dungeon = rpgChatBotApi.gameList[gameId];
        dungeon.getPlayerList().forEach(function (player) {
            if (rpgChatBotApi.sessionCache[player.playerId]) {
                rpgChatBotApi.sessionCache[player.playerId].send(userName + ': ' + message);
            }
        });
    }

    this.createNewGame = createNewGame;
    this.interpretPlayerAction = interpretPlayerAction;
    this.joinGame = joinGame;
    this.runGameLoop = runGameLoop;

    return this;
}

module.exports = {
    init: dungeonMaster
};