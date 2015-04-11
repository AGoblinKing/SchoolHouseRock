var m = require("mithril");

module.exports = function(ctrl) {
    ctrl.goText.home = ["You enter your humble dwelling."];

    return function(ctrl) {
        ctrl.actions = [{
            name : "Sleep",
            action : function() {
                ctrl.resources.health += 5;
                ctrl.resources.day += 1;
                ctrl.resources.time = 100;
                ctrl.type("You get a solid night's rest");
            }
        }, {
            name : "Leave",
            action : ctrl.go("grid")
        }];

        return m(".flex.home");
    };
};
