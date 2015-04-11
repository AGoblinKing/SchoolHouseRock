var m = require("mithril");

module.exports = function(ctrl) {
    return function(ctrl) {
        ctrl.actions = [{
            name : "Restart",
            action : function() {
                window.location.reload();
            }
        }];

        return m(".flex.game_over.center", [
            m("h1", "Game Over, man. Game Over.")
        ]);
    };
};
