var src = {
    moon: document.getElementById("moon").src,
    earth: document.getElementById("earth").src,
    rocket: document.getElementById("rocket").src
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
    height: 75
};
var rocket = R.image(src.rocket,
    screen.width / 2 - rocketData.width / 2,
    450,
    rocketData.width,
    rocketData.height).rotate(0);