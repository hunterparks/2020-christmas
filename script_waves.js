const CANVAS_SIZE = 5000;
const STEP = CANVAS_SIZE / 31.25;

const randomRgb = () => {
    const red = Math.round(Math.random() * 255);
    const green = Math.round(Math.random() * 255);
    const blue = Math.round(Math.random() * 255);
    return { red, green, blue };
};

const VARIANCE_FACTOR = Math.ceil(CANVAS_SIZE / 6.67);
const TONES_1 = [[238, 66, 102], [31, 64, 104], [242, 228, 181]];
const TONES_2 = [[37, 106, 220], [31, 64, 104], [169, 251, 215]];
const MONOCHROME = [[0, 32, 63]];
let CUSTOM_TONES = [];
for (let i = 0; i < 5; i++) {
    const rgb = randomRgb();
    CUSTOM_TONES.push([rgb.red, rgb.green, rgb.blue]);
}

function setup() {
    createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    const strokeColor = randomRgb();
    stroke(strokeColor.red, strokeColor.green, strokeColor.blue);
    strokeWeight(CANVAS_SIZE / 250);
    noLoop();    
    
    let random_index = Math.floor(Math.random() * CUSTOM_TONES.length);
    const [r, g, b] = CUSTOM_TONES[random_index];
    background(r,g,b);
}

function draw(){
    const lines = [];
    for(let i = STEP; i < height - STEP; i += STEP){
      let line = [];
      for(let j = STEP; j <= height - STEP; j += STEP){
        let distanceToCenter = Math.abs(j - height / 2);
        let variance = Math.max(height / 2 - VARIANCE_FACTOR - distanceToCenter, 0);
        let random = Math.random() * variance / 2 * -1;
        let point = {x: j, y: i + random};
        line.push(point)
      }
      lines.push(line);
    }
    // Draw
    for(let i = 5; i < lines.length; i++){
      beginShape();
      for(let j = 0; j < lines[i].length; j+=2){
        curveVertex(lines[i][j].x, lines[i][j].y);
        let random_index = Math.floor(Math.random() * CUSTOM_TONES.length);
        const [r, g, b] = CUSTOM_TONES[random_index];
        fill(r, g, b);
        curveVertex(lines[i][j+1].x, lines[i][j+1].y)
      }
      endShape();
    }
}