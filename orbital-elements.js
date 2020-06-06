var plotWidth = 640;
var plotHeight = 480;
var controlsWidth = 300;
var controlsHeight = plotHeight;
var xOrigPlot = 0.1*plotWidth;
var yOrigPlot = 0.9*plotHeight;
var xAxisLen = 0.8*plotWidth;
var yAxisLen = 0.8*plotHeight;

var inclDefault = 0.0;
var inclMin = -90;
var inclMax = 90;

var sliderWidth = 240;
var sliderHeight = 30;
var inclSliderX = plotWidth+10;
var inclSliderY = 0.85*controlsHeight;

var inputHSize = 75;
var inputVSize = 18;

var paddingHorizontal = 50;
var paddingVertical = 50;

var longRightwardsArrow = "";
var longLeftwardsArrow = "";
var inclLabel = "Inclination = ";

var inclination;
var explanationText;

var sketch = function(p) {

    p.preload = function() {
        explanationText = p.loadStrings("explanation.md");
    }

    p.setup = function() {
        var heading = p.createElement('h2', 'Orbital elements for solar system objects');
        heading.position(paddingHorizontal+0.1*plotWidth, paddingVertical-40);
        heading.style("margin",0);
        var canvas = p.createCanvas(plotWidth + controlsWidth, plotHeight);
        canvas.position(paddingHorizontal, paddingVertical);
        var explain = p.createDiv(p.join(explanationText, " "));
        explain.position(paddingHorizontal+20, paddingVertical+plotHeight+20);
        explain.size(plotWidth + controlsWidth - 40);

        p.textSize(16);

        inclSlider = p.createSlider(inclMin, inclMax, inclDefault, 0);
        inclSlider.position(inclSliderX + paddingHorizontal, inclSliderY + paddingVertical);
        inclSlider.style('width', sliderWidth.toFixed(0)+'px');
        inclSlider.style('height', sliderHeight.toFixed(0)+'px');
        inclSlider.style('color', '#00FFFF');
        inclSlider.mouseMoved(inclSliderMoved);

        inclInput = p.createInput(inclDefault.toFixed(0), "number");
        inclInput.position(inclSliderX + paddingHorizontal + p.textWidth(inclLabel), inclSliderY + paddingVertical+sliderHeight);
        inclInput.style("font-size", "16px");
        inclInput.size(inputHSize, inputVSize);
        inclInput.changed(inclInputChanged);
        inclnation = inclInput.value();

        resetButton = p.createButton("Reset");
        resetButton.position(distanceSliderX + paddingHorizontal + 10, distanceSliderY + paddingVertical-2*sliderHeight);
        resetButton.style("font-size", "16px");
        resetButton.mousePressed(reset);

        p.ellipseMode(p.CENTER);
        longRightwardsArrow = p.str(p.char(p.unhex("27F6")));
        longLeftwardsArrow = p.str(p.char(p.unhex("27F5")));
    }

}

var myp5 = new p5(sketch);

function inclInputChanged() {
    if (inclInput.value() < inclMin) {
        inclInput.value(inclMin.toFixed(0));
    }
    if (inclInput.value() > inclMax) {
        inclInput.value(inclMax.toFixed(0));
    }
    inclination = inclInput.value();
    inclSlider.value(inclination);
}

function inclSliderMoved() {
    inclination = inclSlider.value();
    inclInput.value(inclination.toFixed(0));
}

function reset() {
    inclination = inclDefault;
    inclSlider.value(inclincation);
    inclInput.value(inclincation.toFixed(0));
}
