var m = require("mithril");

createjs.Sound.registerSound("assets/Audio/Sounds/ButtonPress.mp3", "ClickButton");
createjs.Sound.registerSound("assets/Audio/Sounds/ButtonMouseOver.mp3", "ButtonMouseOver");

function makeOpt(opt) {
    return m(".option.hbox", {
        onclick : function(){
            createjs.Sound.play("ClickButton");
            opt.action();
        },
        onmouseover : createjs.Sound.play.bind(null, "ButtonMouseOver")
    }, opt.name);
};

module.exports = function(opts, classes) {
    classes = classes || " ";
    return m(".menu", {
        class : classes
    }, opts.map(makeOpt));
};
