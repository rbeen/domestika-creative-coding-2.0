const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1048, 1048],
};

let audio;

const sketch = () => {
  audio = document.createElement("audio");
  audio.src = "audio/Orb-101.mp3";

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
  };
};

const addListeners = () => {
  window.addEventListener("mouseup", () => {
    audio.paused ? audio.play() : audio.pause();
  });
};
addListeners();
canvasSketch(sketch, settings);
