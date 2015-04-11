var m = require("mithril"),
    menu = require("../menu");


module.exports = function(ctrl) {
    return function(ctrl) {
        return menu([{
            name : "Sleep"
        }, {
            name : "Leave"
        }]);
    };
};
