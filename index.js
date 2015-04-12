var m = require("mithril"),
    r = require("./comps/random");

m.module(document.body, {
    view : function(ctrl) {
        return m(".hbox.flex", [
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
        ctrl["vpassed-out"] = require("./comps/passed-out")(ctrl);
    }
});
