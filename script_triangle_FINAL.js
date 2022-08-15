const CANVAS_SIZE = 500;
const BORDER_SIZE = (CANVAS_SIZE * (1 - 0.9)) / 2;

const randomColor = () => Array.apply(null, Array(3)).map(() =>  Math.round(randomInteger(255)));

const randomInteger = (scale) => Math.round(Math.random() * scale);

const randomTransparentColor = (color = randomColor()) => {
    color.push(randomInteger(255));
    return color;
}

let refreshButton;
let saveButton;
let c;

function setup() {
    c = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
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
    const [r, g, b] = randomColor();
    background(r, g, b);
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
        //ellipse(
        //    randomInteger(CANVAS_SIZE), // X Position
        //    randomInteger(CANVAS_SIZE), // Y Position
        //    randomInteger(CANVAS_SIZE / 15) // Radius
        //);
    }
}

function refreshImage() {
    draw();
}

function saveImage() {
    saveCanvas(c, 'download', 'png');
}