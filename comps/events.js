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
