var m = require("mithril");

module.exports = function(ctrl) {
    ctrl.goText.store = ["You enter a decript mini-mart. Pick your poison."];

    return function(ctrl) {
        ctrl.actions =[{
            name : "Buy",
            action : function() {
                ctrl.special = [{
                    name : "$5 - Cheese Toes",
                    action : function() {
                        if(ctrl.resources.money > 5) {
                            ctrl.type("Delicous, delicous cheesy toes");
                            ctrl.resources.money -= 5;
                            ctrl.resources.health += 10;
                            ctrl.resources.happiness += 1;
                        }
                    }
                }];
                ctrl.specialName = "Inventory";
            }
        }, {
            name : "Leave",
            action : ctrl.go("grid")
        }];

        return m(".flex.store");
    };
};
