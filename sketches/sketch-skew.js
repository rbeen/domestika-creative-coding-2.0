const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const risoColors = require("riso-colors");
const Color = require("canvas-sketch-util/color");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const sketch = ({ width, height }) => {
  // parameters for drawing our rectangle
  let x, y, w, h, fill, stroke;

  const numberOfRectangles = 20;
  const degrees = -30;
  const rectangles = [];

  const rectangleColors = [
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
  ];

  const bgColor = random.pick(risoColors).hex;

  for (let i = 0; i < numberOfRectangles; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(200, 600);
    h = random.range(40, 200);

    fill = random.pick(rectangleColors).hex;
    stroke = random.pick(rectangleColors).hex;
    rectangles.push({ x, y, w, h, fill, stroke });
  }

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    rectangles.forEach(({ x, y, w, h, fill, stroke }) => {
      let shadowColor;

      // save context before manipulation
      context.save();
      context.fillStyle = fill;
      context.strokeStyle = stroke;
      context.lineWidth = 10;
      // manipulate context coordinates so we can draw more cleanly
      context.translate(x, y);

      drawSkewedRect({
        context,
        w: w,
        h: h,
        degrees,
      });

      shadowColor = Color.offsetHSL(fill, 0, 0, -20);
      shadowColor.rgba[3] = 0.5;

      context.shadowColor = Color.style(shadowColor.rgba); // "rgba(0, 0, 0, 0.5";
      context.shadowOffsetX = -10;
      context.shadowOffsetY = 20;
      context.fill();

      context.shadowColor = null;
      context.stroke();

      // go back to our previous context
      context.restore();
    });
  };
};

const drawSkewedRect = ({ context, w = 600, h = 200, degrees = -45 }) => {
  const angle = math.degToRad(degrees);
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;

  context.save();
  context.translate(rx * -0.5, (ry + h) * -0.5);

  // draw a blue outline rectangle edge by edge
  context.strokeStyle = "blue";

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();
  context.restore();
};
canvasSketch(sketch, settings);
