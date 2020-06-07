var plotWidth = 800;
var plotHeight = 600;

var paddingHorizontal = 50;
var paddingVertical = 50;

var longRightwardsArrow = "";
var longLeftwardsArrow = "";
var inclLabel = "Inclination = ";
var ascnodeLabel = "Longitude ascending node = ";
var argperiLabel = "Argument perihelion = ";

var inclination = 0;
var inclinationMin = -90;
var inclinationMax = 90;
var inclinationStep = 1;

var ascendingNode;
var ascendingNodeMin = 0;
var ascendingNodeMax = 360;
var ascendingNodeStep = 1;

var argPerihelion;
var argPerihelionMin = 0;
var argPerihelionMax = 360;
var argPerihelionStep = 1;

var explanationText;

var gui;

var sketch = function(p) {

    p.preload = function() {
        explanationText = p.loadStrings("explanation.md");
    }

    p.setup = function() {
        var heading = p.createElement('h2', 'Orbital elements for solar system objects');
        heading.position(paddingHorizontal+0.1*plotWidth, paddingVertical-55);
        heading.style("margin",0);
        var canvas = p.createCanvas(plotWidth, plotHeight);
        canvas.position(paddingHorizontal, paddingVertical);
        var explain = p.createDiv(p.join(explanationText, " "));
        explain.position(paddingHorizontal+20, paddingVertical+plotHeight+20);
        explain.size(plotWidth - 40);

        gui = createGui('Elements');
        gui.addGlobals('inclination', 'ascendingNode', 'argPerihelion');

        p.textSize(16);
    }

    p.draw = function() {
        p.background(0);
        p.textSize(16);

        p.push();
        p.fill(64);
        p.rect(plotWidth+1, 0, plotWidth+controlsWidth, plotHeight);
        p.pop();

        p.push();
        p.textAlign(p.LEFT, p.TOP);
        p.fill('#FFFFFF');
        p.text(inclLabel, inclSliderX+5, inclSliderY+sliderHeight);
        p.text(p.str(p.char(p.unhex("00B0"))), inclSliderX + 5 + p.textWidth(inclLabel) + inputHSize, inclSliderY+sliderHeight);
        p.pop();
    }

}

var myp5 = new p5(sketch);

