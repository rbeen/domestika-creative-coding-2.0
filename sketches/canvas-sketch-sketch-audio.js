const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const risoColors = require("riso-colors");

const settings = {
  dimensions: [1048, 1048],
  animate: true,
};

let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager;

const sketch = () => {
  const bins = [1, 2, 11, 50];
  const binColors = [
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
  ];
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    if (!audio || audio.paused) return;

    analyserNode.getFloatFrequencyData(audioData);

    for (let i = 0; i < bins.length; i++) {
      const mapped = math.mapRange(
        audioData[bins[i]],
        analyserNode.minDecibels,
        analyserNode.maxDecibels,
        0,
        1,
        true
      );
      const radius = mapped * 200;

      context.save();
      context.translate(width / 2, height / 2);
      context.strokeStyle = binColors[i].hex;
      context.lineWidth = 10;
      context.beginPath();
      context.arc(0, 0, radius, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    }
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
  audio.src = "audio/Orb-101-v2.mp3";

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
