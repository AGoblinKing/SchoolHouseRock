var m = require("mithril");

module.exports = function(ctrl) {
    return function(ctrl) {
        ctrl.actions =[{
            name : "Get off the ground",
            action : function() {
                ctrl.go("grid")();
                ctrl.type("You pick your sorry ass off the ground");
            }
        }];

        return m(".flex.passed-out");
    };
};
