(function () {
    if (!Math.randomInt) {
        Math.randomInt = function randomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
        };
    }
})();