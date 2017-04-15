/**
 * Resource file contains all bot messages
 *
 * @providesModule BotMessages
 */


var messages = {};
var multiMessage = {};

messages.welcome = {
    hello: "Welcome to the dungeon!",
    helloPlayer: "Hello %s! Welcome to the dungeon!"
};

messages.lobby = {
    joiningGame: "Joining dungeon",
    notFound: "Dungeon %s not found!",
    noAction: "Lobby Action was not recognized.",
    newGame: "Starting new game...",
    options: "You can join a existing game session by entering the session id or start a new game!",
    welcome: "This is the game lobby."
};

messages.gameMaster = {
    actionReplay: "!Action Replay!",
    turnStory: "!Current Turn Story!",
    actionChoosen: "You chose to %s.",
    actionDoesntExist: "Your action is impossible.",
    actionCantBeChoosen: "You have already chosen your action, please wait for other players to make their turn.",
    deadPlayer: "Your knight died, you can still wait and watch the game, however you can't make any actions anymore.",
    gameOverYouWin: "Congratulations, you have killed the evil prince, and now you are king of the castle!",
    gameOverYouLoose: "GAME OVER, all the players died!",
    joinedGame: " %s has joined the game.",
    name: "!Dungeon Master!",
    newGameId: "The newly created game id is %s, share this to your friends if you want them to join you.",
    turn: "This is game turn ",
    yourMove: 'What is your next move?'
};

messages.gameStory = {
    singlePlayer: "is",
    multiPlayer: "are"
};

messages.gameAction = {
    move: " is headed in ",
    moveDirection: " direction.",
    gainEnergy: " gained 10 energy"
};

messages.locations = {
    deathValleySinglePlayer: "death valley. If they continue this way he is going to die",
    deathValleyMultiPlayer: "death valley. If the adventure continues in this direction they are going to die"
};

multiMessage.gameStory = {
    multiNPC: ["There seems to be a lot of animals here, if you are brave you can try attacking them!", "There seems to be multiple beasts here, best strategy in this case is to run."],
    foundPrinceAlone: [" And you are alone, I wouldn't suggest attacking the prince.", " This is the moment you've been waiting for, you can attack the Prince!"],
    foundPrinceMulti: [" You have the man power, now is the time to attack"],
    noNPC: ["There doesn't seem to be anyone else here", "There are no wild animals at this place", "Otherwise, the place looks deserted"],
    npcNearby: ["There is a "],
    npcAction: [" you can try to greet it, what could go wrong?", " as a true knight you should attack it!"],
};

multiMessage.gameAction = {
    attackEmpty: [" decided to fight the wind, this doesn't look like a battle that he can win.", " kicked in empty space again, is he seeing something we don't"],
    attackDead: [" arrived bit to late at the party, his friends already cleared this spot."],
    attackKill: [" attacked and killed %s.", " smashed a %s."],
    attackWound: [" attacked and wounded %s severely."],
    attackMiss: [" tried to attack %s, unfortunately he missed."],
    enemiesInSight: ["Ignoring the fact that there are all kinds of dangers here, "],
    maxEnergy: [" gained no energy, because he is sleeping all day long.", " he just wasted another turn doing nothing."],
    noEnemiesInSight: ["There aren't any animals near by, so ", "It was a great day outside and "],
    run: [" decided to run like crazy in unknown direction.", " thought that running is a good exercise."],
    runJoke: [" Maybe he was scared of the big animals.", " He shat his pants when he saw the shadow of the animal."],
    runJokeCastle: [" He was afraid of the prince.", " If I was in his place, I would run from that crazy prince."],
    standGround: [" choose to take a nap ", " decided to count the stars "]
};

multiMessage.help = [
    "Welcome to the battle for the castle. Your job as a young knight is to find a kill the evil prince. He is located in the castle in the center of the map.",
    "You can navigate in the map by moving north, south, east or west, or by running in an unknown direction.",
    "On your way to the castle you'll meet a lot of enemies and wild animals, you have to option choose to attack, greet or run away from them."
]

module.exports = {
    messages: messages,
    multiMessage: multiMessage
};