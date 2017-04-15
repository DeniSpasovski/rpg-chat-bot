/**
 * ENUM
 *
 * @providesModule gameObjectTypes
 */

const gameObjectTypes = {
    Player: {
        name: 'Player',
        energy: 100,
        attack: 50,
        attackSkill: 0.5,
        defense: 20,
        defenseSkill: 0.5

    },
    Prince: {
        name: 'Prince',
        energy: 80,
        attack: 80,
        attackSkill: 0.7,
        defense: 20,
        defenseSkill: 0.3,
        actions: [
            {
                name: "action.attack",
                chance: 0.75
            }, {
                name: "action.standground",
                chance: 0.25
            }
        ],
        reactions: {
            "action.attack": "action.attack",
            "action.greet": "action.attack"
        }
    },
    Wolf: {
        name: 'Wolf',
        energy: 30,
        attack: 30,
        attackSkill: 0.5,
        defense: 10,
        defenseSkill: 0.5,
        actions: [
            {
                name: "action.attack",
                chance: 0.5
            }, {
                name: "action.standground",
                chance: 0.5
            }
        ],
        reactions: {
            "action.attack": "action.attack",
            "action.greet": "action.attack"
        }
    },
    Dragon: {
        name: 'Dragon',
        energy: 100,
        attack: 50,
        attackSkill: 0.75,
        defense: 30,
        defenseSkill: 0.5,
        actions: [
            {
                name: "action.attack",
                chance: 0.8
            }, {
                name: "action.standground",
                chance: 0.2
            }
        ],
        reactions: {
            "action.attack": "action.attack",
            "action.greet": "action.attack"
        }
    },
    Boar: {
        name: 'Boar',
        energy: 30,
        attack: 10,
        attackSkill: 0.1,
        defense: 10,
        defenseSkill: 0.5,
        actions: [
            {
                name: "action.standground",
                chance: 1
            }
        ],
        reactions: {
            "action.attack": "action.attack",
            "action.greet": "action.greet"
        }
    }
};

module.exports = gameObjectTypes;