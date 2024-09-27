import Point from "./helpers/point";

const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    const point = new Point({ x: 100, y: 100 });
    point.draw(context);
  };
};

canvasSketch(sketch, settings);
