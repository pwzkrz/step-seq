import { useEffect, useState } from "react";
import InstrumentRow from "./InstrumentRow";
import PlayerRow from "./PlayerRow";

export default function SequencerContainer() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const [instruments] = useState([
    {
      name: "The Kick Drum",
      audio: () => {
        const [frequency, duration] = [50, 400];
        // create filter node
        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 440;
        filter.Q.value = 10;
        // create filter envelope
        filter.frequency.linearRampToValueAtTime(0, audioCtx.currentTime + 0);
        filter.frequency.linearRampToValueAtTime(
          400,
          audioCtx.currentTime + 0.01
        );
        filter.frequency.linearRampToValueAtTime(
          50,
          audioCtx.currentTime + 0.1
        );
        filter.frequency.linearRampToValueAtTime(
          10,
          audioCtx.currentTime + 0.4
        );
        filter.connect(audioCtx.destination);
        // create oscillator node
        const oscillator = audioCtx.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency; // value in hertz
        // create oscillator envelope
        oscillator.frequency.linearRampToValueAtTime(
          0,
          audioCtx.currentTime + 0
        );
        oscillator.frequency.linearRampToValueAtTime(
          6 * frequency,
          audioCtx.currentTime + 0.01
        );
        oscillator.frequency.linearRampToValueAtTime(
          2 * frequency,
          audioCtx.currentTime + 0.02
        );
        oscillator.frequency.linearRampToValueAtTime(
          10,
          audioCtx.currentTime + 0.4
        );
        oscillator.connect(filter);
        oscillator.start();
        setTimeout(() => oscillator.stop(), duration);
      },
    },
    {
      name: "Snare Drum 1",
      audio: () => {
        const bufferSize = 2 * audioCtx.sampleRate,
          noiseBuffer = audioCtx.createBuffer(
            1,
            bufferSize,
            audioCtx.sampleRate
          ),
          output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const filter1 = audioCtx.createBiquadFilter();
        filter1.type = "highpass";
        filter1.connect(audioCtx.destination);
        filter1.frequency.value = 1000;

        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 440;
        filter.frequency.linearRampToValueAtTime(0, audioCtx.currentTime + 0);
        filter.frequency.linearRampToValueAtTime(
          8000,
          audioCtx.currentTime + 0.01
        );
        filter.frequency.linearRampToValueAtTime(
          4000,
          audioCtx.currentTime + 0.1
        );
        filter.frequency.linearRampToValueAtTime(
          10,
          audioCtx.currentTime + 0.15
        );
        filter.Q.value = 0;
        filter.connect(filter1);

        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        whiteNoise.start(0);
        whiteNoise.connect(filter);
        setTimeout(() => whiteNoise.stop(), 150);
      },
    },
    {
      name: "Closed Hi Hat",
      audio: () => {
        const bufferSize = 2 * audioCtx.sampleRate,
          noiseBuffer = audioCtx.createBuffer(
            1,
            bufferSize,
            audioCtx.sampleRate
          ),
          output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const from = 12000;
        const to = 14000;
        const geometricMean = Math.sqrt(from * to);
        const filter = audioCtx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = geometricMean;
        filter.Q.value = geometricMean / (to - from);
        filter.connect(audioCtx.destination);

        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        whiteNoise.start(0);
        whiteNoise.connect(filter);
        setTimeout(() => whiteNoise.stop(), 50);
      },
    },
    {
      name: "Open Hi Hat",
      audio: () => {
        const bufferSize = 2 * audioCtx.sampleRate,
          noiseBuffer = audioCtx.createBuffer(
            1,
            bufferSize,
            audioCtx.sampleRate
          ),
          output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const from = 8000;
        const to = 18000;
        const geometricMean = Math.sqrt(from * to);
        const filter = audioCtx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = geometricMean;
        filter.Q.value = geometricMean / (to - from);
        filter.connect(audioCtx.destination);

        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        whiteNoise.start(0);
        whiteNoise.connect(filter);
        setTimeout(() => whiteNoise.stop(), 200);
      },
    },
  ]);

  let initSeqence = {};
  instruments.forEach((instrument) => {
    initSeqence[instrument.name] = new Array(16).fill(false);
  });

  const [sequence, setSequence] = useState(initSeqence);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function toggleSequencerButton(e) {
    let tempSequence = Object.assign({}, sequence);
    tempSequence[e.target.dataset.name][parseInt(e.target.dataset.id)] =
      !tempSequence[e.target.dataset.name][parseInt(e.target.dataset.id)];
    setSequence(tempSequence);
    e.target.classList.toggle("bg-orange-400");
  }

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        instruments.forEach((instrument) => {
          if (sequence[instrument.name][currentStep]) {
            instrument.audio();
          }
        });
        setCurrentStep((lastStep) => (lastStep < 15 ? lastStep + 1 : 0));
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, instruments, sequence]);

  function handlePlay() {
    setIsPlaying(true);
  }

  function handleStop() {
    setIsPlaying(false);
    setCurrentStep(0);
  }

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center bg-teal-300">
      <div className="flex flex-col gap-4 p-8 w-3/4 min-w-[620px] border-1 shadow-md rounded-lg object-center bg-white">
        {instruments.map((instrument) => (
          <InstrumentRow
            name={instrument.name}
            key={instrument.name}
            sequencer={sequence}
            toggleSequencerButton={toggleSequencerButton}
          />
        ))}
        <PlayerRow currentStep={currentStep} isPlaying={isPlaying} />
        {!isPlaying ? (
          <button
            className="border hover:bg-orange-500 mt-6 rounded-md p-4 transition-all duration-200"
            onClick={handlePlay}
          >
            ►
          </button>
        ) : (
          <button
            className="border hover:bg-orange-500 mt-6 rounded-md p-4 transition-all duration-200"
            onClick={handleStop}
          >
            ■
          </button>
        )}
      </div>
    </div>
  );
}
