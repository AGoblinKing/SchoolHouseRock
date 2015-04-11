var m = require("mithril");

module.exports = function(ctrl) {
    function makeChart(resource) {
        switch(resource) {
            case "health":
            case "happiness":
            case "time":
                return m(".bar." + resource, [
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
            m("h3", resource),
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
        happiness : 100,
        set time(time) {
            this._time = time;
            if(time === 0) {
                this.day++;
                this._time = 100;
                this.health -= 20;
                ctrl.go("passed-out")();
                ctrl.type("You've collapsed in a fit of exhaustion. :(");
            }
        },
        get time() {
            return this._time;
        },
        _time: 100,
        money : 100,
        day : 0
    };

    return function(ctrl) {
        return m(".resources", Object.keys(ctrl.resources).filter(function(res) {
            return res[0] !== "_";
        }).map(makeResource));
    };
};
