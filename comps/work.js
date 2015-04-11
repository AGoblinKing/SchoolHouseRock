var m = require("mithril");

module.exports = function(ctrl) {
    var pay = 5;

    return function(ctrl) {
        ctrl.actions = [{
            name : "Work",
            action : function() {
                ctrl.type("Working hard for that money :3");
                ctrl.resources.money += 5;
                ctrl.resources.happiness -= 10;
                ctrl.resources.time -= 15;
            }
        }, {
            name : "Leave",
            action : ctrl.go("grid")
        }];

        return m(".flex.work");
    };
};
