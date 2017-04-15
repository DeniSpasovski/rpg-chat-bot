/**
 * Every player or a NPC is a game object
 *
 * @providesModule gameObject
 */

var gameObjectTypes = require('../enums/gameObjectTypes');
var gameSkills = require('./gameSkills');

function gameObject(playerId, playerName, gameObjectProps) {
    this.gameObjectType = gameObjectProps.name;
    this.playerId = playerId || null;
    this.playerName = playerName || null;
    this.position = {
        x: 0,
        y: 0
    };
    this.skills = new gameSkills(gameObjectProps);
    return this;
}

gameObject.prototype.getPositionHash = function () {
    return this.position.x + '_' + this.position.y;
};

gameObject.prototype.getPlayerName = function () {
    if (this.isPlayer()) {
        return this.playerName;
    } else {
        return "The " + this.gameObjectType;
    }
};

gameObject.prototype.isPlayer = function () {
    return this.gameObjectType == gameObjectTypes.Player.name;
};

gameObject.prototype.isAlive = function () {
    return this.skills.energy > 0;
};

gameObject.prototype.hasMaxEnergy = function () {
    return this.skills.energy >= this.skills.maxEnergy;
};

gameObject.prototype.gainAttackSkill = function (attack, attackSkill) {
    if (this.isPlayer()) {
        this.skills.attack += attack;
        this.skills.attackSkill += attackSkill;
    }
}

gameObject.prototype.gainEnergy = function () {
    if (this.isPlayer() && this.isAlive() && !this.hasMaxEnergy()) {
        this.skills.energy += 10;
        if (this.skills.energy > this.skills.maxEnergy) {
            this.skills.energy = this.skills.maxEnergy
        }
    } else {
        return false;
    }
}

gameObject.prototype.reduceEnergy = function (value) {
    this.skills.energy -= value;
}

gameObject.prototype.attack = function (gameObject) {
    var attackChance = this.skills.attackSkill + this.skills.attackSkill / 2;
    var attackRandom = Math.random();
    var defenseRandom = Math.random();
    if (attackChance > attackRandom) {
        var attackStrength = this.skills.attack * (this.skills.attackSkill + (1 - this.skills.attackSkill) * attackRandom);
        var defenseStrength = gameObject.skills.defense * (gameObject.skills.defenseSkill + (1 - gameObject.skills.defenseSkill) * defenseRandom);
        if (attackStrength > defenseStrength) {
            gameObject.reduceEnergy(attackStrength - defenseStrength);
        } else {
            gameObject.reduceEnergy(1);
        }
        return true;
    } else {
        return false;
    }
}

module.exports = gameObject;