var m = require("mithril");

createjs.Sound.registerSound("assets/Audio/Music/EndingStinger.mp3", "end");
module.exports = function(ctrl) {
    return function(ctrl) {
        createjs.Sound.play("end");
        window.sound_in.stop();
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
        }, {
            name : "Restart Rich",
            action : function() {
                window.location = window.location + "?start=10000";
            }
        }];

        return m(".flex.game_over.center", [
            m("h1.text-over", "Game Over, man. Game Over.")
        ]);
    };
};
