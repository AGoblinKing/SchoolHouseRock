(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(ctrl) {
    ctrl.achievements = ["Drunk", "Robbed", "Criminal"];
    ctrl.unlocked = [];
};

},{}],2:[function(require,module,exports){
var m = require("mithril"),
    menu = require("./menu");

module.exports = function(ctrl) {
    ctrl.actions = [];
    ctrl.actionsName = "";
    return function(ctrl) {
        return ctrl.actions.length > 0 ? m(".vbox", [
            m("h3.text-center", ctrl.actionsName),
            menu(ctrl.actions)
        ]) : "";
    };
};

},{"./menu":10,"mithril":19}],3:[function(require,module,exports){
var m = require("mithril"),
    r = require("./random");


createjs.Sound.registerSound("assets/Audio/Sounds/drank.wav", "drank");

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
                            createjs.Sound.play("drank");
                        }
                    }
                }, {
                    name : "$25 Real Banger",
                    action : function() {
                        if(ctrl.resources.money >= 25) {
                            ctrl.go("drunk")();
                            ctrl.type(r.one(["You had a real doosey of a night", "You'll regret that one in the morning."]));
                            ctrl.resources.money -= 25;
                            ctrl.resources.health -= 40;
                            ctrl.unlocked.push("Drunk");
                            ctrl.resources.happiness += 80;

                            createjs.Sound.play("drank");
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

},{"./random":12,"mithril":19}],4:[function(require,module,exports){
var m = require("mithril"),
    r = require("./random");

module.exports = function(ctrl) {
    return function(ctrl) {
        createjs.Sound.play("fallDown").setVolume(.5);

        ctrl.actions =[{
            name : "Sobering... Up.",
            action : function() {
                ctrl.go("grid")();
                if(r.clamp(0, 100) <= 5) {
                    ctrl.resources.money = 0;
                    ctrl.type("Your wallet was taken while you were drunk.");
                    ctrl.unlocked.push("Robbed");
                } else {
                    ctrl.type(r.one([
                        "You pick your sorry ass off the ground",
                        "Ugh what was that truck?"
                    ]));
                }
            }
        }];

        return m(".flex.drunk");
    };
};

},{"./random":12,"mithril":19}],5:[function(require,module,exports){
var m = require("mithril");

module.exports = function(ctrl) {
    ctrl.type = function(typer) {
        ctrl.typeScroll = "";
        clearTimeout(ctrl.typeTime);
        if(typer !== "") {
            ctrl.doType(typer.split(""));
        }
    };

    ctrl.doType = function(typer) {
        ctrl.typeScroll += typer.shift();
        m.redraw(true);
        if(typer.length) {
            ctrl.typeTime = setTimeout(ctrl.doType.bind(ctrl, typer), 20);
        }
    };

    return function(ctrl) {
        return m(".events.hbox", [
            m("div", ctrl.typeScroll),
            m(".typed-cursor","|")
        ]);
    };
};

},{"mithril":19}],6:[function(require,module,exports){
var m = require("mithril");

module.exports = function(ctrl) {
    return function(ctrl) {
        ctrl.specialName = "Achievements";
        ctrl.special = ctrl.achievements.map(function(achievement) {
            return {
                name : (ctrl.unlocked.indexOf(achievement) !== -1 ? "[✔] " : "[ ] ") + achievement
            };
        });

        ctrl.actions = [{
            name : "Restart",
            action : function() {
                window.location.reload();
            }
        }, {
            name : "Restart Rich",
            action : function() {
                window.location = window.location + "?start=10000";
            }
        }];

        return m(".flex.game_over.center", [
            m("h1.text-over", "Game Over, man. Game Over.")
        ]);
    };
};

},{"mithril":19}],7:[function(require,module,exports){
var m = require("mithril"),
    r = require("./random");

module.exports = function(ctrl) {
    createjs.Sound.registerSound("assets/Audio/Sounds/Footsteps1.mp3", "Button");

    function makeArr(num) {
        var arr = [];
        for(var i = 0; i < num; i++) {
            var coord = makeCoord(i);
            arr.push({
                x : coord.x,
                y : coord.y,
                n : i
            });
        }

        return arr;
    }

    function makeCoord(grid) {
        return {
            x : grid % 5,
            y : Math.floor(grid/5)
        };
    }

    function nearPlayer(grid) {
        var player = makeCoord(ctrl.loc),
            dist = {
                x : Math.abs(grid.x - player.x),
                y : Math.abs(grid.y - player.y)
            };

        return dist.x === 1 ? dist.y === 0 : dist.y === 1 && dist.x === 0;
    }

    function makeGrid(grid) {
        grid = grid || {};
        var opts = nearPlayer(grid) ? {
            class : "moveable",
            onclick : movePlayer.bind(null, grid)
        } : {};

        return m(".grid.grid-" + grid.type, opts, [
            grid.type && grid.n !== ctrl.loc ? m(".gridName", grid.type) : "",
            grid.n  === ctrl.loc ? m(".player") : ""
        ]);
    }

    function movePlayer(grid) {
        createjs.Sound.play("Button");

        ctrl.type(r.one(["Vrrooooom!", "kerr plow", "Zug Zug!"]));
        ctrl.resources.time -= ctrl.resources.bus ? 1 : 10;
        ctrl.resources.health -= 2;
        ctrl.resources.happiness -= 2;
        ctrl.loc = grid.n;
        ctrl.actions = grid.actions || [];
        ctrl.actionsName = grid.type ? grid.type : "";
    }

    createjs.Sound.registerSound("assets/Audio/Music/BitCollegeBlues.mp3", "overworld");


    ctrl.loc = 20;
    ctrl.grid = makeArr(25);

    ctrl.grid[1].type = "school";
    ctrl.grid[1].actions = [{
        name : "Enter",
        action : ctrl.go("school")
    }];

    ctrl.grid[9].type = "work";
    ctrl.grid[9].actions = [{
        name : "Enter",
        action : function() {
            ctrl.go("work")();
            ctrl.type("Another day...another dollar");
        }
    }];

    ctrl.grid[20].type = "home";
    ctrl.grid[20].actions = [{
        name : "Enter",
        action : ctrl.go("home")
    }];

    ctrl.grid[12].type = "store";
    ctrl.grid[12].actions = [{
        name : "Enter",
        action : ctrl.go("store")
    }];

    ctrl.grid[24].type = "bar";
    ctrl.grid[24].actions = [{
        name : "Enter",
        action : ctrl.go("bar")
    }, {
        name : "Pee on wall",
        action : function() {
            ctrl.type("You're gross...");
        }
    }];

    return function(ctrl) {
        return m(".thegrid.vbox.flex", [
            m(".grid-row.hbox.flex", ctrl.grid.slice(0, 5).map(makeGrid)),
            m(".grid-row.hbox.flex", ctrl.grid.slice(5, 10).map(makeGrid)),
            m(".grid-row.hbox.flex", ctrl.grid.slice(10, 15).map(makeGrid)),
            m(".grid-row.hbox.flex", ctrl.grid.slice(15, 20).map(makeGrid)),
            m(".grid-row.hbox.flex", ctrl.grid.slice(20, 25).map(makeGrid))
        ]);
    };
};


},{"./random":12,"mithril":19}],8:[function(require,module,exports){
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

},{"./random":12,"mithril":19}],9:[function(require,module,exports){
var m = require("mithril");

module.exports = function(ctrl) {
    ctrl.letter = "render";
    setTimeout(function() {
        ctrl.letter = "opener";
        m.redraw(true);
    }, 300);
    return function(ctrl) {
        return ctrl.letter ? m(".letter", {
            onclick : function() {
                if(ctrl.letter !== "dontcare") {
                    ctrl.letter = "dontcare";
                    var sound_in = createjs.Sound.play("overworld", {loop:-1});
                    sound_in.setVolume(0.7);
                }
            },
            class : ctrl.letter
        }, m.trust("Congratulations on getting into college, sweetie! <br/><br/>You’re finally all moved into your first apartment and all ready for school, and I have never been more proud of you.<br/><br/> So you don’t worry, I paid off your first month’s rent. Be sure to call and tell me everything that happens. <br/><br/>Best of luck! Love you! <br/>" +
               "- Mom")) : "";
    };
};

},{"mithril":19}],10:[function(require,module,exports){
var m = require("mithril");

createjs.Sound.registerSound("assets/Audio/Sounds/ButtonPress.mp3", "ClickButton");
createjs.Sound.registerSound("assets/Audio/Sounds/ButtonMouseOver.mp3", "ButtonMouseOver");

function makeOpt(opt) {
    return m(".option.hbox", {
        onclick : function(){
            createjs.Sound.play("ClickButton");
            opt.action();     
        },
        onmouseover : createjs.Sound.play.bind(null, "ButtonMouseOver")
        
        
    }, opt.name);
};

module.exports = function(opts, classes) {
    classes = classes || " ";
    return m(".menu", {
        class : classes
    }, opts.map(makeOpt));
};

},{"mithril":19}],11:[function(require,module,exports){
var m = require("mithril"),
    r = require("./random");

createjs.Sound.registerSound("assets/Audio/Sounds/fall_down.wav", "fallDown");

module.exports = function(ctrl) {
    return function(ctrl) {
        createjs.Sound.play("fallDown").setVolume(.5);
        ctrl.actions =[{
            name : "Get up!",
            action : function() {
                ctrl.go("grid")();
                if(r.clamp(0, 100) <= 25) {
                    ctrl.resources.money = 0;
                    ctrl.type("Your wallet was taken while you were unconcious.");
                    ctrl.unlocked.push("Robbed");
                } else {
                    ctrl.type(r.one([
                        "You pick your sorry ass off the ground",
                        "Sleeping on concrete sucks."
                    ]));
                }
            }
        }];

        return m(".flex.passed-out");
    };
};

},{"./random":12,"mithril":19}],12:[function(require,module,exports){
module.exports = {
    clamp : function(min, max) {
        return Math.round(Math.random()*max);
    },
    one : function(list) {
        return list[this.clamp(0, list.length - 1)];
    }
};

},{}],13:[function(require,module,exports){
var m = require("mithril"),
    r = require("./random");

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

module.exports = function(ctrl) {
    var resourceText = {
        time : "Energy",
        bus : "Bus Pass Days"
    };

    function makeChart(resource) {
        switch(resource) {
            case "health":
            case "happiness":
            case "time":
            case "degree":
                return m(".rbar." + resource, [
                    m(".fill", {
                        style : {
                            width : ctrl.resources[resource] + "%"
                        }
                    })
                ]);

            case "money":
            case "debt":
                return m("." + resource, "$" + ctrl.resources[resource]);
            default:
                return m("." + resource, ctrl.resources[resource]);
        }
    }

    function makeResource(resource) {
        return m(".resource.center.hbox", [
            m("h3", resourceText[resource] || resource),
            makeChart(resource)
        ]);
    }

    ctrl.resources = {
        _health : 100,
        set health(health) {
            this._health = Math.min(100, health);
            if(health <= 0) {
                ctrl.go("game-over")();
                ctrl.type("Wow, you're dead.");
            }
        },
        get health() {
            return this._health;
        },
        _happiness : 100,
        set happiness(happiness) {
            this._happiness = Math.min(100, happiness);
            if(this._happiness <= 0) {
                ctrl.go("game-over")();
                ctrl.type("In a fit of depression, its now game-over.");
            }
        },
        get happiness() {
            return this._happiness;
        },
        set time(time) {
            this._time = Math.min(100, time);
            if(time <= 0) {
                this.day++;
                this._time = 100;
                this.happiness -= 20;
                this.health -= 25;
                ctrl.go("passed-out")();
                ctrl.type(r.one(["You've collapsed in a fit of exhaustion. :("]));
            }
        },
        get time() {
            return this._time;
        },
        _time: 100,
        money : getParameterByName("start") ? getParameterByName("start"): 100,
        _day : 0,
        set day(day) {
            this._day = day;
            if(this.bus > 0) {
                this.bus--;
            }
            if(this.debt) {
                this.debt += this.debt * 0.001;
                this.debt = Math.floor(this.debt);
            }
        },
        get day() {
            return this._day;
        }
    };

    return function(ctrl) {
        return m(".vbox", [
            m(".title","CollegeQuest"),
            m(".resources", Object.keys(ctrl.resources).filter(function(res) {
                return res[0] !== "_";
            }).map(makeResource))
        ]);
    };
};

},{"./random":12,"mithril":19}],14:[function(require,module,exports){
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
                    ctrl.resources.happiness -= 15;
                }
            }, {
                name : "[Pay Debt]",
                action : function() {
                    ctrl.special = [{
                        name : "$10",
                        action : function() {
                            if(ctrl.resources.money >= 10) {
                                ctrl.resources.money -= 10;
                                ctrl.resources.debt -= 10;
                            }
                        }
                    },{
                        name : "$100",
                        action : function() {
                            if(ctrl.resources.money >= 100) {
                                ctrl.resources.money -= 100;
                                ctrl.resources.debt -= 100;
                            }
                        }
                    },{
                        name : "$1000",
                        action : function() {
                            if(ctrl.resources.money >= 1000) {
                                ctrl.resources.money -= 1000;
                                ctrl.resources.debt -= 1000;
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

},{"mithril":19}],15:[function(require,module,exports){
var m = require("mithril"),
    menu = require("./menu");

module.exports = function(ctrl) {
    ctrl.special = [];
    ctrl.specialName = "";

    return function(ctrl) {
        return ctrl.special.length > 0 ? m(".vbox.special", [
            m("h3.text-center", ctrl.specialName),
            menu(ctrl.special)
        ]) : "";
    };
};

},{"./menu":10,"mithril":19}],16:[function(require,module,exports){
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

},{"./random":12,"mithril":19}],17:[function(require,module,exports){
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

},{"./random":12,"mithril":19}],18:[function(require,module,exports){
var m = require("mithril"),
    r = require("./comps/random");

m.module(document.body, {
    view : function(ctrl) {
        return m(".hbox.flex", [
            ctrl.vletter(ctrl),
            m(".vbox.flex", [
                ctrl["v" + ctrl.location](ctrl),
                ctrl.vevents(ctrl)
            ]),
            m(".vbox.sidebar", [
                ctrl.vresources(ctrl),
                m(".flex", [
                    ctrl.vspecial(ctrl)
                ]),
                ctrl.vactions(ctrl)
            ])
        ]);
    },
    controller : function() {
        var ctrl = this;
        window.scrollTo(0,1);
        createjs.Sound.registerSound("assets/Audio/Sounds/PoliceSiren.mp3", "overworld");
        createjs.Sound.play("overworld");

        ctrl.location = "grid";
        ctrl.goText = {};
        ctrl.go = function(location) {
            return function() {
                ctrl.type("");
                ctrl.location = location;

                if(location === "grid") {
                    ctrl.actions = ctrl.grid[ctrl.loc].actions || [];
                    ctrl.special = [];
                }
                if(ctrl.goText[location]) {
                    ctrl.type(r.one(ctrl.goText[location]));
                }
            };
        };

        require("./comps/achievements")(ctrl);
        //ugh
        ctrl.vletter = require("./comps/letter")(ctrl);
        ctrl.vevents = require("./comps/events")(ctrl);
        ctrl.vresources = require("./comps/resources")(ctrl);
        ctrl.vgrid = require("./comps/grid")(ctrl);
        ctrl.vhome = require("./comps/home")(ctrl);
        ctrl.vstore = require("./comps/store")(ctrl);
        ctrl.vschool = require("./comps/school")(ctrl);
        ctrl.vwork = require("./comps/work")(ctrl);
        ctrl["vgame-over"] = require("./comps/game-over")(ctrl);
        ctrl.vactions = require("./comps/actions")(ctrl);
        ctrl.vspecial = require("./comps/special")(ctrl);
        ctrl.vbar = require("./comps/bar")(ctrl);
        ctrl.vdrunk = require("./comps/drunk")(ctrl);
        ctrl["vpassed-out"] = require("./comps/passed-out")(ctrl);
    }
});

},{"./comps/achievements":1,"./comps/actions":2,"./comps/bar":3,"./comps/drunk":4,"./comps/events":5,"./comps/game-over":6,"./comps/grid":7,"./comps/home":8,"./comps/letter":9,"./comps/passed-out":11,"./comps/random":12,"./comps/resources":13,"./comps/school":14,"./comps/special":15,"./comps/store":16,"./comps/work":17,"mithril":19}],19:[function(require,module,exports){
var m = (function app(window, undefined) {
	var OBJECT = "[object Object]", ARRAY = "[object Array]", STRING = "[object String]", FUNCTION = "function";
	var type = {}.toString;
	var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g, attrParser = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;
	var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;

	// caching commonly used variables
	var $document, $location, $requestAnimationFrame, $cancelAnimationFrame;

	// self invoking function needed because of the way mocks work
	function initialize(window){
		$document = window.document;
		$location = window.location;
		$cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
		$requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
	}

	initialize(window);


	/**
	 * @typedef {String} Tag
	 * A string that looks like -> div.classname#id[param=one][param2=two]
	 * Which describes a DOM node
	 */

	/**
	 *
	 * @param {Tag} The DOM node tag
	 * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
	 * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array, or splat (optional)
	 *
	 */
	function m() {
		var args = [].slice.call(arguments);
		var hasAttrs = args[1] != null && type.call(args[1]) === OBJECT && !("tag" in args[1]) && !("subtree" in args[1]);
		var attrs = hasAttrs ? args[1] : {};
		var classAttrName = "class" in attrs ? "class" : "className";
		var cell = {tag: "div", attrs: {}};
		var match, classes = [];
		if (type.call(args[0]) != STRING) throw new Error("selector in m(selector, attrs, children) should be a string")
		while (match = parser.exec(args[0])) {
			if (match[1] === "" && match[2]) cell.tag = match[2];
			else if (match[1] === "#") cell.attrs.id = match[2];
			else if (match[1] === ".") classes.push(match[2]);
			else if (match[3][0] === "[") {
				var pair = attrParser.exec(match[3]);
				cell.attrs[pair[1]] = pair[3] || (pair[2] ? "" :true)
			}
		}
		if (classes.length > 0) cell.attrs[classAttrName] = classes.join(" ");


		var children = hasAttrs ? args.slice(2) : args.slice(1);
		if (children.length === 1 && type.call(children[0]) === ARRAY) {
			cell.children = children[0]
		}
		else {
			cell.children = children
		}

		for (var attrName in attrs) {
			if (attrName === classAttrName) {
				var className = cell.attrs[attrName]
				cell.attrs[attrName] = (className && attrs[attrName] ? className + " " : className || "") + attrs[attrName];
			}
			else cell.attrs[attrName] = attrs[attrName]
		}
		return cell
	}
	function build(parentElement, parentTag, parentCache, parentIndex, data, cached, shouldReattach, index, editable, namespace, configs) {
		//`build` is a recursive function that manages creation/diffing/removal of DOM elements based on comparison between `data` and `cached`
		//the diff algorithm can be summarized as this:
		//1 - compare `data` and `cached`
		//2 - if they are different, copy `data` to `cached` and update the DOM based on what the difference is
		//3 - recursively apply this algorithm for every array and for the children of every virtual element

		//the `cached` data structure is essentially the same as the previous redraw's `data` data structure, with a few additions:
		//- `cached` always has a property called `nodes`, which is a list of DOM elements that correspond to the data represented by the respective virtual element
		//- in order to support attaching `nodes` as a property of `cached`, `cached` is *always* a non-primitive object, i.e. if the data was a string, then cached is a String instance. If data was `null` or `undefined`, cached is `new String("")`
		//- `cached also has a `configContext` property, which is the state storage object exposed by config(element, isInitialized, context)
		//- when `cached` is an Object, it represents a virtual element; when it's an Array, it represents a list of elements; when it's a String, Number or Boolean, it represents a text node

		//`parentElement` is a DOM element used for W3C DOM API calls
		//`parentTag` is only used for handling a corner case for textarea values
		//`parentCache` is used to remove nodes in some multi-node cases
		//`parentIndex` and `index` are used to figure out the offset of nodes. They're artifacts from before arrays started being flattened and are likely refactorable
		//`data` and `cached` are, respectively, the new and old nodes being diffed
		//`shouldReattach` is a flag indicating whether a parent node was recreated (if so, and if this node is reused, then this node must reattach itself to the new parent)
		//`editable` is a flag that indicates whether an ancestor is contenteditable
		//`namespace` indicates the closest HTML namespace as it cascades down from an ancestor
		//`configs` is a list of config functions to run after the topmost `build` call finishes running

		//there's logic that relies on the assumption that null and undefined data are equivalent to empty strings
		//- this prevents lifecycle surprises from procedural helpers that mix implicit and explicit return statements (e.g. function foo() {if (cond) return m("div")}
		//- it simplifies diffing code
		//data.toString() is null if data is the return value of Console.log in Firefox
		try {if (data == null || data.toString() == null) data = "";} catch (e) {data = ""}
		if (data.subtree === "retain") return cached;
		var cachedType = type.call(cached), dataType = type.call(data);
		if (cached == null || cachedType !== dataType) {
			if (cached != null) {
				if (parentCache && parentCache.nodes) {
					var offset = index - parentIndex;
					var end = offset + (dataType === ARRAY ? data : cached.nodes).length;
					clear(parentCache.nodes.slice(offset, end), parentCache.slice(offset, end))
				}
				else if (cached.nodes) clear(cached.nodes, cached)
			}
			cached = new data.constructor;
			if (cached.tag) cached = {}; //if constructor creates a virtual dom element, use a blank object as the base cached node instead of copying the virtual el (#277)
			cached.nodes = []
		}

		if (dataType === ARRAY) {
			//recursively flatten array
			for (var i = 0, len = data.length; i < len; i++) {
				if (type.call(data[i]) === ARRAY) {
					data = data.concat.apply([], data);
					i-- //check current index again and flatten until there are no more nested arrays at that index
					len = data.length
				}
			}
			
			var nodes = [], intact = cached.length === data.length, subArrayCount = 0;

			//keys algorithm: sort elements without recreating them if keys are present
			//1) create a map of all existing keys, and mark all for deletion
			//2) add new keys to map and mark them for addition
			//3) if key exists in new list, change action from deletion to a move
			//4) for each key, handle its corresponding action as marked in previous steps
			var DELETION = 1, INSERTION = 2 , MOVE = 3;
			var existing = {}, unkeyed = [], shouldMaintainIdentities = false;
			for (var i = 0; i < cached.length; i++) {
				if (cached[i] && cached[i].attrs && cached[i].attrs.key != null) {
					shouldMaintainIdentities = true;
					existing[cached[i].attrs.key] = {action: DELETION, index: i}
				}
			}
			
			var guid = 0
			for (var i = 0, len = data.length; i < len; i++) {
				if (data[i] && data[i].attrs && data[i].attrs.key != null) {
					for (var j = 0, len = data.length; j < len; j++) {
						if (data[j] && data[j].attrs && data[j].attrs.key == null) data[j].attrs.key = "__mithril__" + guid++
					}
					break
				}
			}
			
			if (shouldMaintainIdentities) {
				var keysDiffer = false
				if (data.length != cached.length) keysDiffer = true
				else for (var i = 0, cachedCell, dataCell; cachedCell = cached[i], dataCell = data[i]; i++) {
					if (cachedCell.attrs && dataCell.attrs && cachedCell.attrs.key != dataCell.attrs.key) {
						keysDiffer = true
						break
					}
				}
				
				if (keysDiffer) {
					for (var i = 0, len = data.length; i < len; i++) {
						if (data[i] && data[i].attrs) {
							if (data[i].attrs.key != null) {
								var key = data[i].attrs.key;
								if (!existing[key]) existing[key] = {action: INSERTION, index: i};
								else existing[key] = {
									action: MOVE,
									index: i,
									from: existing[key].index,
									element: cached.nodes[existing[key].index] || $document.createElement("div")
								}
							}
						}
					}
					var actions = []
					for (var prop in existing) actions.push(existing[prop])
					var changes = actions.sort(sortChanges);
					var newCached = new Array(cached.length)
					newCached.nodes = cached.nodes.slice()

					for (var i = 0, change; change = changes[i]; i++) {
						if (change.action === DELETION) {
							clear(cached[change.index].nodes, cached[change.index]);
							newCached.splice(change.index, 1)
						}
						if (change.action === INSERTION) {
							var dummy = $document.createElement("div");
							dummy.key = data[change.index].attrs.key;
							parentElement.insertBefore(dummy, parentElement.childNodes[change.index] || null);
							newCached.splice(change.index, 0, {attrs: {key: data[change.index].attrs.key}, nodes: [dummy]})
							newCached.nodes[change.index] = dummy
						}

						if (change.action === MOVE) {
							if (parentElement.childNodes[change.index] !== change.element && change.element !== null) {
								parentElement.insertBefore(change.element, parentElement.childNodes[change.index] || null)
							}
							newCached[change.index] = cached[change.from]
							newCached.nodes[change.index] = change.element
						}
					}
					cached = newCached;
				}
			}
			//end key algorithm

			for (var i = 0, cacheCount = 0, len = data.length; i < len; i++) {
				//diff each item in the array
				var item = build(parentElement, parentTag, cached, index, data[i], cached[cacheCount], shouldReattach, index + subArrayCount || subArrayCount, editable, namespace, configs);
				if (item === undefined) continue;
				if (!item.nodes.intact) intact = false;
				if (item.$trusted) {
					//fix offset of next element if item was a trusted string w/ more than one html element
					//the first clause in the regexp matches elements
					//the second clause (after the pipe) matches text nodes
					subArrayCount += (item.match(/<[^\/]|\>\s*[^<]/g) || [0]).length
				}
				else subArrayCount += type.call(item) === ARRAY ? item.length : 1;
				cached[cacheCount++] = item
			}
			if (!intact) {
				//diff the array itself
				
				//update the list of DOM nodes by collecting the nodes from each item
				for (var i = 0, len = data.length; i < len; i++) {
					if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes)
				}
				//remove items from the end of the array if the new array is shorter than the old one
				//if errors ever happen here, the issue is most likely a bug in the construction of the `cached` data structure somewhere earlier in the program
				for (var i = 0, node; node = cached.nodes[i]; i++) {
					if (node.parentNode != null && nodes.indexOf(node) < 0) clear([node], [cached[i]])
				}
				if (data.length < cached.length) cached.length = data.length;
				cached.nodes = nodes
			}
		}
		else if (data != null && dataType === OBJECT) {
			if (!data.attrs) data.attrs = {};
			if (!cached.attrs) cached.attrs = {};

			var dataAttrKeys = Object.keys(data.attrs)
			var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0)
			//if an element is different enough from the one in cache, recreate it
			if (data.tag != cached.tag || dataAttrKeys.join() != Object.keys(cached.attrs).join() || data.attrs.id != cached.attrs.id || (m.redraw.strategy() == "all" && cached.configContext && cached.configContext.retain !== true) || (m.redraw.strategy() == "diff" && cached.configContext && cached.configContext.retain === false)) {
				if (cached.nodes.length) clear(cached.nodes);
				if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) cached.configContext.onunload()
			}
			if (type.call(data.tag) != STRING) return;

			var node, isNew = cached.nodes.length === 0;
			if (data.attrs.xmlns) namespace = data.attrs.xmlns;
			else if (data.tag === "svg") namespace = "http://www.w3.org/2000/svg";
			else if (data.tag === "math") namespace = "http://www.w3.org/1998/Math/MathML";
			if (isNew) {
				if (data.attrs.is) node = namespace === undefined ? $document.createElement(data.tag, data.attrs.is) : $document.createElementNS(namespace, data.tag, data.attrs.is);
				else node = namespace === undefined ? $document.createElement(data.tag) : $document.createElementNS(namespace, data.tag);
				cached = {
					tag: data.tag,
					//set attributes first, then create children
					attrs: hasKeys ? setAttributes(node, data.tag, data.attrs, {}, namespace) : data.attrs,
					children: data.children != null && data.children.length > 0 ?
						build(node, data.tag, undefined, undefined, data.children, cached.children, true, 0, data.attrs.contenteditable ? node : editable, namespace, configs) :
						data.children,
					nodes: [node]
				};
				if (cached.children && !cached.children.nodes) cached.children.nodes = [];
				//edge case: setting value on <select> doesn't work before children exist, so set it again after children have been created
				if (data.tag === "select" && data.attrs.value) setAttributes(node, data.tag, {value: data.attrs.value}, {}, namespace);
				parentElement.insertBefore(node, parentElement.childNodes[index] || null)
			}
			else {
				node = cached.nodes[0];
				if (hasKeys) setAttributes(node, data.tag, data.attrs, cached.attrs, namespace);
				cached.children = build(node, data.tag, undefined, undefined, data.children, cached.children, false, 0, data.attrs.contenteditable ? node : editable, namespace, configs);
				cached.nodes.intact = true;
				if (shouldReattach === true && node != null) parentElement.insertBefore(node, parentElement.childNodes[index] || null)
			}
			//schedule configs to be called. They are called after `build` finishes running
			if (typeof data.attrs["config"] === FUNCTION) {
				var context = cached.configContext = cached.configContext || {retain: (m.redraw.strategy() == "diff") || undefined};

				// bind
				var callback = function(data, args) {
					return function() {
						return data.attrs["config"].apply(data, args)
					}
				};
				configs.push(callback(data, [node, !isNew, context, cached]))
			}
		}
		else if (typeof data != FUNCTION) {
			//handle text nodes
			var nodes;
			if (cached.nodes.length === 0) {
				if (data.$trusted) {
					nodes = injectHTML(parentElement, index, data)
				}
				else {
					nodes = [$document.createTextNode(data)];
					if (!parentElement.nodeName.match(voidElements)) parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null)
				}
				cached = "string number boolean".indexOf(typeof data) > -1 ? new data.constructor(data) : data;
				cached.nodes = nodes
			}
			else if (cached.valueOf() !== data.valueOf() || shouldReattach === true) {
				nodes = cached.nodes;
				if (!editable || editable !== $document.activeElement) {
					if (data.$trusted) {
						clear(nodes, cached);
						nodes = injectHTML(parentElement, index, data)
					}
					else {
						//corner case: replacing the nodeValue of a text node that is a child of a textarea/contenteditable doesn't work
						//we need to update the value property of the parent textarea or the innerHTML of the contenteditable element instead
						if (parentTag === "textarea") parentElement.value = data;
						else if (editable) editable.innerHTML = data;
						else {
							if (nodes[0].nodeType === 1 || nodes.length > 1) { //was a trusted string
								clear(cached.nodes, cached);
								nodes = [$document.createTextNode(data)]
							}
							parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null);
							nodes[0].nodeValue = data
						}
					}
				}
				cached = new data.constructor(data);
				cached.nodes = nodes
			}
			else cached.nodes.intact = true
		}

		return cached
	}
	function sortChanges(a, b) {return a.action - b.action || a.index - b.index}
	function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
		for (var attrName in dataAttrs) {
			var dataAttr = dataAttrs[attrName];
			var cachedAttr = cachedAttrs[attrName];
			if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr)) {
				cachedAttrs[attrName] = dataAttr;
				try {
					//`config` isn't a real attributes, so ignore it
					if (attrName === "config" || attrName == "key") continue;
					//hook event handlers to the auto-redrawing system
					else if (typeof dataAttr === FUNCTION && attrName.indexOf("on") === 0) {
						node[attrName] = autoredraw(dataAttr, node)
					}
					//handle `style: {...}`
					else if (attrName === "style" && dataAttr != null && type.call(dataAttr) === OBJECT) {
						for (var rule in dataAttr) {
							if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) node.style[rule] = dataAttr[rule]
						}
						for (var rule in cachedAttr) {
							if (!(rule in dataAttr)) node.style[rule] = ""
						}
					}
					//handle SVG
					else if (namespace != null) {
						if (attrName === "href") node.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataAttr);
						else if (attrName === "className") node.setAttribute("class", dataAttr);
						else node.setAttribute(attrName, dataAttr)
					}
					//handle cases that are properties (but ignore cases where we should use setAttribute instead)
					//- list and form are typically used as strings, but are DOM element references in js
					//- when using CSS selectors (e.g. `m("[style='']")`), style is used as a string, but it's an object in js
					else if (attrName in node && !(attrName === "list" || attrName === "style" || attrName === "form" || attrName === "type" || attrName === "width" || attrName === "height")) {
						//#348 don't set the value if not needed otherwise cursor placement breaks in Chrome
						if (tag !== "input" || node[attrName] !== dataAttr) node[attrName] = dataAttr
					}
					else node.setAttribute(attrName, dataAttr)
				}
				catch (e) {
					//swallow IE's invalid argument errors to mimic HTML's fallback-to-doing-nothing-on-invalid-attributes behavior
					if (e.message.indexOf("Invalid argument") < 0) throw e
				}
			}
			//#348 dataAttr may not be a string, so use loose comparison (double equal) instead of strict (triple equal)
			else if (attrName === "value" && tag === "input" && node.value != dataAttr) {
				node.value = dataAttr
			}
		}
		return cachedAttrs
	}
	function clear(nodes, cached) {
		for (var i = nodes.length - 1; i > -1; i--) {
			if (nodes[i] && nodes[i].parentNode) {
				try {nodes[i].parentNode.removeChild(nodes[i])}
				catch (e) {} //ignore if this fails due to order of events (see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
				cached = [].concat(cached);
				if (cached[i]) unload(cached[i])
			}
		}
		if (nodes.length != 0) nodes.length = 0
	}
	function unload(cached) {
		if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) {
			cached.configContext.onunload();
			cached.configContext.onunload = null
		}
		if (cached.children) {
			if (type.call(cached.children) === ARRAY) {
				for (var i = 0, child; child = cached.children[i]; i++) unload(child)
			}
			else if (cached.children.tag) unload(cached.children)
		}
	}
	function injectHTML(parentElement, index, data) {
		var nextSibling = parentElement.childNodes[index];
		if (nextSibling) {
			var isElement = nextSibling.nodeType != 1;
			var placeholder = $document.createElement("span");
			if (isElement) {
				parentElement.insertBefore(placeholder, nextSibling || null);
				placeholder.insertAdjacentHTML("beforebegin", data);
				parentElement.removeChild(placeholder)
			}
			else nextSibling.insertAdjacentHTML("beforebegin", data)
		}
		else parentElement.insertAdjacentHTML("beforeend", data);
		var nodes = [];
		while (parentElement.childNodes[index] !== nextSibling) {
			nodes.push(parentElement.childNodes[index]);
			index++
		}
		return nodes
	}
	function autoredraw(callback, object) {
		return function(e) {
			e = e || event;
			m.redraw.strategy("diff");
			m.startComputation();
			try {return callback.call(object, e)}
			finally {
				endFirstComputation()
			}
		}
	}

	var html;
	var documentNode = {
		appendChild: function(node) {
			if (html === undefined) html = $document.createElement("html");
			if ($document.documentElement && $document.documentElement !== node) {
				$document.replaceChild(node, $document.documentElement)
			}
			else $document.appendChild(node);
			this.childNodes = $document.childNodes
		},
		insertBefore: function(node) {
			this.appendChild(node)
		},
		childNodes: []
	};
	var nodeCache = [], cellCache = {};
	m.render = function(root, cell, forceRecreation) {
		var configs = [];
		if (!root) throw new Error("Please ensure the DOM element exists before rendering a template into it.");
		var id = getCellCacheKey(root);
		var isDocumentRoot = root === $document;
		var node = isDocumentRoot || root === $document.documentElement ? documentNode : root;
		if (isDocumentRoot && cell.tag != "html") cell = {tag: "html", attrs: {}, children: cell};
		if (cellCache[id] === undefined) clear(node.childNodes);
		if (forceRecreation === true) reset(root);
		cellCache[id] = build(node, null, undefined, undefined, cell, cellCache[id], false, 0, null, undefined, configs);
		for (var i = 0, len = configs.length; i < len; i++) configs[i]()
	};
	function getCellCacheKey(element) {
		var index = nodeCache.indexOf(element);
		return index < 0 ? nodeCache.push(element) - 1 : index
	}

	m.trust = function(value) {
		value = new String(value);
		value.$trusted = true;
		return value
	};

	function gettersetter(store) {
		var prop = function() {
			if (arguments.length) store = arguments[0];
			return store
		};

		prop.toJSON = function() {
			return store
		};

		return prop
	}

	m.prop = function (store) {
		//note: using non-strict equality check here because we're checking if store is null OR undefined
		if (((store != null && type.call(store) === OBJECT) || typeof store === FUNCTION) && typeof store.then === FUNCTION) {
			return propify(store)
		}

		return gettersetter(store)
	};

	var roots = [], modules = [], controllers = [], lastRedrawId = null, lastRedrawCallTime = 0, computePostRedrawHook = null, prevented = false, topModule;
	var FRAME_BUDGET = 16; //60 frames per second = 1 call per 16 ms
	m.module = function(root, module) {
		if (!root) throw new Error("Please ensure the DOM element exists before rendering a template into it.");
		var index = roots.indexOf(root);
		if (index < 0) index = roots.length;
		var isPrevented = false;
		if (controllers[index] && typeof controllers[index].onunload === FUNCTION) {
			var event = {
				preventDefault: function() {isPrevented = true}
			};
			controllers[index].onunload(event)
		}
		if (!isPrevented) {
			m.redraw.strategy("all");
			m.startComputation();
			roots[index] = root;
			var currentModule = topModule = module = module || {};
			var controller = new (module.controller || function() {});
			//controllers may call m.module recursively (via m.route redirects, for example)
			//this conditional ensures only the last recursive m.module call is applied
			if (currentModule === topModule) {
				controllers[index] = controller;
				modules[index] = module
			}
			endFirstComputation();
			return controllers[index]
		}
	};
	m.redraw = function(force) {
		//lastRedrawId is a positive number if a second redraw is requested before the next animation frame
		//lastRedrawID is null if it's the first redraw and not an event handler
		if (lastRedrawId && force !== true) {
			//when setTimeout: only reschedule redraw if time between now and previous redraw is bigger than a frame, otherwise keep currently scheduled timeout
			//when rAF: always reschedule redraw
			if (new Date - lastRedrawCallTime > FRAME_BUDGET || $requestAnimationFrame === window.requestAnimationFrame) {
				if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId);
				lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET)
			}
		}
		else {
			redraw();
			lastRedrawId = $requestAnimationFrame(function() {lastRedrawId = null}, FRAME_BUDGET)
		}
	};
	m.redraw.strategy = m.prop();
	var blank = function() {return ""}
	function redraw() {
		for (var i = 0, root; root = roots[i]; i++) {
			if (controllers[i]) {
				m.render(root, modules[i].view ? modules[i].view(controllers[i]) : blank())
			}
		}
		//after rendering within a routed context, we need to scroll back to the top, and fetch the document title for history.pushState
		if (computePostRedrawHook) {
			computePostRedrawHook();
			computePostRedrawHook = null
		}
		lastRedrawId = null;
		lastRedrawCallTime = new Date;
		m.redraw.strategy("diff")
	}

	var pendingRequests = 0;
	m.startComputation = function() {pendingRequests++};
	m.endComputation = function() {
		pendingRequests = Math.max(pendingRequests - 1, 0);
		if (pendingRequests === 0) m.redraw()
	};
	var endFirstComputation = function() {
		if (m.redraw.strategy() == "none") {
			pendingRequests--
			m.redraw.strategy("diff")
		}
		else m.endComputation();
	}

	m.withAttr = function(prop, withAttrCallback) {
		return function(e) {
			e = e || event;
			var currentTarget = e.currentTarget || this;
			withAttrCallback(prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop))
		}
	};

	//routing
	var modes = {pathname: "", hash: "#", search: "?"};
	var redirect = function() {}, routeParams, currentRoute;
	m.route = function() {
		//m.route()
		if (arguments.length === 0) return currentRoute;
		//m.route(el, defaultRoute, routes)
		else if (arguments.length === 3 && type.call(arguments[1]) === STRING) {
			var root = arguments[0], defaultRoute = arguments[1], router = arguments[2];
			redirect = function(source) {
				var path = currentRoute = normalizeRoute(source);
				if (!routeByValue(root, router, path)) {
					m.route(defaultRoute, true)
				}
			};
			var listener = m.route.mode === "hash" ? "onhashchange" : "onpopstate";
			window[listener] = function() {
				var path = $location[m.route.mode]
				if (m.route.mode === "pathname") path += $location.search
				if (currentRoute != normalizeRoute(path)) {
					redirect(path)
				}
			};
			computePostRedrawHook = setScroll;
			window[listener]()
		}
		//config: m.route
		else if (arguments[0].addEventListener || arguments[0].attachEvent) {
			var element = arguments[0];
			var isInitialized = arguments[1];
			var context = arguments[2];
			element.href = (m.route.mode !== 'pathname' ? $location.pathname : '') + modes[m.route.mode] + this.attrs.href;
			if (element.addEventListener) {
				element.removeEventListener("click", routeUnobtrusive);
				element.addEventListener("click", routeUnobtrusive)
			}
			else {
				element.detachEvent("onclick", routeUnobtrusive);
				element.attachEvent("onclick", routeUnobtrusive)
			}
		}
		//m.route(route, params)
		else if (type.call(arguments[0]) === STRING) {
			var oldRoute = currentRoute;
			currentRoute = arguments[0];
			var args = arguments[1] || {}
			var queryIndex = currentRoute.indexOf("?")
			var params = queryIndex > -1 ? parseQueryString(currentRoute.slice(queryIndex + 1)) : {}
			for (var i in args) params[i] = args[i]
			var querystring = buildQueryString(params)
			var currentPath = queryIndex > -1 ? currentRoute.slice(0, queryIndex) : currentRoute
			if (querystring) currentRoute = currentPath + (currentPath.indexOf("?") === -1 ? "?" : "&") + querystring;

			var shouldReplaceHistoryEntry = (arguments.length === 3 ? arguments[2] : arguments[1]) === true || oldRoute === arguments[0];

			if (window.history.pushState) {
				computePostRedrawHook = function() {
					window.history[shouldReplaceHistoryEntry ? "replaceState" : "pushState"](null, $document.title, modes[m.route.mode] + currentRoute);
					setScroll()
				};
				redirect(modes[m.route.mode] + currentRoute)
			}
			else {
				$location[m.route.mode] = currentRoute
				redirect(modes[m.route.mode] + currentRoute)
			}
		}
	};
	m.route.param = function(key) {
		if (!routeParams) throw new Error("You must call m.route(element, defaultRoute, routes) before calling m.route.param()")
		return routeParams[key]
	};
	m.route.mode = "search";
	function normalizeRoute(route) {
		return route.slice(modes[m.route.mode].length)
	}
	function routeByValue(root, router, path) {
		routeParams = {};

		var queryStart = path.indexOf("?");
		if (queryStart !== -1) {
			routeParams = parseQueryString(path.substr(queryStart + 1, path.length));
			path = path.substr(0, queryStart)
		}

		// Get all routes and check if there's
		// an exact match for the current path
		var keys = Object.keys(router);
		var index = keys.indexOf(path);
		if(index !== -1){
			m.module(root, router[keys [index]]);
			return true;
		}

		for (var route in router) {
			if (route === path) {
				m.module(root, router[route]);
				return true
			}

			var matcher = new RegExp("^" + route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");

			if (matcher.test(path)) {
				path.replace(matcher, function() {
					var keys = route.match(/:[^\/]+/g) || [];
					var values = [].slice.call(arguments, 1, -2);
					for (var i = 0, len = keys.length; i < len; i++) routeParams[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
					m.module(root, router[route])
				});
				return true
			}
		}
	}
	function routeUnobtrusive(e) {
		e = e || event;
		if (e.ctrlKey || e.metaKey || e.which === 2) return;
		if (e.preventDefault) e.preventDefault();
		else e.returnValue = false;
		var currentTarget = e.currentTarget || e.srcElement;
		var args = m.route.mode === "pathname" && currentTarget.search ? parseQueryString(currentTarget.search.slice(1)) : {};
		while (currentTarget && currentTarget.nodeName.toUpperCase() != "A") currentTarget = currentTarget.parentNode
		m.route(currentTarget[m.route.mode].slice(modes[m.route.mode].length), args)
	}
	function setScroll() {
		if (m.route.mode != "hash" && $location.hash) $location.hash = $location.hash;
		else window.scrollTo(0, 0)
	}
	function buildQueryString(object, prefix) {
		var duplicates = {}
		var str = []
		for (var prop in object) {
			var key = prefix ? prefix + "[" + prop + "]" : prop
			var value = object[prop]
			var valueType = type.call(value)
			var pair = (value === null) ? encodeURIComponent(key) :
				valueType === OBJECT ? buildQueryString(value, key) :
				valueType === ARRAY ? value.reduce(function(memo, item) {
					if (!duplicates[key]) duplicates[key] = {}
					if (!duplicates[key][item]) {
						duplicates[key][item] = true
						return memo.concat(encodeURIComponent(key) + "=" + encodeURIComponent(item))
					}
					return memo
				}, []).join("&") :
				encodeURIComponent(key) + "=" + encodeURIComponent(value)
			if (value !== undefined) str.push(pair)
		}
		return str.join("&")
	}
	function parseQueryString(str) {
		var pairs = str.split("&"), params = {};
		for (var i = 0, len = pairs.length; i < len; i++) {
			var pair = pairs[i].split("=");
			var key = decodeURIComponent(pair[0])
			var value = pair.length == 2 ? decodeURIComponent(pair[1]) : null
			if (params[key] != null) {
				if (type.call(params[key]) !== ARRAY) params[key] = [params[key]]
				params[key].push(value)
			}
			else params[key] = value
		}
		return params
	}
	m.route.buildQueryString = buildQueryString
	m.route.parseQueryString = parseQueryString
	
	function reset(root) {
		var cacheKey = getCellCacheKey(root);
		clear(root.childNodes, cellCache[cacheKey]);
		cellCache[cacheKey] = undefined
	}

	m.deferred = function () {
		var deferred = new Deferred();
		deferred.promise = propify(deferred.promise);
		return deferred
	};
	function propify(promise, initialValue) {
		var prop = m.prop(initialValue);
		promise.then(prop);
		prop.then = function(resolve, reject) {
			return propify(promise.then(resolve, reject), initialValue)
		};
		return prop
	}
	//Promiz.mithril.js | Zolmeister | MIT
	//a modified version of Promiz.js, which does not conform to Promises/A+ for two reasons:
	//1) `then` callbacks are called synchronously (because setTimeout is too slow, and the setImmediate polyfill is too big
	//2) throwing subclasses of Error cause the error to be bubbled up instead of triggering rejection (because the spec does not account for the important use case of default browser error handling, i.e. message w/ line number)
	function Deferred(successCallback, failureCallback) {
		var RESOLVING = 1, REJECTING = 2, RESOLVED = 3, REJECTED = 4;
		var self = this, state = 0, promiseValue = 0, next = [];

		self["promise"] = {};

		self["resolve"] = function(value) {
			if (!state) {
				promiseValue = value;
				state = RESOLVING;

				fire()
			}
			return this
		};

		self["reject"] = function(value) {
			if (!state) {
				promiseValue = value;
				state = REJECTING;

				fire()
			}
			return this
		};

		self.promise["then"] = function(successCallback, failureCallback) {
			var deferred = new Deferred(successCallback, failureCallback);
			if (state === RESOLVED) {
				deferred.resolve(promiseValue)
			}
			else if (state === REJECTED) {
				deferred.reject(promiseValue)
			}
			else {
				next.push(deferred)
			}
			return deferred.promise
		};

		function finish(type) {
			state = type || REJECTED;
			next.map(function(deferred) {
				state === RESOLVED && deferred.resolve(promiseValue) || deferred.reject(promiseValue)
			})
		}

		function thennable(then, successCallback, failureCallback, notThennableCallback) {
			if (((promiseValue != null && type.call(promiseValue) === OBJECT) || typeof promiseValue === FUNCTION) && typeof then === FUNCTION) {
				try {
					// count protects against abuse calls from spec checker
					var count = 0;
					then.call(promiseValue, function(value) {
						if (count++) return;
						promiseValue = value;
						successCallback()
					}, function (value) {
						if (count++) return;
						promiseValue = value;
						failureCallback()
					})
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					failureCallback()
				}
			} else {
				notThennableCallback()
			}
		}

		function fire() {
			// check if it's a thenable
			var then;
			try {
				then = promiseValue && promiseValue.then
			}
			catch (e) {
				m.deferred.onerror(e);
				promiseValue = e;
				state = REJECTING;
				return fire()
			}
			thennable(then, function() {
				state = RESOLVING;
				fire()
			}, function() {
				state = REJECTING;
				fire()
			}, function() {
				try {
					if (state === RESOLVING && typeof successCallback === FUNCTION) {
						promiseValue = successCallback(promiseValue)
					}
					else if (state === REJECTING && typeof failureCallback === "function") {
						promiseValue = failureCallback(promiseValue);
						state = RESOLVING
					}
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					return finish()
				}

				if (promiseValue === self) {
					promiseValue = TypeError();
					finish()
				}
				else {
					thennable(then, function () {
						finish(RESOLVED)
					}, finish, function () {
						finish(state === RESOLVING && RESOLVED)
					})
				}
			})
		}
	}
	m.deferred.onerror = function(e) {
		if (type.call(e) === "[object Error]" && !e.constructor.toString().match(/ Error/)) throw e
	};

	m.sync = function(args) {
		var method = "resolve";
		function synchronizer(pos, resolved) {
			return function(value) {
				results[pos] = value;
				if (!resolved) method = "reject";
				if (--outstanding === 0) {
					deferred.promise(results);
					deferred[method](results)
				}
				return value
			}
		}

		var deferred = m.deferred();
		var outstanding = args.length;
		var results = new Array(outstanding);
		if (args.length > 0) {
			for (var i = 0; i < args.length; i++) {
				args[i].then(synchronizer(i, true), synchronizer(i, false))
			}
		}
		else deferred.resolve([]);

		return deferred.promise
	};
	function identity(value) {return value}

	function ajax(options) {
		if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
			var callbackKey = "mithril_callback_" + new Date().getTime() + "_" + (Math.round(Math.random() * 1e16)).toString(36);
			var script = $document.createElement("script");

			window[callbackKey] = function(resp) {
				script.parentNode.removeChild(script);
				options.onload({
					type: "load",
					target: {
						responseText: resp
					}
				});
				window[callbackKey] = undefined
			};

			script.onerror = function(e) {
				script.parentNode.removeChild(script);

				options.onerror({
					type: "error",
					target: {
						status: 500,
						responseText: JSON.stringify({error: "Error making jsonp request"})
					}
				});
				window[callbackKey] = undefined;

				return false
			};

			script.onload = function(e) {
				return false
			};

			script.src = options.url
				+ (options.url.indexOf("?") > 0 ? "&" : "?")
				+ (options.callbackKey ? options.callbackKey : "callback")
				+ "=" + callbackKey
				+ "&" + buildQueryString(options.data || {});
			$document.body.appendChild(script)
		}
		else {
			var xhr = new window.XMLHttpRequest;
			xhr.open(options.method, options.url, true, options.user, options.password);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status >= 200 && xhr.status < 300) options.onload({type: "load", target: xhr});
					else options.onerror({type: "error", target: xhr})
				}
			};
			if (options.serialize === JSON.stringify && options.data && options.method !== "GET") {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (options.deserialize === JSON.parse) {
				xhr.setRequestHeader("Accept", "application/json, text/*");
			}
			if (typeof options.config === FUNCTION) {
				var maybeXhr = options.config(xhr, options);
				if (maybeXhr != null) xhr = maybeXhr
			}

			var data = options.method === "GET" || !options.data ? "" : options.data
			if (data && (type.call(data) != STRING && data.constructor != window.FormData)) {
				throw "Request data should be either be a string or FormData. Check the `serialize` option in `m.request`";
			}
			xhr.send(data);
			return xhr
		}
	}
	function bindData(xhrOptions, data, serialize) {
		if (xhrOptions.method === "GET" && xhrOptions.dataType != "jsonp") {
			var prefix = xhrOptions.url.indexOf("?") < 0 ? "?" : "&";
			var querystring = buildQueryString(data);
			xhrOptions.url = xhrOptions.url + (querystring ? prefix + querystring : "")
		}
		else xhrOptions.data = serialize(data);
		return xhrOptions
	}
	function parameterizeUrl(url, data) {
		var tokens = url.match(/:[a-z]\w+/gi);
		if (tokens && data) {
			for (var i = 0; i < tokens.length; i++) {
				var key = tokens[i].slice(1);
				url = url.replace(tokens[i], data[key]);
				delete data[key]
			}
		}
		return url
	}

	m.request = function(xhrOptions) {
		if (xhrOptions.background !== true) m.startComputation();
		var deferred = new Deferred();
		var isJSONP = xhrOptions.dataType && xhrOptions.dataType.toLowerCase() === "jsonp";
		var serialize = xhrOptions.serialize = isJSONP ? identity : xhrOptions.serialize || JSON.stringify;
		var deserialize = xhrOptions.deserialize = isJSONP ? identity : xhrOptions.deserialize || JSON.parse;
		var extract = xhrOptions.extract || function(xhr) {
			return xhr.responseText.length === 0 && deserialize === JSON.parse ? null : xhr.responseText
		};
		xhrOptions.url = parameterizeUrl(xhrOptions.url, xhrOptions.data);
		xhrOptions = bindData(xhrOptions, xhrOptions.data, serialize);
		xhrOptions.onload = xhrOptions.onerror = function(e) {
			try {
				e = e || event;
				var unwrap = (e.type === "load" ? xhrOptions.unwrapSuccess : xhrOptions.unwrapError) || identity;
				var response = unwrap(deserialize(extract(e.target, xhrOptions)), e.target);
				if (e.type === "load") {
					if (type.call(response) === ARRAY && xhrOptions.type) {
						for (var i = 0; i < response.length; i++) response[i] = new xhrOptions.type(response[i])
					}
					else if (xhrOptions.type) response = new xhrOptions.type(response)
				}
				deferred[e.type === "load" ? "resolve" : "reject"](response)
			}
			catch (e) {
				m.deferred.onerror(e);
				deferred.reject(e)
			}
			if (xhrOptions.background !== true) m.endComputation()
		};
		ajax(xhrOptions);
		deferred.promise = propify(deferred.promise, xhrOptions.initialValue);
		return deferred.promise
	};

	//testing API
	m.deps = function(mock) {
		initialize(window = mock || window);
		return window;
	};
	//for internal testing only, do not use `m.deps.factory`
	m.deps.factory = app;

	return m
})(typeof window != "undefined" ? window : {});

if (typeof module != "undefined" && module !== null && module.exports) module.exports = m;
else if (typeof define === "function" && define.amd) define(function() {return m});

},{}]},{},[18]);
