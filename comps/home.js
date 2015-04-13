var m = require("mithril"),
    r = require("./random");

module.exports = function(ctrl) {
    ctrl.goText.home = ["You enter your humble dwelling."];

    return function(ctrl) {
        ctrl.actions = [{
            name : "Sleep",
            action : function() {
                ctrl.resources.health -= 5;
                ctrl.resources.day += 1;
                ctrl.resources.time = 100;
                ctrl.type(r.one(["You get a solid night's rest", "Dawn of a new day!"]));
            }
        }, {
            name : "Watch TV",
            action : function() {
                ctrl.resources.health -= 5;
                ctrl.resources.time -= 20;
                ctrl.resources.happiness += 25;
                ctrl.type(r.one(["Hmm, new episode of Twilight of Thrones.", "Saw it before.", "I wish I could be on TV."]));
            }
        }, {
            name : "Leave",
            action : ctrl.go("grid")
        }];

        return m(".flex.home");
    };
};
