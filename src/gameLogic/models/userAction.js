var actionList = require('../enums/actionList');

function userAction(intent, name, subActionName, subAction) {
    this.intent = intent;
    this.name = name;
    this.actionType = actionList[intent].actionType;
    this.subActionName = subActionName;
    this.subAction = subAction;
    return this;
}

userAction.prototype.print = function () {
    if (this.subAction) {
        return this.name + ", " + this.subActionName + ": " + this.subAction;
    } else {
        return this.name;
    }
};


module.exports = userAction;