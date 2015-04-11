var m = require("mithril");

module.exports = function(ctrl) {
    ctrl.goText.bar = ["The musty air could get to you..."];

    return function(ctrl) {
        ctrl.actions = [{
            name : "Drink",
            action : function() {
                ctrl.special = [{
                    name : "10$ A Calm Night",
                    action : function() {
                        if(ctrl.resources.money >= 10) {
                            ctrl.resources.money -= 10;
                            ctrl.resources.health -= 20;
                            ctrl.resources.happiness += 30;
                        }
                    }
                }, {
                    name : "25$ A Real Banger",
                    action : function() {
                        if(ctrl.resources.money >= 25) {
                            ctrl.resources.money -= 25;
                            ctrl.resources.health -= 40;
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
