var m = require("mithril");

module.exports = function(ctrl) {
    ctrl.letter = true;
    return function(ctrl) {
        return ctrl.letter ? m(".letter", {
            onclick : function() {
                ctrl.letter = false;
            }
        }, m.trust("Congratulations on getting into college, sweetie! <br/><br/>You’re finally all moved into your first apartment and all ready for school, and I have never been more proud of you.<br/><br/> So you don’t worry, I paid off your first month’s rent. Be sure to call and tell me everything that happens. <br/><br/>Best of luck! Love you! <br/>" +
               "- Mom")) : "";
    };
};
