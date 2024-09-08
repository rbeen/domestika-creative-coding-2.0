const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const risoColors = require("riso-colors");
const Color = require("canvas-sketch-util/color");

const settings = {
  dimensions: [1080, 1080],
};

const sketch = ({ width, height }) => {
  // parameters for drawing our rectangle
  let x, y, w, h, fill, stroke;

  const numberOfRectangles = 40;
  const degrees = -30;
  const rectangles = [];

  const rectangleColors = [
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
  ];

  const bgColor = random.pick(risoColors).hex;

  const mask = {
    radius: width * 0.4,
    sides: 3,
    x: width * 0.5,
    y: height * 0.58,
  };
  for (let i = 0; i < numberOfRectangles; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(600, width);
    h = random.range(40, 200);

    fill = random.pick(rectangleColors).hex;
    stroke = random.pick(rectangleColors).hex;
    blend = random.value() > 0.5 ? "overlay" : "source-over";
    rectangles.push({ x, y, w, h, fill, stroke, blend });
  }

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mask.x, mask.y);

    drawPolygon({ context, radius: mask.radius, sides: mask.sides });
    context.clip();

    context.translate(-mask.x, -mask.y);

    rectangles.forEach(({ x, y, w, h, fill, stroke, blend }) => {
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

      context.globalCompositeOperation = blend;

      context.shadowColor = Color.style(shadowColor.rgba); // "rgba(0, 0, 0, 0.5";
      context.shadowOffsetX = -10;
      context.shadowOffsetY = 20;
      context.fill();

      context.shadowColor = null;
      context.stroke();

      context.lineWidth = 2;
      context.strokeStyle = "black";
      context.stroke();

      // go back to our previous context
      context.restore();
    });
    context.restore();

    context.save();
    context.translate(mask.x, mask.y);
    drawPolygon({ context, radius: mask.radius, sides: mask.sides });
    context.lineWidth = 10;
    context.strokeStyle = "black";
    context.stroke();
    context.restore();
  };
};

const drawPolygon = ({ context, radius = 100, sides = 3 }) => {
  const slice = (Math.PI * 2) / sides;

  context.beginPath();
  context.moveTo(0, -radius);

  for (let i = 1; i < sides; i++) {
    const theta = i * slice - Math.PI * 0.5;
    context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
  }
  context.closePath();
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
