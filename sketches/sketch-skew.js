const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  // parameters for drawing our rectangle
  let x, y, w, h;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    x = width * 0.5;
    y = height * 0.5;
    w = width * 0.5;
    h = height * 0.1;

    // save context before manipulation
    context.save();
    
    // manipulate context coordinates so we can draw more cleanly
    context.translate(x, y);
    context.translate(w*-0.5, h*-0.5)


    // draw a blue outline rectangle edge by edge
    context.strokeStyle = 'blue';
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(w, 0);
    context.lineTo(w, h);
    context.lineTo(0, h);
    context.closePath();
    context.stroke();

    // go back to our previous context
    context.restore();
  };
};

canvasSketch(sketch, settings);
