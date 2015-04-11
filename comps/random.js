module.exports = {
    rand : function(min, max) {
        return Math.round(Math.random()*max);
    },
    one : function(list) {
        return list[this.rand(0, list.length - 1)];
    }
};
