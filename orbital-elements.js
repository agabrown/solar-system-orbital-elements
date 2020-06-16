/*
 * P5/Processing sketch that illustrates interactively the meaning of the orbital elements that
 * describe the orientation of elliptical orbits in the solar system.
 *
 * Anthony Brown Jun 2020 - Jun 2020
 */

var mptab10 = new Map();
mptab10.set('blue', [ 31, 119, 180]);
mptab10.set('orange', [255, 127,  14]);
mptab10.set('green', [ 44, 160,  44]);
mptab10.set('red', [214,  39,  40]);
mptab10.set('purple', [148, 103, 189]);
mptab10.set('brown', [140,  86,  75]);
mptab10.set('magenta', [227, 119, 194]);
mptab10.set('grey', [127, 127, 127]);
mptab10.set('olive', [188, 189,  34]);
mptab10.set('cyan', [ 23, 190, 207]);

var plotWidth = 800;
var plotHeight = 600;

var paddingHorizontal = 50;
var paddingVertical = 50;

var longRightwardsArrow = "";
var longLeftwardsArrow = "";
var inclLabel = "Inclination = ";
var ascnodeLabel = "Longitude ascending node = ";
var argperiLabel = "Argument perihelion = ";

var camRotY = 20;
var camRotYMin = -180;
var camRotYMax = 180;
var camRotYStep = 1;

var camRotZ = -20;
var camRotZMin = -180;
var camRotZMax = 180;
var camRotZStep = 1;

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

var visible = true;
var gui;

var semimajor = 2;
var eccentricity = 0.6;
var refPlaneRadius = semimajor*(1+eccentricity);
const SCALE = 100;

var sketch = function(p) {

    p.preload = function() {
        explanationText = p.loadStrings("explanation.html");
    }

    p.setup = function() {
        var canvas = p.createCanvas(plotWidth, plotHeight, p.WEBGL);
        p.perspective();
        canvas.position(paddingHorizontal, paddingVertical);
        var explain = p.createDiv(p.join(explanationText, " "));
        explain.position(paddingHorizontal+plotWidth+20, paddingVertical+plotHeight-300);
        explain.size(0.7*plotWidth);

        gui = p.createGui(this, 'Orbital elements');
        gui.addGlobals('camRotY', 'camRotZ', 'inclination', 'ascendingNode', 'argPerihelion');
        gui.setPosition(paddingHorizontal+plotWidth+10, paddingVertical);

        p.textSize(16);
        p.ellipseMode(p.RADIUS);

        // only call draw when the gui is changed
        p.noLoop();
        p.noFill();
        p.smooth();
    }

    p.draw = function() {
        p.background(255);
        p.push();

        rightHanded3DtoWEBGL(p, p.radians(camRotY), p.radians(camRotZ));

        p.push()

        // XYZ axes of the BCRS
        p.strokeWeight(3);
        p.stroke(255,0,0);
        p.line(0,0,0,200,0,0);
        p.stroke(0,255,0);
        p.line(0,0,0,0,200,0);
        p.stroke(0,0,255);
        p.line(0,0,0,0,0,200);

        // Orbit ellipse with its normal
        p.noFill();
        p.stroke(mptab10.get('orange'));
        p.strokeWeight(3);
        p.rotateZ(p.radians(ascendingNode));
        p.rotateX(p.radians(inclination));
        p.rotateZ(p.radians(argPerihelion));
        drawEllipse(p, semimajor, eccentricity, SCALE);
        p.stroke(0);
        p.line(0,0,0,0,0,150);

        // Draw line segment and point indicatiing perihelion
        p.stroke(mptab10.get('orange'));
        p.line(0, 0, 0, semimajor*(1-eccentricity)*SCALE, 0, 0);
        p.noStroke();
        p.fill(mptab10.get('orange'));
        p.circle(semimajor*(1-eccentricity)*SCALE, 0, 7);

        p.pop();

        // Reference plane (XY plane of BCRS, loosely speaking the Ecliptic plane)
        // Draw this last so that the transparency works correctly (where the intention
        // is to see the orbital ellipse through the plane).
        p.noStroke();
        p.fill(mptab10.get('blue')[0], mptab10.get('blue')[1], mptab10.get('blue')[2], 150);
        drawEllipse(p, refPlaneRadius, 0, 100);

        p.pop();
    }

    p.keyPressed = function() {
        switch(p.key) {
            case 'p':
                visible = !visible;
                if (visible)
                    gui.show();
                else
                    gui.hide();
                break;
        }
    }

}

var myp5 = new p5(sketch);

/*
 * Apply this transformation so that one can work in a normal righthanded Cartesian coordinate
 * system. The transformation takes care of placing things correctly in the 'device' (here WEBGL)
 * coordinates.
 *
 * So typically you do the following:
 * p.push();
 * rightHanded3DtoWEBGL(p, rotY, rotZ);
 * ...
 * drawing instructions with coordinates now to be interpreted in normal righthanded Cartesian
 * coordinate system
 * ...
 * p.pop();
 *
 * Parameters:
 * p - the p5 object
 * rotY - rotation angle around Y (sets the viewpoint)
 * rotZ - rotation angle around Z (sets the viewpoint)
 */
function rightHanded3DtoWEBGL(p, rotY, rotZ) {
    p.applyMatrix(0, 0, 1, 0,
        1, 0, 0, 0,
        0, -1, 0, 0,
        0, 0, 0, 1);
    p.rotateY(rotY);
    p.rotateZ(rotZ);
}

/*
 * Draw an ellipse with the focus at (0,0,0) and perihelion at (a(1-e), 0, 0).
 *
 * Parameters:
 * p - the p5 object
 * a - semimajor axis (au)
 * e - eccentricity
 * s - scaling factor (from au to pixels)
 */
function drawEllipse(p, a, e, s) {
    let semimajor = a*s;
    p.ellipse(-semimajor*e, 0, semimajor, semimajor*p.sqrt(1-e*e), 50);
}
