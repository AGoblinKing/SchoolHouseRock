var m = require("mithril"),
    r = require("./random");

module.exports = function(ctrl) {
    function makeArr(num) {
        var arr = [];
        for(var i = 0; i < num; i++) {
            var coord = makeCoord(i);
            arr.push({
                x : coord.x,
                y : coord.y,
                n : i
            });
        }

        return arr;
    }

    function makeCoord(grid) {
        return {
            x : grid % 5,
            y : Math.floor(grid/5)
        };
    }

    function nearPlayer(grid) {
        var player = makeCoord(ctrl.loc),
            dist = {
                x : Math.abs(grid.x - player.x),
                y : Math.abs(grid.y - player.y)
            };

        return dist.x === 1 ? dist.y === 0 : dist.y === 1 && dist.x === 0;
    }

    function makeGrid(grid) {
        grid = grid || {};
        var opts = nearPlayer(grid) ? {
            class : "moveable",
            onclick : movePlayer.bind(null, grid)
        } : {};

        return m(".grid.grid-" + grid.type, opts, [
            grid.type || "",
            grid.n  === ctrl.loc ? m(".player") : ""
        ]);
    }

    function movePlayer(grid) {
        ctrl.type(r.one(["Vrrrrooooom!", "kerrr plow", "Zug Zug"]));
        ctrl.resources.time -= ctrl.resources.bus ? 1 : 10;
        ctrl.resources.health -= 2;
        ctrl.resources.happiness -= 2;
        ctrl.loc = grid.n;
        ctrl.actions = grid.actions || [];
    }

    ctrl.loc = 20;
    ctrl.grid = makeArr(25);

    ctrl.grid[1].type = "school";
    ctrl.grid[1].actions = [{
        name : "Enter",
        action : ctrl.go("school")
    }];

    ctrl.grid[9].type = "work";
    ctrl.grid[9].actions = [{
        name : "Enter",
        action : function() {
            ctrl.go("work")();
            ctrl.type("Another day...another dollar");
        }
    }];

    ctrl.grid[20].type = "home";
    ctrl.grid[20].actions = [{
        name : "Enter",
        action : ctrl.go("home")
    }];

    ctrl.grid[12].type = "store";
    ctrl.grid[12].actions = [{
        name : "Enter",
        action : ctrl.go("store")
    }];

    ctrl.grid[24].type = "bar";
    ctrl.grid[24].actions = [{
        name : "Enter",
        action : ctrl.go("bar")
    }, {
        name : "Pee on wall",
        action : function() {
            ctrl.type("You're gross...");
        }
    }];

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

