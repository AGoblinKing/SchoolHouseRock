var m = require("mithril"),
    r = require("./random");

module.exports = function(ctrl) {
    ctrl.goText.bar = ["The musty air could get to you..."];

    return function(ctrl) {
        ctrl.actions = [{
            name : "[Drink]",
            action : function() {
                ctrl.specialName = "Drink Menu";
                ctrl.special = [{
                    name : "$10 Calm Night",
                    action : function() {
                        if(ctrl.resources.money >= 10) {
                            ctrl.type(r.one(["Well, the trivia was fun", "Cut off already?"]));
                            ctrl.resources.money -= 10;
                            ctrl.resources.health -= 20;
                            ctrl.resources.happiness += 30;
                        }
                    }
                }, {
                    name : "$25 Real Banger",
                    action : function() {
                        if(ctrl.resources.money >= 25) {
                            ctrl.type(r.one(["You had a real doosey of a night", "You'll regret that one in the morning."]));
                            ctrl.resources.money -= 25;
                            ctrl.resources.health -= 40;
                            ctrl.unlocked.push("Drunk");
                            ctrl.resources.happiness += 80;
                        }
                    }
                }]
            }
        }, {
            name : "Leave",
            action : ctrl.go("grid")
        }];

        return m(".flex.bar");
    };
};
