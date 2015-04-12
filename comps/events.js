var m = require("mithril");

createjs.Sound.registerSound("assets/Audio/Sounds/PrinterReadout.mp3", "TypeSound");

module.exports = function(ctrl) {
    ctrl.type = function(typer) {
        
        
        var sound_instance = createjs.Sound.play("TypeSound");
        sound_instance.volume = 0.01;
        
        
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
