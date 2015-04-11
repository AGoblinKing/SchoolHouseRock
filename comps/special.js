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
