var botMessages = require('./enums/botMessages');

function chooseRandomMessage(messageList) {
    if (Array.isArray(messageList)) {
        return messageList[Math.randomInt(0, messageList.length)];
    } else {
        return messageList;
    }
}

function initMessageProcessor(rpgChatBotApi) {
    rpgChatBotApi.messages = botMessages.messages;
    rpgChatBotApi.multiMessage = botMessages.multiMessage;
    
    return {
        chooseRandomMessage: chooseRandomMessage
    }
}

module.exports = {
    init: initMessageProcessor,
    chooseRandomMessage: chooseRandomMessage
};