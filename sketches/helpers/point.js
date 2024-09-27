import random from "canvas-sketch-util/random";

export default class Point {
  constructor({ x, y, control = false, color = "blue", lineWidth = 4 }) {
    this.x = x;
    this.y = y;
    this.control = control;
    this.color = color;
    this.lineWidth = lineWidth;

    this.initialX = x;
    this.initialY = y;
  }

  randomize({ frame, frequency, amplitude }) {
    const noise = random.noise2D(
      this.initialX + frame,
      this.initialY,
      frequency,
      amplitude
    );
    this.x = this.initialX + noise;
    this.y = this.initialY + noise;
  }
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.control ? "red" : this.color;
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
