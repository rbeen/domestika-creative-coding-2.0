const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const risoColors = require("riso-colors");
const eases = require("eases");

const settings = {
  dimensions: [1048, 1048],
  animate: true,
};

let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager;
let minDecibels, maxDecibels;

const sketch = () => {
  const numCircles = 5;
  const numSlices = 9;
  const slice = (Math.PI * 2) / numSlices;
  const radius = 200;

  const bins = [];
  const binColors = [];

  const lineWidths = [];
  let lineWidth, bin, mapped;

  for (let i = 0; i < numCircles * numSlices; i++) {
    bin = random.rangeFloor(4, 64);
    if (random.value() > 0.6) bin = 0;
    bins.push(bin);
    binColors.push(random.pick(risoColors));
  }

  for (let i = 0; i < numCircles; i++) {
    const t = i / (numCircles - 1);
    lineWidth = eases.quadIn(t) * 200 + 20;
    lineWidths.push(lineWidth);
  }

  return ({ context, width, height }) => {
    context.fillStyle = "#EEEAE0";
    context.fillRect(0, 0, width, height);

    if (!audio || audio.paused) return;

    analyserNode.getFloatFrequencyData(audioData);

    context.save();
    context.translate(width / 2, height / 2);
    let cradius = radius;

    for (let i = 0; i < numCircles; i++) {
      context.save();
      for (let j = 0; j < numSlices; j++) {
        context.rotate(slice);

        bin = bins[i * numSlices + j];
        if (!bin) continue;

        const mapped = math.mapRange(
          audioData[bin],
          minDecibels,
          maxDecibels,
          0,
          1,
          true
        );

        lineWidth = lineWidths[i] * mapped;
        if (lineWidth < 1) continue;

        context.lineWidth = lineWidth;

        context.beginPath();
        context.strokeStyle = binColors[i * numSlices + j].hex;
        context.arc(0, 0, cradius + context.lineWidth * 0.5, 0, slice);
        context.stroke();
      }
      cradius += lineWidths[i];
      context.restore();
    }
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
  audio.src = "audio/Orb-101-v2.mp3";

  audioContext = new AudioContext();

  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);
  analyserNode = audioContext.createAnalyser();
  sourceNode.connect(analyserNode);

  minDecibels = analyserNode.minDecibels;
  maxDecibels = analyserNode.maxDecibels;
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
