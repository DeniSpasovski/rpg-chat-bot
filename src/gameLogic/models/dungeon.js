/**
 * The dungeon definition
 *
 * @providesModule dungeon
 */

var gameObject = require('./gameObject');
var gameObjectTypes = require('../enums/gameObjectTypes');
var randomGenerator = require('../randomGenerator');

function dungeon(size) {
    this.dungeonSize = size || 3;
    this.gameMap = randomGenerator.generateGameMap(this.dungeonSize);
    this.nonPlayerCharacters = randomGenerator.generateNPC(this.dungeonSize);
    this.players = [];
    this.turn = 0;
    this.turnActions = [{}]; //historic list of all players actions
    this.turnInteractions = [{}]; //historic list of all players/enemy interaction
    this.gameOver = false;
    return this;
}

dungeon.prototype.addPlayer = function (playerId, playerName, gameObjectProps) {
    var _newPlayer = new gameObject(playerId, playerName, gameObjectProps);
    _newPlayer.position = randomGenerator.generateRandomPosition(this.dungeonSize, true);
    this.players.push(_newPlayer);
};

dungeon.prototype.getPlayerAction = function (playerId) {
    return this.turnActions[this.turn][playerId];
};

dungeon.prototype.pushAction = function (playerId, action) {
    this.turnActions[this.turn][playerId] = action;
};

dungeon.prototype.getCurrentTurnInteractions = function () {
    return this.turnInteractions[this.turn];
}

dungeon.prototype.getCurrentTurnActions = function () {
    var _currentTurnActions = this.turnActions[this.turn];
    return Object.keys(_currentTurnActions).map(function (playerId) {
        return _currentTurnActions[playerId];
    });
};

dungeon.prototype.getPlayerList = function () {
    return this.players;
};

dungeon.prototype.getAlivePlayerList = function () {
    return this.players.filter(function (player) {
        return player.isAlive();
    });
}

dungeon.prototype.getPlayer = function (playerId) {
    return this.players.find(function (obj) { return obj.playerId === playerId });
};

dungeon.prototype.isPrinceAlive = function () {
    return this.nonPlayerCharacters.find(function (obj) {
        return obj.gameObjectType === gameObjectTypes.Prince.name;
    }).isAlive();
}

dungeon.prototype.arePlayerAlive = function () {
    return this.players.some(function (player) {
        return player.isAlive();
    });
}

dungeon.prototype.endTurn = function (playerId, action) {
    this.turn++;
    this.turnActions[this.turn] = {};
    this.turnInteractions[this.turn] = {};
};

/**
 * We need this in order to process multi player spots
 *
 * @function getActiveMapSpots
 * @returns {Array<MapSpots>} activeMapSpots
 */
dungeon.prototype.getActiveMapSpots = function () {
    var _dungeon = this;
    var mapSpots = this.players.reduce(function (result, player) {
        if (!player.isAlive()) {
            return result;
        }

        //initialize the map spot
        if (!result[player.getPositionHash()]) {
            result[player.getPositionHash()] = {
                position: {
                    x: player.position.x,
                    y: player.position.y
                },
                players: [],
                npcs: []
            };

            result[player.getPositionHash()].npcs = _dungeon.nonPlayerCharacters.filter(function (obj) {
                return obj.isAlive() && obj.getPositionHash() == player.getPositionHash();
            });
        }

        //add player to spot
        result[player.getPositionHash()].players.push(player);

        return result;
    }, {});

    return Object.keys(mapSpots).map(function (mapKey) {
        return mapSpots[mapKey];
    });
};

dungeon.prototype.thereBeDragons = function (player) {
    //check if the player is far from the map
    if (Math.abs(player.position.x) > this.dungeonSize + 2 || Math.abs(player.position.y) > this.dungeonSize + 2) {
        var npcs = this.nonPlayerCharacters.find(function (obj) {
            return obj.position.x === player.position.x && obj.position.y === player.position.y;
        })

        if (!npcs) {
            var _dragon = new gameObject("Dragon" + player.getPositionHash(), null, gameObjectTypes.Dragon);
            _dragon.position.x = player.position.x;
            _dragon.position.y = player.position.y;
            this.nonPlayerCharacters.push(_dragon);
        }
    }
}

module.exports = dungeon;