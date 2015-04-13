var m = require("mithril"),
    r = require("./random");

createjs.Sound.registerSound("assets/Audio/Sounds/PoliceSiren.mp3", "Siren");
createjs.Sound.registerSound("assets/Audio/Sounds/got_item.wav", "gotItem");
createjs.Sound.registerSound("assets/Audio/Sounds/no_item.wav", "noItem");

module.exports = function(ctrl) {
    ctrl.goText.store = ["You enter a decript mini-mart. Pick your poison."];

    function caught(chance) {
        return r.clamp(0, 100) < chance;
    }

    return function(ctrl) {
        ctrl.actions =[{
            name : "[Steal]",
            action : function() {
                ctrl.specialName = "Sticky Fingers";
                ctrl.special = [{
                    name : "Cheese Toes",
                    action : function() {
                        if(!caught(10)) {
                            ctrl.type("Delicous, delicous free cheesy toes");
                            ctrl.resources.health += 10;
                            ctrl.resources.happiness += 20;
                            ctrl.unlocked.push("Criminal");
                        } else {
                            createjs.Sound.play("Siren");
                            ctrl.type("A life in jail over Cheese Toes :(");
                            ctrl.go("game-over")();
                        }
                    }
                }, {
                    name : "Coffee",
                    action : function() {
                        if(!caught(5)) {
                            ctrl.type("No such thing as a free coffee.");
                            ctrl.resources.time += 10;
                            ctrl.resources.health -= 5;
                            ctrl.resources.happiness += 10;
                            ctrl.unlocked.push("Criminal");
                        } else {
                            ctrl.go("game-over")();
                            createjs.Sound.play("Siren");
                            ctrl.type("Really? I hope it was arabic. Caught!");
                        }
                    }
                }, {
                    name : "Bus Pass",
                    action : function() {
                        if(!caught(40)) {
                            ctrl.type("Finally, can get around. In Style.");
                            ctrl.resources.bus = 7;
                            ctrl.resources.happiness += 20;
                            ctrl.unlocked.push("Criminal");
                        } else {
                            ctrl.go("game-over")();
                            createjs.Sound.play("Siren");
                            ctrl.type("You got the bus, to Jail.");
                        }
                    }
                }];
            }
        }, {
            name : "[Buy]",
            action : function() {
                ctrl.special = [{
                    name : "$5 - Cheese Toes",
                    action : function() {
                        if(ctrl.resources.money > 5) {
                            ctrl.type("Delicous, delicous cheesy toes");
                            ctrl.resources.money -= 5;
                            ctrl.resources.health += 15;
                            ctrl.resources.happiness += 1;
                            createjs.Sound.play("gotItem");
                        } else {
                            ctrl.type("Low on health? No help here.");
                            createjs.Sound.play("noItem");
                        }
                    }
                }, {
                    name : "$5 - Coffee",
                    action : function() {
                        if(ctrl.resources.money > 5) {
                            ctrl.type("Bzzt, the good stuff.");
                            ctrl.resources.money -= 5;
                            ctrl.resources.time += 10;
                            ctrl.resources.health -= 5;
                            ctrl.resources.happiness += 1;
                            createjs.Sound.play("gotItem");
                        } else{
                            ctrl.type("You can't afford Coffee? Thats rough.");
                            createjs.Sound.play("noItem");
                        }
                    }
                }, {
                    name : "$25 - Bus Pass",
                    action : function() {
                        if(ctrl.resources.money > 25) {
                            ctrl.type("Finally, can get around!");
                            ctrl.resources.money -= 25;
                            ctrl.resources.bus = 7;
                            ctrl.resources.happiness += 10;
                            createjs.Sound.play("gotItem");
                        } else {
                            ctrl.type("Freeloader. You can't afford that.");
                            createjs.Sound.play("noItem");
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
