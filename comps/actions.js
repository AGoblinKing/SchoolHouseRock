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
