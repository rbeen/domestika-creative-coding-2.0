import random from "canvas-sketch-util/random";
import Point from "./helpers/point";

const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = ({ width, height }) => {
  const columns = 24;
  const rows = 12;
  const numCells = columns * rows;

  const gridWidth = width * 0.8;
  const gridHeight = height * 0.8;

  const cellWidth = gridWidth / columns;
  const cellHeight = gridHeight / rows;

  const marginX = (width - gridWidth) / 2;
  const marginY = (height - gridHeight) / 2;

  const points = [];

  let x, y, noise;
  let frequency = 0.002;
  let amplitude = 90;

  for (let i = 0; i < numCells; i++) {
    x = (i % columns) * cellWidth;
    y = Math.floor(i / columns) * cellHeight;

    noise = random.noise2D(x, y, frequency, amplitude);
    x += noise;
    y += noise;

    points.push(new Point({ x, y, color: "red" }));
  }

  return ({ context, width, height }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);
    context.save();
    context.translate(marginX, marginY);
    context.translate(cellWidth / 2, cellHeight / 2);
    context.strokeStyle = "red";
    context.lineWidth = 4;

    for (let r = 0; r < rows; r++) {
      context.beginPath();

      for (let c = 0; c < columns - 1; c++) {
        const current = points[r * columns + c];
        const next = points[r * columns + c + 1];

        const mx = current.x + (next.x - current.x) / 2;
        const my = current.y + (next.y - current.y) / 2;

        if (c === 0) {
          context.moveTo(current.x, current.y);
        } else if (c === columns - 2) {
          context.quadraticCurveTo(current.x, current.y, next.x, next.y);
        } else {
          context.quadraticCurveTo(current.x, current.y, mx, my);
        }
      }
      context.stroke();
    }
    context.restore();
  };
};

canvasSketch(sketch, settings);
