var m = require("mithril"),
    r = require("./random");

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
        money : 100,
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
