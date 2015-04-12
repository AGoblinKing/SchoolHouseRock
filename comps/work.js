var m = require("mithril"),
    r = require("./random");

module.exports = function(ctrl) {
    var pay = 5;

    return function(ctrl) {
        ctrl.actions = [{
            name : "Work",
            action : function() {
                ctrl.type(r.one([
                    "Working hard for that money :3",
                    "$10 for...my life",
                    "Would you like fries with that?"
                ]));

                ctrl.resources.money += 10;
                ctrl.resources.happiness -= 10;
                ctrl.resources.time -= 15;
            }
        }, {
            name : "Leave",
            action : function() {
                ctrl.go("grid")();
                ctrl.type("Its good to be out of there");
            }
        }];

        return m(".flex.work");
    };
};
