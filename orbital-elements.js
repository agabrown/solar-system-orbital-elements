/*
 * P5/Processing sketch that illustrates interactively the meaning of the orbital elements that
 * describe the orientation of elliptical orbits in the solar system.
 *
 * Anthony Brown Jun 2020 - Dec 2020
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
var inclinationMin = 0;
var inclinationMax = 180;
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
var explain;
var showHelp = true;
var helpVisible = true;
var helpButton;

var guiVisible = true;
var gui;

var rasc, rdesc, xasc, xdesc, yasc, ydesc;
var r, theta, M, f, fp, fpp;
var animateBody = false;

var semimajor = 2;
var eccentricity = 0.6;
var semiminor;
var refPlaneRadius = semimajor*(1+eccentricity);
const SCALE = 100;
const HELPSIZE = 600;

var deg2rad;

var sketch = function(p) {

    p.preload = function() {
        explanationText = p.loadStrings("explanation.html");
    }

    p.setup = function() {
        var canvas = p.createCanvas(900, 600, p.WEBGL);
        p.perspective();
        canvas.position(0,0);
        gui = p.createGui(this, 'Orbital elements');
        gui.addGlobals('showHelp', 'animateBody', 'camRotY', 'camRotZ', 'inclination', 'ascendingNode', 'argPerihelion');
        gui.setPosition(p.width, paddingVertical);

        explain = p.createDiv(p.join(explanationText, " "));
        explain.position(paddingHorizontal, paddingVertical);
        explain.size(HELPSIZE);

        p.ellipseMode(p.RADIUS);
        p.angleMode(p.RADIANS);

        p.noFill();
        p.smooth();
        deg2rad = (x) => (x/180*p.PI);
        semiminor = semimajor*p.sqrt(1-eccentricity**2);
    }

    p.draw = function() {
        p.background(255);

        if (showHelp & !helpVisible) {
            explain = p.createDiv(p.join(explanationText, " "));
            explain.position(paddingHorizontal, paddingVertical);
            explain.size(HELPSIZE);
            helpVisible = true;
        } else {
            if (!showHelp) {
                explain.remove();
                helpVisible = false;
            }
        }

        p.push();

        rightHanded3DtoWEBGL(p, deg2rad(camRotY), deg2rad(camRotZ));

        p.push()

        // XYZ axes of the BCRS
        p.strokeWeight(1);
        p.stroke(0);
        p.line(0,0,0,refPlaneRadius*SCALE*1.05,0,0);
        p.push()
        p.translate(refPlaneRadius*SCALE*1.05,0,0);
        p.rotateZ(-p.HALF_PI);
        p.cone(SCALE*0.05, SCALE*0.1);
        p.pop();
        p.line(0,0,0,0,refPlaneRadius*SCALE*1.05,0);
        p.push()
        p.translate(0,refPlaneRadius*SCALE*1.05,0);
        p.cone(SCALE*0.05, SCALE*0.1);
        p.pop();
        p.line(0,0,0,0,0,refPlaneRadius*SCALE*0.7);
        p.push()
        p.translate(0,0,refPlaneRadius*SCALE*0.7);
        p.rotateX(p.HALF_PI);
        p.cone(SCALE*0.05, SCALE*0.1);
        p.pop();

        // Orbit ellipse with its normal
        p.noFill();
        p.stroke(mptab10.get('blue'));
        p.strokeWeight(3);
        p.rotateZ(deg2rad(ascendingNode));
        p.rotateX(deg2rad(inclination));
        p.rotateZ(deg2rad(argPerihelion));
        drawEllipse(p, semimajor, eccentricity, SCALE);
        p.stroke(mptab10.get('orange'));
        p.line(0,0,0,0,0,refPlaneRadius*SCALE*0.5);
        p.push()
        p.translate(0,0,refPlaneRadius*SCALE*0.5);
        p.rotateX(p.HALF_PI);
        p.cone(SCALE*0.05, SCALE*0.1);
        p.pop();

        // Draw line segment and point indicatiing perihelion
        p.stroke(mptab10.get('orange'));
        p.line(-semimajor*(1+eccentricity)*SCALE, 0, 0, semimajor*(1-eccentricity)*SCALE, 0, 0);
        p.noStroke();
        p.fill(mptab10.get('orange'));
        p.circle(semimajor*(1-eccentricity)*SCALE, 0, 7);

        if (animateBody) {
            p.push();
            p.stroke(0);
            M = (p.millis()/4000*p.TWO_PI)%p.TWO_PI;
            f = (x) => (x - eccentricity*p.sin(x)-M);
            fp = (x) => (1 - eccentricity*p.cos(x));
            fpp = (x) => (eccentricity*p.sin(x));
            E = modifiedNewtonRaphson(f, fp, fpp, M);
            p.translate(SCALE*semimajor*(p.cos(E)-eccentricity), SCALE*semiminor*p.sin(E), 0);
            p.sphere(SCALE*0.1);
            p.pop();
        }

        // Draw line of nodes. The points on the ellipse at true anomaly -omega
        // (ascending node) and pi-omega (descending node) form the endpoints.
        if (inclination != 0.0) {
            rasc = SCALE*semimajor*(1-eccentricity**2)/(1+eccentricity*p.cos(-deg2rad(argPerihelion)));
            rdesc = SCALE*semimajor*(1-eccentricity**2)/(1+eccentricity*p.cos(p.PI-deg2rad(argPerihelion)));
            xasc = rasc*p.cos(-deg2rad(argPerihelion));
            yasc = rasc*p.sin(-deg2rad(argPerihelion));
            xdesc = rdesc*p.cos(p.PI-deg2rad(argPerihelion));
            ydesc = rdesc*p.sin(p.PI-deg2rad(argPerihelion));
            p.stroke(mptab10.get('red'));
            p.line(xasc, yasc, 0, xdesc, ydesc, 0);
        }

        p.pop();

        // Reference plane (XY plane of BCRS, loosely speaking the Ecliptic plane)
        // Draw this last so that the transparency works correctly (where the intention
        // is to see the orbital ellipse through the plane).
        p.noStroke();
        p.fill(mptab10.get('red')[0], mptab10.get('red')[1], mptab10.get('red')[2], 150);
        drawEllipse(p, refPlaneRadius, 0, SCALE);

        p.pop();
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
