var m = require("mithril"),
    r = require("./random");

createjs.Sound.registerSound("assets/Audio/Sounds/fall_down.wav", "fallDown");

module.exports = function(ctrl) {
    return function(ctrl) {
        createjs.Sound.play("fallDown").setVolume(.5);
        ctrl.actions =[{
            name : "Get up!",
            action : function() {
                ctrl.go("grid")();
                if(r.clamp(0, 100) <= 25) {
                    ctrl.resources.money = 0;
                    ctrl.type("Your wallet was taken while you were unconcious.");
                    ctrl.unlocked.push("Robbed");
                } else {
                    ctrl.type(r.one([
                        "You pick your sorry ass off the ground",
                        "Sleeping on concrete sucks."
                    ]));
                }
            }
        }];

        return m(".flex.passed-out");
    };
};
