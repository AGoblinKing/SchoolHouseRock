var m = require("mithril");

function makeArr(num) {
    var arr = [];
    for(var i = 0; i < num; i++) {
        arr.push(null);
    }
    return arr;
}

function makeGrid(grid) {
    grid = grid || {};
    return m(".grid", grid.type || "");
}

module.exports = function(ctrl) {
    ctrl.grid = makeArr(25);
    ctrl.grid[1] = { type : "school" };
    ctrl.grid[9] = { type : "work" };
    ctrl.grid[20] = { type : "home" };
    ctrl.grid[12] = { type : "store" };

    return function(ctrl) {
        return m(".thegrid.vbox.flex", [
            m(".grid-row.hbox.flex", ctrl.grid.slice(0, 5).map(makeGrid)),
            m(".grid-row.hbox.flex", ctrl.grid.slice(5, 10).map(makeGrid)),
            m(".grid-row.hbox.flex", ctrl.grid.slice(10, 15).map(makeGrid)),
            m(".grid-row.hbox.flex", ctrl.grid.slice(15, 20).map(makeGrid)),
            m(".grid-row.hbox.flex", ctrl.grid.slice(20, 25).map(makeGrid))
        ]);
    };
};

