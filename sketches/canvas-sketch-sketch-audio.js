const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1048, 1048],
  animate: true,
};

let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager;

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    if (!audio || audio.paused) return;

    analyserNode.getFloatFrequencyData(audioData);
    const avg = getAverage(audioData);

    context.save();
    context.translate(width / 2, height / 2);
    context.lineWidth = 10;
    context.beginPath();
    context.arc(0, 0, Math.abs(avg), 0, Math.PI * 2);
    context.stroke();
    context.restore();
  };
};

const addListeners = () => {
  window.addEventListener("mouseup", () => {
    if (!audioContext) createAudio();

    if (audio.paused) {
      audio.play();
      manager.play();
    } else {
      audio.pause();
      manager.pause();
    }
  });
};

const createAudio = () => {
  audio = document.createElement("audio");
  audio.src = "audio/Orb-101.mp3";

  audioContext = new AudioContext();

  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);
  analyserNode = audioContext.createAnalyser();
  sourceNode.connect(analyserNode);

  audioData = new Float32Array(analyserNode.frequencyBinCount);
};

const getAverage = (data) => {
  const sum = data.reduce((accumulator, current) => accumulator + current, 0);
  return sum / data.length;
};

const start = async () => {
  addListeners();
  manager = await canvasSketch(sketch, settings);
  manager.pause();
};
start();
