import random from "canvas-sketch-util/random";
import math from "canvas-sketch-util/math";
import colormap from "colormap";
import Point from "./helpers/point";

const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = ({ width, height }) => {
  const columns = 144;
  const rows = 8;
  const numCells = columns * rows;

  const gridWidth = width * 0.8;
  const gridHeight = height * 0.8;

  const cellWidth = gridWidth / columns;
  const cellHeight = gridHeight / rows;

  const marginX = (width - gridWidth) / 2;
  const marginY = (height - gridHeight) / 2;

  const points = [];

  let x, y, noise, lineWidth, color;
  let frequency = 0.002;
  let amplitude = 90;

  let colors = colormap({
    colormap: "salinity",
    nshades: amplitude,
    format: "hex",
    alpha: 1,
  });

  for (let i = 0; i < numCells; i++) {
    x = (i % columns) * cellWidth;
    y = Math.floor(i / columns) * cellHeight;

    noise = random.noise2D(x, y, frequency, amplitude);
    x += noise;
    y += noise;

    lineWidth = math.mapRange(noise, -amplitude, amplitude, 0, 5);

    color =
      colors[
        Math.floor(math.mapRange(noise, -amplitude, amplitude, 0, amplitude))
      ];
    points.push(new Point({ x, y, color, lineWidth }));
  }

  return ({ context, width, height }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);
    context.save();
    context.translate(marginX, marginY);
    context.translate(cellWidth / 2, cellHeight / 2);
    context.strokeStyle = "red";
    context.lineWidth = 4;

    let lastX, lastY;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns - 1; c++) {
        const current = points[r * columns + c];
        const next = points[r * columns + c + 1];

        const mx = current.x + (next.x - current.x) * 0.8;
        const my = current.y + (next.y - current.y) * 5.5;

        if (!c) {
          lastX = current.x;
          lastY = current.y;
        }
        context.beginPath();
        context.lineWidth = current.lineWidth;
        context.strokeStyle = current.color;
        context.moveTo(lastX, lastY);

        context.quadraticCurveTo(current.x, current.y, mx, my);

        context.stroke();

        lastX = mx - (c / columns) * 250;
        lastY = my - (r / rows) * 250;
      }
    }

    context.restore();
  };
};

canvasSketch(sketch, settings);
