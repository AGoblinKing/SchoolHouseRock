module.exports = {
    clamp : function(min, max) {
        return Math.round(Math.random()*max);
    },
    one : function(list) {
        return list[this.clamp(0, list.length - 1)];
    }
};
