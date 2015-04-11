var m = require("mithril");

function makeOpt(opt) {
    return m(".option.hbox", {
        onclick : opt.action
    }, opt.name);
};

module.exports = function(opts, classes) {
    classes = classes || " ";
    return m(".menu", {
        class : classes
    }, opts.map(makeOpt));
};
