/**
 * 
 *
 * @providesModule gameTerrain
 */

var gameTerrains = require('../enums/gameTerrains');

function gameTerrain(type) {
    this.terrainType = type;
    if (gameTerrains[type]) {
        this.attackBonus = gameTerrains[type].attackBonus;
        this.defenseBonus = gameTerrains[type].defenseBonus;
        this.description = gameTerrains[type].descriptions[Math.randomInt(0, gameTerrains[type].descriptions.length)];
    }
    return this;
}

gameTerrain.prototype.getTerrainAttackBonus = function () {
	return this.attackBonus;
};

gameTerrain.prototype.getTerrainAttackBonus = function () {
	return this.attackBonus;
};


module.exports = gameTerrain;