var line;

var src = {
    moon: document.getElementById("moon").src,
    earth: document.getElementById("earth").src,
    rocket: document.getElementById("rocket").src,
    rocketFire: document.getElementById("rocketFired").src,
    tower: document.getElementById("tower").src
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

function arc(center, radius, startAngle, endAngle) {
    angle = startAngle;
    coords = toCoords(center, radius, angle);
    path = "M " + coords[0] + " " + coords[1];
    while (angle <= endAngle) {
        coords = toCoords(center, radius, angle);
        path += " L " + coords[0] + " " + coords[1];
        angle += 1;
    }
    return path;
}

function toCoords(center, radius, angle) {
    var radians = (angle / 180) * Math.PI;
    var x = center[0] + Math.cos(radians) * radius;
    var y = center[1] + Math.sin(radians) * radius;
    return [x, y];
}

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

var halfCircle = R.path(arc([screen.width / 2, 73 + (moonData.height / 2)], 65 / 2 + 6, 0, 180)).attr({
    'stroke': 'gray',
    'opacity': 0.8
});
var upperLimit = R.path(["M", 0, 78 + (moonData.height / 2) , "L", screen.width, 78 + (moonData.height / 2)]).attr({
    'stroke': 'gray',
    'opacity': 0.5
});

// (function swingRight(){
//   moon.animate({'transform': "T30,5"}, 1000, '<>', function () {
//     moon.animate({'transform': "T-30,5"}, 1000, '<>', swingRight);
//   });
// }());


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
createRocket = function() {
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
            var arcIntersection = Raphael.pathIntersection(line.attr("path"), halfCircle.attr("path"));
            var limitIntersection = Raphael.pathIntersection(line.attr("path"), upperLimit.attr("path"));

            console.log(arcIntersection.length);
            console.log(limitIntersection.length);

            line.attr({path: ["M", 160, 487.5, "L", 160, 487.5]});

            var deg = -Math.atan(this.data("move").dx / this.data("move").dy) * (180/3.1415);

            //if(arcIntersection.length > 1 && limitIntersection.length < 1) 

            rocket.animate({
                transform: "r" + deg + "T" + this.data("move").dx + "," + this.data("move").dy + "s0.5"
            }, 1500, ">", function() {
                if(arcIntersection.length === 1 && limitIntersection.length === 0) {


                    changePopulation(100);
                    rocket.remove()
                    createRocket();
                } else {
                    rocket.animate({transform:"...s0T"+this.data("move").dx + "," + this.data("move").dy}, 2500, "linear", function() {
                        rocket.hide();
                        rocket.remove();
                        createRocket();
                    });
                    
                }

            });
        }
    };

    var rocket = R.image(src.rocket,
        screen.width / 2 - rocketData.width / 2,
        450,
        rocketData.width,
        rocketData.height)
            .rotate(0)
            .drag(rocketData.dragMove, rocketData.dragStart, rocketData.dragEnd);

    if(typeof line === 'undefined') {
        line = R.path(["M", getCenter(rocket).x, getCenter(rocket).y, "L", getCenter(rocket).x, getCenter(rocket).y]).attr({
            'stroke': "orange",
            'stroke-width': 3,
            'opacity': 0.7
        });
    }
}

createRocket();