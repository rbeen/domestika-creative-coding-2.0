const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'lightgrey';
    context.fillRect(0, 0, width, height);

    context.fillStyle = "rgb(200 0 0)";
    context.fillRect(10, 10, 50, 50);

    context.fillStyle = "rgb(0 0 200 / 50%)";
    context.fillRect(30, 30, 50, 50);
  };
};

canvasSketch(sketch, settings);
