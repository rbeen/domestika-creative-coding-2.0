const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");

const settings = {
  dimensions: [1080, 1080],
};

const sketch = () => {
  // parameters for drawing our rectangle
  let x, y, w, h;
  let angle, rx, ry;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    radius = 200;
    angle = math.degToRad(-30);

    x = width * 0.5;
    y = height * 0.5;
    w = width * 0.5;
    h = height * 0.1;

    // save context before manipulation
    context.save();

    // manipulate context coordinates so we can draw more cleanly
    context.translate(x, y);

    drawSkewedRect({
      context,
    });

    // go back to our previous context
    context.restore();
  };
};

const drawSkewedRect = ({ context, w = 600, h = 200, degrees = -45 }) => {
  const angle = math.degToRad(degrees);
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;

  context.save();
  context.translate(rx * -0.5, ry * -0.5);

  // draw a blue outline rectangle edge by edge
  context.strokeStyle = "blue";

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();
  context.stroke();

  context.restore();
};
canvasSketch(sketch, settings);
