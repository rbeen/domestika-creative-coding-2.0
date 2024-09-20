const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [2048, 2048],
  animate: true,
};

let canvasElement;

let points;

const sketch = ({ canvas }) => {
  points = [
    new Point({ x: 200, y: 540 }),
    new Point({ x: 700, y: 400 }),
    new Point({ x: 880, y: 540 }),
    new Point({ x: 600, y: 700 }),
    new Point({ x: 640, y: 900 }),
  ];

  canvasElement = canvas;
  canvas.addEventListener("mousedown", onMouseDown);

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    context.strokeStyle = "#999";
    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }
    context.stroke();

    // for (let i = 1; i < points.length; i += 2) {
    //   context.quadraticCurveTo(
    //     points[i].x,
    //     points[i].y,
    //     points[i + 1].x,
    //     points[i + 1].y
    //   );
    // }
    // context.stroke();

    context.beginPath();
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const mx = current.x + (next.x - current.x) / 2;
      const my = current.y + (next.y - current.y) / 2;

      // context.beginPath();
      // context.arc(mx, my, 5, 0, Math.PI * 2);
      // context.fillStyle = "green";
      // context.fill();

      if (i === 0) {
        context.moveTo(current.x, current.y);
      } else if (i === points.length - 2) {
        context.quadraticCurveTo(current.x, current.y, next.x, next.y);
      } else {
        context.quadraticCurveTo(current.x, current.y, mx, my);
      }
    }
    context.lineWidth = 5;
    context.strokeStyle = "green";
    context.stroke();

    points.forEach((point) => {
      point.draw(context);
    });
  };
};

const onMouseDown = (event) => {
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  const x = (event.offsetX / canvasElement.offsetWidth) * canvasElement.width;
  const y = (event.offsetY / canvasElement.offsetHeight) * canvasElement.height;

  let hit = false;

  points.forEach((point) => {
    point.isDragging = point.hitTest({ x, y });
    hit = hit || point.isDragging;
  });

  if (!hit) {
    points.push(new Point({ x, y }));
  }
};

const onMouseMove = (event) => {
  const x = (event.offsetX / canvasElement.offsetWidth) * canvasElement.width;
  const y = (event.offsetY / canvasElement.offsetHeight) * canvasElement.height;

  points.forEach((point) => {
    if (point.isDragging) {
      point.x = x;
      point.y = y;
    }
  });
};

const onMouseUp = () => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
};

canvasSketch(sketch, settings);

class Point {
  constructor({ x, y, control = false }) {
    this.x = x;
    this.y = y;
    this.control = control;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.control ? "red" : "blue";
    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  hitTest({ x, y }) {
    const dx = this.x - x;
    const dy = this.y - y;
    return Math.sqrt(dx * dx + dy * dy) < 20;
  }
}
