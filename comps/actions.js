var m = require("mithril"),
    menu = require("./menu");

module.exports = function(ctrl) {
    ctrl.actions = [];

    return function(ctrl) {
        return ctrl.actions.length > 0 ? m(".vbox", [
            m("h3.text-center", "Actions"),
            menu(ctrl.actions)
        ]) : "";
    };
};
