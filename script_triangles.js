const MAX_HEIGHT = 500;
const MAX_WIDTH = 500;
const DENSITY = 8;
const GAP = MAX_HEIGHT / DENSITY;
const RELOAD_TIMEOUT = 3000;
const STROKE_COLOR = "#00203F";
const TONES_1 = [[238, 66, 102], [31, 64, 104], [242, 228, 181]];
const TONES_2 = [[37, 106, 220], [31, 64, 104], [169, 251, 215]];
const MONOCHROME = new Array(10).fill(0).map((_, i) => [i*24, i*25, i*26]);

function setup(){
  createCanvas(MAX_HEIGHT, MAX_WIDTH);
  stroke(STROKE_COLOR);
  noLoop();
}

function draw(){  
    const lines = [];
    let odd = false;
    for(let y = GAP / 2; y <= MAX_HEIGHT; y += GAP) {
        odd = !odd;
        const trait = [];
        const oddFactor = odd ? GAP/2 : 0;
        for(let x = GAP / 4; x <= MAX_HEIGHT; x += GAP) {
          trait.push({
            x: x + (Math.random()*.8 - 0.4) * GAP + oddFactor,
            y: y + (Math.random()*.8 - 0.4) * GAP
          });
        }
        lines.push(trait);
      }
    odd = true;
    for(let y = 0; y < lines.length - 1; y++) {
        odd = !odd;
        const dotLine = [];
        for(let i = 0; i < lines[y].length; i++) {
          dotLine.push(odd ? lines[y][i]   : lines[y+1][i]);
          dotLine.push(odd ? lines[y+1][i] : lines[y][i]);
        }
        for(let i = 0; i < dotLine.length - 2; i++) {
          drawTriangle(dotLine[i], dotLine[i+1], dotLine[i+2]);
        }
      }
}


const drawTriangle = (pointA, pointB, pointC) => {
  let random_index = Math.floor(Math.random() * TONES_1.length);
  const [r, g, b] = TONES_1[random_index];
  fill(r, g, b);
  triangle(pointA.x, pointA.y, pointB.x, pointB.y, pointC.x, pointC.y)
}