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

var ascendingNode = 0;
var ascendingNodeMin = 0;
var ascendingNodeMax = 360;
var ascendingNodeStep = 1;

var argPerihelion = 0;
var argPerihelionMin = 0;
var argPerihelionMax = 360;
var argPerihelionStep = 1;

var explanationText;

var gui;

var sketch = function(p) {

    p.preload = function() {
        explanationText = p.loadStrings("explanation.html");
    }

    p.setup = function() {
        var canvas = p.createCanvas(plotWidth, plotHeight);
        canvas.position(paddingHorizontal, paddingVertical);
        var explain = p.createDiv(p.join(explanationText, " "));
        explain.position(paddingHorizontal+20, paddingVertical+plotHeight+20);
        explain.size(plotWidth - 40);

        gui = p.createGui(this, 'Orbital elements');
        gui.addGlobals('inclination', 'ascendingNode', 'argPerihelion');
        gui.setPosition(paddingHorizontal+plotWidth+10, paddingVertical);

        p.textSize(16);

        // only call draw when the gui is changed
        p.noLoop();
    }

    p.draw = function() {
        p.background(0);
        p.textSize(16);

        p.push();
        p.fill(64);
        p.rect(plotWidth+1, 0, plotWidth, plotHeight);
        p.pop();
    }

}

var myp5 = new p5(sketch);

