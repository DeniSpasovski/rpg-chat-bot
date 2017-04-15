
var actionList = require('./enums/actionList');
var botMessages = require('./enums/botMessages');
var gameObjectTypes = require('./enums/gameObjectTypes');
var userAction = require('./models/userAction');
var messageProcessor = require('./messageProcessor');

function actionProcessor() {
    return this;
}

actionProcessor.prototype.validateAction = function (intent, entities) {
    if (actionList[intent] && actionList[intent].isValid) {
        var subAction = null;
        var subActionName = actionList[intent].entityType || "";
        if (actionList[intent].entities && actionList[intent].entityType) {
            var entity = entities.find((obj) => { return obj.type === actionList[intent].entityType; });
            if (entity && entity.entity && actionList[intent].entities.indexOf(entity.entity) >= 0) {
                subAction = entity.entity;
            } else {
                subAction = actionList[intent].defaultEntity;
            }
        }

        return new userAction(intent, actionList[intent].name, subActionName, subAction);
    } else {
        return {
            error: "Invalid Action."
        };
    }
};

const gameActions = {
    "action.attack": function (dungeon, player, action, mapSpot, target) {
        var message = "";
        var interactionList = dungeon.getCurrentTurnInteractions();
        if (mapSpot.npcs.length) {
            var _aliveNpcs = mapSpot.npcs.filter(function (obj) { return obj.isAlive() });
            if (_aliveNpcs) {
                var _target = target || _aliveNpcs[0];
                var _attackSuccess = player.attack(_target);
                interactionList[_target.playerId] = interactionList[_target.playerId] || [];
                interactionList[_target.playerId].push({
                    playerId: player.playerId,
                    intent: action.intent,
                    success: _attackSuccess
                });
                if (!_target.isAlive()) {
                    message += player.getPlayerName() + messageProcessor.chooseRandomMessage(botMessages.multiMessage.gameAction.attackKill).replace("%s", _target.getPlayerName());
                    player.gainAttackSkill(10, 0.1);
                } else {
                    if (_attackSuccess) {
                        message += player.getPlayerName() + messageProcessor.chooseRandomMessage(botMessages.multiMessage.gameAction.attackWound).replace("%s", _target.getPlayerName());
                        player.gainAttackSkill(2, 0.02);
                    } else {
                        message += player.getPlayerName() + messageProcessor.chooseRandomMessage(botMessages.multiMessage.gameAction.attackMiss).replace("%s", _target.getPlayerName());
                    }
                }
            } else {
                message += player.getPlayerName() + messageProcessor.chooseRandomMessage(botMessages.multiMessage.gameAction.attackDead);
                player.gainAttackSkill(5, 0.05);
            }
        } else {
            message += player.getPlayerName() + messageProcessor.chooseRandomMessage(botMessages.multiMessage.gameAction.attackEmpty);
        }
        return message;
    },
    "action.greet": function (dungeon, player, action, mapSpot) {
        var interactionList = dungeon.getCurrentTurnInteractions();
        return "";
    },
    "action.run": function (dungeon, player, action, mapSpot) {
        var message = "";
        if (mapSpot.npcs.length) {
            message += messageProcessor.chooseRandomMessage(botMessages.multiMessage.gameAction.enemiesInSight);
        } else {
            message += messageProcessor.chooseRandomMessage(botMessages.multiMessage.gameAction.noEnemiesInSight);
        }

        if (Math.randomInt(0, 2) === 0) {
            player.position.y += Math.randomInt(0, 2) === 0 ? -2 : 2;
        } else {
            player.position.x += Math.randomInt(0, 2) === 0 ? -2 : 2;
        }

        message += player.getPlayerName() + messageProcessor.chooseRandomMessage(botMessages.multiMessage.gameAction.run);

        if (mapSpot.npcs.length && (Math.randomInt(0, 2) === 0 || (mapSpot.position.x == 0 && mapSpot.position.y == 0))) {
            message += messageProcessor.chooseRandomMessage(botMessages.multiMessage.gameAction.runJoke);
        }

        //after move check if he is going in wrong direction
        dungeon.thereBeDragons(player);

        return message;
    },
    "action.standground": function (dungeon, player, action, mapSpot) {
        var message = "";
        if (mapSpot.npcs.length) {
            message += messageProcessor.chooseRandomMessage(botMessages.multiMessage.gameAction.enemiesInSight);
        } else {
            message += messageProcessor.chooseRandomMessage(botMessages.multiMessage.gameAction.noEnemiesInSight);
        }
        message += player.getPlayerName() + messageProcessor.chooseRandomMessage(botMessages.multiMessage.gameAction.standGround);

        if (!mapSpot.npcs.length) {
            if (player.gainEnergy()) {
                message += botMessages.messages.gameAction.gainEnergy;
            } else {
                message += messageProcessor.chooseRandomMessage(botMessages.multiMessage.gameAction.maxEnergy);
            }
        }

        return message;
    },
    "action.travel": function (dungeon, player, action, mapSpot) {
        if (action.subAction && action.subAction !== actionList["action.travel"].defaultEntity) {
            switch (action.subAction) {
                case "north": player.position.y--; break;
                case "south": player.position.y++; break;
                case "east": player.position.x++; break;
                case "west": player.position.x--; break;
            }
        } else {
            if (Math.randomInt(0, 2) === 0) {
                player.position.y += Math.randomInt(0, 2) === 0 ? -1 : 1;
            } else {
                player.position.x += Math.randomInt(0, 2) === 0 ? -1 : 1;
            }
        }

        //after move check if he is going in wrong direction
        dungeon.thereBeDragons(player);

        return player.getPlayerName() + botMessages.messages.gameAction.move + action.subAction + botMessages.messages.gameAction.moveDirection;
    }
};

function processPlayerAction(dungeon, player, action, mapSpot) {
    return gameActions[action.intent](dungeon, player, action, mapSpot);
};

function processNPCAction(dungeon, npc, mapSpot) {
    var interactionList = dungeon.getCurrentTurnInteractions();
    var _target = null;
    var action = {
        intent: null
    };
    if (interactionList[npc.playerId]) {
        interactionList[npc.playerId].some(function (interaction) {
            var _player = dungeon.getPlayer(interaction.playerId);
            if (_player.isAlive()) {
                action.intent = gameObjectTypes[npc.gameObjectType].reactions[interaction.intent];
                _target = _player;
                return true;
            }
        })
    }

    if (!_target) {
        action.intent = gameObjectTypes[npc.gameObjectType].actions[0];
        var randomActionChance = Math.random();
        var currentPercentage = 0;
        gameObjectTypes[npc.gameObjectType].actions.some(function (possibleAction) {
            if (randomActionChance > currentPercentage + possibleAction.chance) {
                currentPercentage += possibleAction.chance;
            } else {
                action.intent = possibleAction.name;
                return true;
            }
        })
        var _target = mapSpot.players.filter(function (obj) { return obj.isAlive() }).pop();
    }

    return gameActions[action.intent](dungeon, npc, action, mapSpot, _target);

};


actionProcessor.prototype.checkIfAllPlayersChooseAction = function (dungeon) {
    var actionList = dungeon.getCurrentTurnActions();
    //take into account only alive players
    return actionList.length === dungeon.getAlivePlayerList().length;
};

actionProcessor.prototype.runGameLoop = function (dungeon) {
    var activeMapSpots = dungeon.getActiveMapSpots();
    var gameLoopStory = [];
    activeMapSpots.some(function (mapSpot) {
        mapSpot.players.forEach(function (player) {
            gameLoopStory.push(processPlayerAction(dungeon, player, dungeon.getPlayerAction(player.playerId), mapSpot));
            return !dungeon.isPrinceAlive();
        });

        mapSpot.npcs.forEach(function (npc) {
            if (mapSpot.players.some(function (player) { return player.isAlive() }) && npc.isAlive()) {
                gameLoopStory.push(processNPCAction(dungeon, npc, mapSpot));
            }
        });
    });

    dungeon.endTurn();
    return gameLoopStory;
};

module.exports = actionProcessor;