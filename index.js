var m = require("mithril");

m.module(document.body, {
    view : function(ctrl) {
        return ctrl.vgrid(ctrl);
    },
    controller : function() {
        var ctrl = this;
        ctrl.vgrid = require("./comps/grid")(ctrl);
        ctrl.vhome = require("./comps/home")(ctrl);
    }
});
