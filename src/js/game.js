var src = {
    moon: document.getElementById("moon").src,
    earth: document.getElementById("earth").src,
    rocket: document.getElementById("rocket").src,
    rocketFire: document.getElementById("rocketFired").src
};

document.getElementById("holder").innerHTML = "";

var screen = {
    width: 320,
    height: 568
};

var R = Raphael("holder", screen.width, screen.height);

var labelData = {font: "15px Helvetica Neue", fill: "white"};
var numData = {font: "15px HelveticaNeue-UltraLight"};
var population = {
    label: R.text(42, 12, "Population").attr(labelData),
    num: R.text(100, 12, "0").attr(labelData).attr(numData)
};

var changePopulation = function(n) {
    population.num.attr({text: n + parseInt(population.num.attr("text"))});
}

var getCenter = function(obj) {
    var d = obj.getPointAtLength();
    return {
        x: d.x + (obj.attr("width") / 2),
        y: d.y + (obj.attr("height") / 2)
    };
};

var spin = Raphael.animation({
    transform: "r360"
}, 11000).repeat(Infinity);

// Moon
var moonData = {
    width: 65,
    height: 65
};
var moon = R.image(src.moon,
    screen.width / 2 - moonData.width / 2,
    70,
    moonData.width,
    moonData.height);

moon.animate(spin);


// Earth
var earthData = {
    width: 177,
    height: 177
};
var earth = R.image(src.earth,
    screen.width / 2 - earthData.width / 2,
    500,
    earthData.width,
    earthData.height).rotate(90);

// Rocket
var rocketData = {
    width: 30,
    height: 75,
    firedWidth: 30,
    firedHeight: 105,
    dragStart: function() {
        this.attr({
            src: src.rocket,
            width: rocketData.width,
            height: rocketData.height
        });
        this.data("move", {x:0, y: 0});
    },
    dragMove: function(dx, dy) {
        this.data("move", {
            dx: dx,
            dy: dy,
            x : getCenter(rocket).x + dx,
            y: getCenter(rocket).y + dy
        });
        line.attr({
            path: ["M", getCenter(rocket).x, getCenter(rocket).y, "L", this.data("move").x, this.data("move").y]
        })
    },
    dragEnd: function() {
        this.attr({
            src: src.rocketFire,
            width: rocketData.firedWidth,
            height: rocketData.firedHeight
        });
        console.log(this.data("move"));
        line.attr({path: ["M", 160, 487.5, "L", 160, 487.5]});

        var deg = -Math.atan(this.data("move").dx / this.data("move").dy) * (180/3.1415);

        rocket.animate({transform:"r"+deg+"T"+this.data("move").dx+","+this.data("move").dy+"s0.6"}, 1000);
    }
};

var rocket = R.image(src.rocket,
    screen.width / 2 - rocketData.width / 2,
    450,
    rocketData.width,
    rocketData.height)
        .rotate(0)
        .drag(rocketData.dragMove, rocketData.dragStart, rocketData.dragEnd);

var line = R.path(["M", getCenter(rocket).x, getCenter(rocket).y, "L", getCenter(rocket).x, getCenter(rocket).y]).attr({
    'stroke': "orange",
    'stroke-width': 3,
    'opacity': 0.7
});