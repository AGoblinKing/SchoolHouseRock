var m = require("mithril");

module.exports = function(ctrl) {
    ctrl.letter = true;
    return function(ctrl) {
        return ctrl.letter ? m(".letter", {
            onclick : function() {
                ctrl.letter = false;
            }
        }, "Congratulations on taking your first step toward adulthood, sweetie! You’re finally all moved into your first apartment and all ready for school, and I have never been more proud of you. Just so you know, you won’t have to worry about rent for the first month, I paid it off so you could focus on your studying. I want you to tell me all about what happens as soon as you can. I want to know it all! And, remember who your family is for when you get big and famous. Best of luck! Love you! <br/><br/>" +
               "Love, Mom") : "";
    };
};
