var m = require("mithril");

m.module(document.body, {
    view : function(ctrl) {
        return ctrl.home(ctrl);
    },
    controller : function() {
        var ctrl = this;

        ctrl.home = require("./comps/home")(ctrl);
    }
});
