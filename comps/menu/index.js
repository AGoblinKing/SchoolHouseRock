var m = require("mithril");

function makeOpt(opt) {
    return m(".option.hbox", {
        onclick : opt.action
    }, opt.name);
};

module.exports = function(opts) {
    return m(".menu", opts.map(makeOpt));
};
