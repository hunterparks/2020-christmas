const CANVAS_SIZE = 5000;
const BORDER_SIZE = (CANVAS_SIZE * (1 - 0.9)) / 2;

const addWatermark = ([r, g, b] = randomColor()) => {
    noStroke();
    const luminance = (
        (0.299 * r) +
        (0.587 * g) +
        (0.114 * b)
    ) / 255;

    if (luminance > 0.5) { // Bright background
        fill(0, 125);
    } else { // Dark background
        fill(255, 125);
    }
    textFont('Arial');
    textSize(CANVAS_SIZE / 20);
    textStyle(BOLDITALIC);
    text(
        new Date().getFullYear(),
        CANVAS_SIZE * (27 / 32),
        CANVAS_SIZE * (15 / 16),
    );
};

const adjustColor = ([r, g, b], pct) => {
    const amount = 255 * pct;
    return [r + amount, g + amount, b + amount];
};

const collatz = (n) => {
    if (n % 2 === 0) return n / 2;
    return (n * 3 + 1) / 2;
};

const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
    ];
};

const hslToRgb = ([h, s, l]) => {
    var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [ r * 255, g * 255, b * 255 ];
};

const randomColor = () => Array.apply(null, Array(3)).map(() =>  Math.round(randomInteger(255)));

const randomInteger = (scale) => Math.round(Math.random() * scale);

const randomIntegerFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const randomTransparentColor = (color = randomColor()) => {
    color.push(randomInteger(255));
    return color;
}

const rgbToHsl = ([r, g, b]) => {
    r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, l ];
};

let refreshButton;
let saveButton;
let c;

function setup() {
    c = createCanvas(CANVAS_SIZE, CANVAS_SIZE);//, WEBGL);
    angleMode(DEGREES);
    rectMode(CENTER);
    ellipseMode(CENTER);
    noLoop();

    saveButton = createButton('Save Image');
    saveButton.mousePressed(saveImage);

    refreshButton = createButton('Refresh Image');
    refreshButton.mousePressed(refreshImage);
}

function draw() {
    addWatermark(
        //drawTriangles()
        //drawFlowerArt()
        //drawCollatz()
        drawMoon()
        //drawFlowerArtHuePetal()
        //drawMountains()
        //shapes()
    );
}

function refreshImage() {
    draw();
}

function saveImage() {
    saveCanvas(c, 'download', 'png');
}

// Generative Art

function drawTriangles() {
    const [backR, backG, backB] = randomColor();
    background(backR, backG, backB);
    noStroke();
    for (let i = 0; i < CANVAS_SIZE / 2; i++) {
        const [r, g, b, a] = randomTransparentColor();
        fill(r, g, b, a);
        triangle(
            BORDER_SIZE + randomInteger(CANVAS_SIZE - BORDER_SIZE * 2), // X
            BORDER_SIZE + randomInteger(CANVAS_SIZE - BORDER_SIZE * 2), // Y
            BORDER_SIZE + randomInteger(CANVAS_SIZE - BORDER_SIZE * 2), // X
            BORDER_SIZE + randomInteger(CANVAS_SIZE - BORDER_SIZE * 2), // Y
            BORDER_SIZE + randomInteger(CANVAS_SIZE - BORDER_SIZE * 2), // X
            BORDER_SIZE + randomInteger(CANVAS_SIZE - BORDER_SIZE * 2)  // Y
        );
    }
    return [backR, backG, backB];
}

function drawFlowerArt() {
    let [backR, backG, backB] = randomColor();
    background(backR, backG, backB);

    let centerX = width * (2 / 3);
    let centerY = height * (1 / 3);

    const numPetals = Math.max(5, randomInteger(30));
    const petalAngle = 360 / numPetals;
    const petalLength = Math.max(CANVAS_SIZE / 25, randomInteger(CANVAS_SIZE / 4));
    const distanceFromCenter = (petalLength / 2) + (CANVAS_SIZE / 25);
    const circleSize = distanceFromCenter + (CANVAS_SIZE / 50);
    console.table({
        numPetals,
        petalAngle,
        petalLength,
        distanceFromCenter,
        circleSize
    });
    // Pot info
    const bottomPotY = CANVAS_SIZE - BORDER_SIZE;
    const potHeight = CANVAS_SIZE / 7;
    const topPotY = bottomPotY - potHeight;
    const centerPot = CANVAS_SIZE / 2; // CANVAS_SIZE * (7 / 12);
    const bottomPotWidth = potHeight;
    const topPotWidth = bottomPotWidth * 1.3;

    // Draw stem
    noFill();
    [r, g, b] = randomColor();
    strokeWeight(CANVAS_SIZE / 75);
    stroke(r, g, b);
    beginShape();
    curveVertex(centerPot, topPotY);
    curveVertex(centerPot, topPotY);
    const quarterYDistance = (topPotY - centerY) / 4;
    const halfXDistance = (centerX - (centerPot - (topPotWidth / 2))) / 2;
    curveVertex(
        randomIntegerFromInterval((centerPot - (topPotWidth / 2)), (centerPot - (topPotWidth / 2)) + halfXDistance),
        randomIntegerFromInterval(centerY + (quarterYDistance * 2), centerY + (quarterYDistance * 3))
    );
    curveVertex(
        randomIntegerFromInterval((centerPot - (topPotWidth / 2)) + halfXDistance, centerX),
        randomIntegerFromInterval(centerY + quarterYDistance, centerY + (quarterYDistance * 2))
    );
    curveVertex(centerX, centerY);
    curveVertex(centerX, centerY);
    endShape();
    // Draw petals
    noStroke();
    push();
    translate(centerX, centerY);
    [r, g, b, a] = randomTransparentColor();
    fill(r, g, b, a);
    for (let i = 0; i < numPetals; i++) {
        rotate(petalAngle);
        const calculatedX = 0;
        const calculatedY = 0 + distanceFromCenter;
        ellipse(calculatedX, calculatedY, petalLength / 4, petalLength);
    }
    pop();
    // Draw center
    fill(0, 50);
    const offset = CANVAS_SIZE / 250;
    circle(centerX + offset, centerY + offset, circleSize);
    [r, g, b] = randomColor();
    fill(r, g, b);
    circle(centerX, centerY, circleSize);
    // Draw pot
    [r, g, b] = randomColor();
    fill(r, g, b);
    quad(
           centerPot - (topPotWidth / 2),    topPotY, // Pot bowl top left
           centerPot + (topPotWidth / 2),    topPotY, // Pot bowl top right
        centerPot + (bottomPotWidth / 2), bottomPotY, // Pot bowl bottom right
        centerPot - (bottomPotWidth / 2), bottomPotY, // Pot bowl bottom left
    );

    return [backR, backG, backB];
}

function drawCollatz() {
    const salmonPalette = [
        hexToRgb('#F0D0D2'),
        hexToRgb('#EBC1C4'),
        hexToRgb('#E6B2B5'),
        hexToRgb('#E1A3A6'),
        hexToRgb('#DC9397'),
        hexToRgb('#D78488'),
        hexToRgb('#D27479'),
        hexToRgb('#CD656A'),
        hexToRgb('#C8565B'),
        hexToRgb('#C3464A')
    ];
    const arcticPalette = [
        hexToRgb('#BCEAF1'),
        hexToRgb('#ABE4ED'),
        hexToRgb('#9ADFEA'),
        hexToRgb('#88DAE7'),
        hexToRgb('#78D5E3'),
        hexToRgb('#67D0E0'),
        hexToRgb('#56CADC'),
        hexToRgb('#45C5D9'),
        hexToRgb('#34C0D5'),
        hexToRgb('#2AB6CB')
    ];
    const rgb = randomColor();
    const randomPalette = [
        adjustColor(rgb, -0.4),
        adjustColor(rgb, -0.3),
        adjustColor(rgb, -0.2),
        adjustColor(rgb, -0.1),
        rgb,
        adjustColor(rgb, 0.4),
        adjustColor(rgb, 0.3),
        adjustColor(rgb, 0.2),
        adjustColor(rgb, 0.1)
    ];

    const selectedPalette = randomPalette;

    const [backR, backG, backB] = randomColor();
    background(backR, backG, backB);

    const len = CANVAS_SIZE / 125;
    const angle = 10;
    strokeWeight(CANVAS_SIZE / 100);

    for (let i = 1; i < 10000; i ++) {
        let sequence = [];
        let n = i;
        do {
            sequence.push(n);
            n = collatz(n);
        } while (n != 1);
        sequence.push(1);
        sequence.reverse();
        push();
        translate(CANVAS_SIZE * (1 / 2), CANVAS_SIZE * (5 / 6));
        const [r, g, b] = selectedPalette[randomInteger(selectedPalette.length - 1)];
        stroke(r, g, b);
        for (let item of sequence) {
            if (item % 2 === 0) {
                rotate(angle);
            } else {
                rotate(-angle);
            }
            line(0, 0, 0, -len);
            translate(0, -len);
        }
        pop();
    }

    return [backR, backG, backB];
}

function drawMoon() {
    push();
    const [backR, backG, backB] = randomColor();
    background(backR, backG, backB);

    const standardColor = randomColor();
    const lighterColor = adjustColor(standardColor, 0.2);
    const darkerColor = adjustColor(standardColor, -0.2);
    let [r, g, b] = standardColor;

    noStroke();
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;
    const diameter = CANVAS_SIZE * (2 / 3);
    const radius = diameter / 2;

    //Large Circle
    fill(r, g, b);
    circle(centerX, centerY, diameter);

    // Smaller Circles
    for(let i = 0; i < 10000; i++) {
        const x = randomIntegerFromInterval(centerX - radius, centerX + radius);
        const y = randomIntegerFromInterval(centerY - radius, centerY + radius);
        const width = randomIntegerFromInterval(5, 50);
        let distanceFromCenter = Math.sqrt(
            Math.pow((centerX - (x - width)), 2) + Math.pow((centerY - (y - width)), 2)
        );
        if (distanceFromCenter > radius) continue;
        distanceFromCenter = Math.sqrt(
            Math.pow((centerX - (x - width)), 2) + Math.pow((centerY - (y + width)), 2)
        );
        if (distanceFromCenter > radius) continue;
        distanceFromCenter = Math.sqrt(
            Math.pow((centerX - (x + width)), 2) + Math.pow((centerY - (y - width)), 2)
        );
        if (distanceFromCenter > radius) continue;
        distanceFromCenter = Math.sqrt(
            Math.pow((centerX - (x + width)), 2) + Math.pow((centerY - (y + width)), 2)
        );
        if (distanceFromCenter > radius) continue;
        if (randomInteger(1000) % 2 === 0) {
            [r, g, b] = lighterColor;
        } else {
            [r, g, b] = darkerColor;
        }
        fill(r, g, b);
        circle(x, y, width);
    }

    pop();
    return [backR, backG, backB];
}

function drawFlowerArtHuePetal() {
    let [backR, backG, backB] = randomColor();
    background(backR, backG, backB);

    let centerX = width * (2 / 3);
    let centerY = height * (1 / 3);

    const numPetals = Math.max(5, randomInteger(30));
    const petalAngle = 360 / numPetals;
    const petalLength = Math.max(CANVAS_SIZE / 25, randomInteger(CANVAS_SIZE / 4));
    const distanceFromCenter = (petalLength / 2) + (CANVAS_SIZE / 25);
    const circleSize = distanceFromCenter + (CANVAS_SIZE / 50);
    console.table({
        numPetals,
        petalAngle,
        petalLength,
        distanceFromCenter,
        circleSize
    });
    // Pot info
    const bottomPotY = CANVAS_SIZE - BORDER_SIZE;
    const potHeight = CANVAS_SIZE / 7;
    const topPotY = bottomPotY - potHeight;
    const centerPot = CANVAS_SIZE / 2; // CANVAS_SIZE * (7 / 12);
    const bottomPotWidth = potHeight;
    const topPotWidth = bottomPotWidth * 1.3;

    // Draw stem
    noFill();
    [r, g, b] = randomColor();
    strokeWeight(CANVAS_SIZE / 75);
    stroke(r, g, b);
    beginShape();
    curveVertex(centerPot, topPotY);
    curveVertex(centerPot, topPotY);
    const quarterYDistance = (topPotY - centerY) / 4;
    const halfXDistance = (centerX - (centerPot - (topPotWidth / 2))) / 2;
    curveVertex(
        randomIntegerFromInterval((centerPot - (topPotWidth / 2)), (centerPot - (topPotWidth / 2)) + halfXDistance),
        randomIntegerFromInterval(centerY + (quarterYDistance * 2), centerY + (quarterYDistance * 3))
    );
    curveVertex(
        randomIntegerFromInterval((centerPot - (topPotWidth / 2)) + halfXDistance, centerX),
        randomIntegerFromInterval(centerY + quarterYDistance, centerY + (quarterYDistance * 2))
    );
    curveVertex(centerX, centerY);
    curveVertex(centerX, centerY);
    endShape();
    // Draw petals
    noStroke();
    push();
    translate(centerX, centerY);
    [r, g, b, a] = randomTransparentColor();
    let adjustment = 1;
    for (let i = 0; i < numPetals; i++) {
        fill(r, g, b, a);
        rotate(petalAngle);
        const calculatedX = 0;
        const calculatedY = 0 + distanceFromCenter;
        ellipse(calculatedX, calculatedY, petalLength / 4, petalLength);
        let [h, s, l] = rgbToHsl([r, g, b]);

        if (l > 1) {
            adjustment *= -1;
        } else if (l < 0) {
            adjustment *= -1;
        }
        l += 0.05 * adjustment;
        console.log(l);

        //adjustment = (i > (numPetals / 2)) ? -1 : 1;
        //h += 0.05 * adjustment;
        //if (h > 1) {
        //    h = h - 1;
        //} else if (h < 0) {
        //    h = h + 1;
        //}
        //console.log(h);

        [r, g, b] = hslToRgb([h, s, l]);
    }
    pop();
    // Draw center
    fill(0, 50);
    const offset = CANVAS_SIZE / 250;
    circle(centerX + offset, centerY + offset, circleSize);
    [r, g, b] = randomColor();
    fill(r, g, b);
    circle(centerX, centerY, circleSize);
    // Draw pot
    [r, g, b] = randomColor();
    fill(r, g, b);
    quad(
           centerPot - (topPotWidth / 2),    topPotY, // Pot bowl top left
           centerPot + (topPotWidth / 2),    topPotY, // Pot bowl top right
        centerPot + (bottomPotWidth / 2), bottomPotY, // Pot bowl bottom right
        centerPot - (bottomPotWidth / 2), bottomPotY, // Pot bowl bottom left
    );

    return [backR, backG, backB];
}

function drawMountains() {
    push();
    const [backR, backG, backB] = randomColor();
    background(backR, backG, backB);

    const w = Math.round(width * (5 / 2));
    const h = Math.round(height * (7 / 3));
    const scale = 150;
    const amplitude = 300;
    const cols = Math.round(w / scale);
    const rows = Math.round(h / scale);
    const offsetAdjustment = 3;
    console.table({w, h, cols, rows});
    let terrain = Array.from(Array(cols), () => new Array(rows));

    let yOff = 0;
    for (let y = 0; y < rows; y++) {
        let xOff = 0;
        for (let x = 0; x < cols; x++) {
            terrain[x][y] = map(noise(xOff, yOff), 0, 1, amplitude * -1, amplitude);
            xOff += offsetAdjustment;
        }
        yOff += offsetAdjustment;
    }

    background(0);
    stroke(255);
    strokeWeight(3);
    noFill();
    fill(123);

    rotateX(60);
    translate(-w / 2, -h / 2);
    for (let y = 0; y < rows - 1; y++) {
        beginShape(TRIANGLE_STRIP);
        for (let x = 0; x < cols - 1; x++) {
            vertex(x * scale, y * scale, terrain[x][y]);
            vertex(x * scale, (y + 1) * scale, terrain[x][y + 1]);
        }
        endShape();
    }
    pop();
    return [backR, backG, backB];
}

function shapes() {
    push();
    const [backR, backG, backB] = randomColor();
    background(0);//backR, backG, backB);

    let centerX = width / 2;
    let centerY = height / 2;

    noFill();
    let [r, g, b] = randomColor();
    strokeWeight(5);

    translate(centerX, centerY);
    for (let j = 0; j < 5; j++) {
        let shapeX = -1 * (centerX * (1 / 3));
        let shapeY = 0;
        const shapeRadius = 500;
        const numShapes = 100;
        const hueShift = 1 * (1 / numShapes);
        for (let i = 0; i < numShapes; i++) {
            stroke(r, g, b);
            rotate(360 / numShapes);
            switch(3) {
                case 1:
                    circle(shapeX, shapeY, shapeRadius * 2);
                    break;
                case 3:
                    triangle(shapeX, shapeY - shapeRadius,
                        shapeX + (shapeRadius * sin(60)), shapeY + (shapeRadius * cos(60)),
                        shapeX - (shapeRadius * sin(60)), shapeY + (shapeRadius * cos(60))
                    );
                    break;
                case 4:
                    square(shapeX, shapeY, shapeRadius * 2);
                    break;
                case 5:
                    break;
            }
            let [h, s, l] = rgbToHsl([r, g, b]);
            h += hueShift;
            [r, g, b] = hslToRgb([h, s, l]);
        }
        let [h, s, l] = rgbToHsl([r, g, b]);
        l += 0.1;
        l = Math.min(l, 1);
        [r, g, b] = hslToRgb([h, s, l]);
        centerX += 1250;
        centerY -= 1250;
    }

    pop();
    return [backR, backG, backB];
}