/**
 * ENUM
 *
 * @providesModule gameTerrains
 */

const gameTerrains = {
	meadow: {
		defenseBonus: 0,
		attackBonus: 5,
		descriptions: ["quiet Meadow", "silent meadow", "sheep meadow"]
	},
	forest: {
		defenseBonus: 5,
		attackBonus: 0,
		descriptions: ["dense forrest", "black forest", "jungle"]
	},
	castle: {
		defenseBonus: 10,
		attackBonus: 5,
		descriptions: ["majestic castle", "old castle"]
	}
};

module.exports = gameTerrains;