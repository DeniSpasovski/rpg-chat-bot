
const actionList = {
	"None": {
		isValid: false,
		actionType: 'none'
	},
	"action.attack": {
		name: "Attack",
		isValid: true,
		actionType: 'active'
	},
	"action.greet": {
		name: "Greet",
		isValid: true,
		actionType: 'passive'
	},
	"action.run": {
		name: "Run",
		isValid: true,
		actionType: 'passive'
	},
	"action.standground": {
		name: "Stand Ground",
		isValid: true,
		actionType: 'active'
	},
	"action.travel": {
		name: "Travel",
		isValid: true,
		actionType: 'passive',
		entityType: "direction",
		defaultEntity: "unknown",
		entities: ["east", "west", "south", "north"]
	}
};

module.exports = actionList;