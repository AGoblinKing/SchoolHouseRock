var m = require("mithril"),
    r = require("./random");

module.exports = function(ctrl) {
    return function(ctrl) {
        createjs.Sound.play("fallDown").setVolume(.5);

        ctrl.actions =[{
            name : "Sobering... Up.",
            action : function() {
                ctrl.go("grid")();
                if(r.clamp(0, 100) <= 5) {
                    ctrl.resources.money = 0;
                    ctrl.type("Your wallet was taken while you were drunk.");
                    ctrl.unlocked.push("Robbed");
                } else {
                    ctrl.type(r.one([
                        "You pick your sorry ass off the ground",
                        "Ugh what was that truck?"
                    ]));
                }
            }
        }];

        return m(".flex.drunk");
    };
};
