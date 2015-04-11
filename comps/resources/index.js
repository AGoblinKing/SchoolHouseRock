var m = require("mithril");

module.exports = function(ctrl) {
    function makeChart(resource) {
        switch(resource) {
            case "health":
            case "happiness":
                return m(".bar." + resource, [
                    m(".fill", {
                        width : ctrl.resources[resource]/100 + "%"
                    })
                ]);
            default:
                return m("." + resource, ctrl.resources[resource]);
        }
    }

    function makeResources(resource) {
        return m(".resource.hbox", [
            m("h2", resource),
            return makeChart(resource)
        ]);
    }

    ctrl.resources = {
        health : 100,
        time : 24,
        money: 100,
        happiness : 100
    };

    return function(ctrl) {
        return m(".resources", Object.keys(ctrl.resources).map(makeResource));
    };
};
