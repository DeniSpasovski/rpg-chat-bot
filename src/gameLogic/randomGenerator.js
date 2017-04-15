/**
 * The dungeon definition
 *
 * @providesModule dungeon
 */

var gameObjectTypes = require('./enums/gameObjectTypes');
var gameTerrains = require('./enums/gameTerrains');
var gameObject = require('./models/gameObject');
var gameTerrain = require('./models/gameTerrain');

/**
 * Game map generator
 *
 * @function generateGameMap
 * @param {number} size - size of the map
 * @returns {Array<Array>} gameMap
 */
function generateGameMap(size) {
    var gameMap = [];

    for (var i = -size; i <= size; i++) {
        gameMap[i] = [];
        for (var j = -size; j <= size; j++) {
            gameMap[i][j] = generateRandomTerrain();
        }
    }

    gameMap[0][0] = new gameTerrain('castle');

    return gameMap;
}

function generateNPC(size) {
    var npcList = [];
    var i = 0;
    npcList.push(new gameObject("0", null, gameObjectTypes.Prince));
    for (i = 0; i < size * size; i++) {
        var _boar = new gameObject(gameObjectTypes.Boar.name + i, null, gameObjectTypes.Boar);
        _boar.position = generateRandomPosition(3);
        npcList.push(_boar);
    }

    for (i = 0; i < size; i++) {
        var _wolf = new gameObject(gameObjectTypes.Wolf.name + i, null, gameObjectTypes.Wolf);
        _wolf.position = generateRandomPosition(3);
        npcList.push(_wolf);
    }

    return npcList;
}

function generateRandomTerrain() {
    var randomTerreainId = Math.randomInt(0, Object.keys(gameTerrains).length - 1);
    return new gameTerrain(Object.keys(gameTerrains)[randomTerreainId]);
}

function generateRandomPosition(distance, fixedDistance) {
    var position = {
        x: 0,
        y: 0
    };

    if (fixedDistance) {
        position.x = Math.randomInt(0, 2) === 0 ? -Math.randomInt(1, distance + 1) : Math.randomInt(1, distance + 1);
        position.y = Math.randomInt(0, 2) === 0 ? -(distance - Math.abs(position.x)) : (distance - Math.abs(position.x));
    } else {
        position.x = Math.randomInt(0, 2) === 0 ? -Math.randomInt(0, distance + 1) : Math.randomInt(0, distance + 1);
        position.y = Math.randomInt(0, 2) === 0 ? -Math.randomInt(0, distance + 1) : Math.randomInt(0, distance + 1);

        if (position.x == 0 && position.y == 0) {
            position.x = Math.randomInt(1, distance + 1);
            position.y = Math.randomInt(1, distance + 1);
        }
    }

    return position;
};

module.exports = {
    generateNPC: generateNPC,
    generateGameMap: generateGameMap,
    generateRandomPosition: generateRandomPosition
};