var m = require("mithril");

module.exports = function(ctrl) {
    return function(ctrl) {
        ctrl.specialName = "Achievements";
        ctrl.special = ctrl.achievements.map(function(achievement) {
            return {
                name : (ctrl.unlocked.indexOf(achievement) !== -1 ? "[✔] " : "[ ] ") + achievement
            };
        });

        ctrl.actions = [{
            name : "Restart",
            action : function() {
                window.location.reload();
            }
        }];

        return m(".flex.game_over.center", [
            m("h1.text-over", "Game Over, man. Game Over.")
        ]);
    };
};
