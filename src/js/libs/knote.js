

window.AudioContext = window.AudioContext || window.webkitAudioContext;

let audioContext = false;

if (window.AudioContext) {
  audioContext = new window.AudioContext();
}

const semitoneMap = {
  C: 3,
  D: 5,
  E: 7,
  F: 8,
  G: 10,
  A: 12,
  B: 14,
};

function isAudioApiSupported() {
  return !!audioContext;
}

function playNote(note, options) {
  if (!isAudioApiSupported()) return;

  const config = options || {};
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const compressor = audioContext.createDynamicsCompressor();

  const gain = (typeof config.gain === 'number') ? config.gain : 0.2;
  const waveType = config.waveType || 'sine';

  const duration = config.duration || 0.25;
  const startTime = config.startTime || audioContext.currentTime;
  const stopTime = startTime + duration;
  const truncate = config.truncate || 0;

  oscillator.connect(gainNode);
  gainNode.connect(compressor);
  compressor.connect(audioContext.destination);

  gainNode.gain.value = 0;

  // fade in just after start time to prevent pops
  gainNode.gain.setTargetAtTime(gain, startTime + 0.01, 0.01);

  // fade just before stop time to prevent pops
  gainNode.gain.setTargetAtTime(0, (stopTime - 0.06) - truncate, 0.01);

  oscillator.frequency.value = note.frequency;
  oscillator.type = waveType;

  oscillator.start(startTime);
  oscillator.stop(stopTime);
}

function makeNote(noteName) {
  const note = {};
  const octaveIndex = (noteName.length === 3) ? 2 : 1;

  note.letter = noteName[0];
  note.octave = toInt(noteName[octaveIndex]);

  if (octaveIndex === 2) {
    note.accidental = noteName[1];
    note.accidentalOffset = (note.accidental === 'b') ? -1 : 1;
  }

  note.frequency = calculateNoteFrequency(note);

  note.name = noteName;

  return note;
}

function calculateNoteFrequency(note) {
  const defaultOctaveSemitones = 5 * 12;

  let semitoneOffset = semitoneMap[note.letter];

  semitoneOffset += (note.accidentalOffset) ? note.accidentalOffset : 0;

  semitoneOffset += (note.octave * 12) - defaultOctaveSemitones;

  const frequency = frequencyByOffset(440, semitoneOffset);

  return (isNaN(frequency)) ? 0 : frequency;
}

function frequencyByOffset(baseFrequency, semitoneOffset) {
  return baseFrequency * Math.pow(2, (semitoneOffset / 12));
}

function noteRange(firstNote, count, accidentals) {
  const notes = [];
  let note = makeNote(firstNote);

  notes.push(note);

  count--;

  for (let i = 0; i < count; i++) {
    note = nextNote(note, accidentals);
    notes.push(note);
  }

  return notes;
}

function noteNameRange(firstNote, count, accidentals) {
  const noteNames = [];
  let note = makeNote(firstNote);

  noteNames.push(note.name);

  for (let i = 0; i < count - 1; i++) {
    note = nextNote(note, accidentals);
    noteNames.push(note.name);
  }

  return noteNames;
}

function nextNote(note, accidentals) {
  const noteLetters = 'ABCDEFG'.split('');
  const letterIndex = noteLetters.indexOf(note.letter);
  let octave = note.octave;
  let letter;

  if (canHaveAccidental(note)) {
    letter = `${note.letter  }#`;
  } else {
    letter = nextLetter(letterIndex);

    if (letter === 'C') {
      octave++;
    }
  }

  return makeNote(letter + octave);

  function nextLetter(currentIndex) {
    const index = currentIndex + 1;

    return (noteLetters[index]) ? noteLetters[index] : noteLetters[0];
  }

  function canHaveAccidental() {
    if (!accidentals) {
      return false;
    }

    if (note.accidental) {
      return false;
    }

    return !((note.letter === 'B' || note.letter === 'E'));
  }
}

function prevNote(note, accidentals) {
  const noteLetters = 'ABCDEFG'.split('');
  const letterIndex = noteLetters.indexOf(note.letter);
  let octave = note.octave;
  let letter;

  if (note.accidental && accidentals) {
    letter = note.letter;
  } else {
    letter = prevLetter(letterIndex);

    if (letter === 'B') {
      octave--;
    }
  }

  return makeNote(letter + octave);

  function prevLetter(currentIndex) {
    const index = currentIndex - 1;

    return (noteLetters[index]) ? noteLetters[index] : noteLetters[noteLetters.length - 1];
  }
}

function toInt(value) {
  return parseInt(value, 10);
}

function playSequenceNote(note, startTime, duration, gain) {
  playNote(note, { startTime, duration, gain })
}

export default {
  audioContext,
  playNote,
  noteRange,
  noteNameRange,
  makeNote,
  nextNote,
  prevNote,
  playSequenceNote
};
