var m = require("mithril");

module.exports = function(ctrl) {
    ctrl.goText.school = [ "Get an education. Sign on the dotted line." ];

    return function(ctrl) {
        if(!ctrl.resources.debt) {
            ctrl.actions =[{
                name : "Enroll",
                action : function() {
                    ctrl.resources.debt = 40000;
                    ctrl.resources.degree = 0;
                }
            }, {
                name : "Leave",
                action : ctrl.go("grid")
            }];
        } else {
            ctrl.actions =[{
                name : "Learn",
                action : function() {
                    ctrl.resources.time -= 25;
                    ctrl.resources.degree += 5;
                    ctrl.resources.happiness -= 10;
                }
            }, {
                name : "[ Pay Debt ]",
                action : function() {
                    ctrl.special = [{
                        name : "$10",
                        action : function() {
                            if(ctrl.resources.money >= 10) {
                                ctrl.resources.money -= 10;
                            }
                        }
                    },{
                        name : "$100",
                        action : function() {
                            if(ctrl.resources.money >= 100) {
                                ctrl.resources.money -= 100;
                            }
                        }
                    },{
                        name : "$1000",
                        action : function() {
                            if(ctrl.resources.money >= 1000) {
                                ctrl.resources.money -= 1000;
                            }
                        }
                    }];
                }
            }, {
                name : "Leave",
                action : ctrl.go("grid")
            }];
        }
        return m(".flex.school");
    };
};
