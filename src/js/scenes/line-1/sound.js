// import Tone from 'tone'

const soundDisabled = false

export const brown = () => {
  new Tone.Noise({
    volume: -20,
    type: 'brown',
  }).toMaster().start()
}

export const jump = () => {
  const synth = new Tone.PolySynth(3, Tone.Synth, {
    oscillator: {
      type: 'fatsawtooth',
      count: 3,
      spread: 30,
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
      release: 0.4,
      attackCurve: 'exponential',
    },
  }).toMaster()
  // Van Halen - Jump MIDI from http://www.midiworld.com/files/1121/
  // converted using
  const part = new Tone.Part(((time, note) => {
    synth.triggerAttackRelease(note.noteName, note.duration, time, note.velocity)
  }), [
    {
      time: '192i',
      noteName: 'G4',
      velocity: 0.8110236220472441,
      duration: '104i',
    },
    {
      time: '192i',
      noteName: 'B4',
      velocity: 0.7874015748031497,
      duration: '104i',
    },
    {
      time: '192i',
      noteName: 'D5',
      velocity: 0.8031496062992126,
      duration: '104i',
    },
    {
      time: '480i',
      noteName: 'G4',
      velocity: 0.7559055118110236,
      duration: '104i',
    },
    {
      time: '480i',
      noteName: 'C5',
      velocity: 0.6850393700787402,
      duration: '104i',
    },
    {
      time: '480i',
      noteName: 'E5',
      velocity: 0.6771653543307087,
      duration: '104i',
    },
    {
      time: '768i',
      noteName: 'F4',
      velocity: 0.8661417322834646,
      duration: '104i',
    },
    {
      time: '768i',
      noteName: 'A4',
      velocity: 0.8346456692913385,
      duration: '104i',
    },
    {
      time: '768i',
      noteName: 'C5',
      velocity: 0.8188976377952756,
      duration: '104i',
    },
    {
      time: '1056i',
      noteName: 'F4',
      velocity: 0.7007874015748031,
      duration: '104i',
    },
    {
      time: '1056i',
      noteName: 'A4',
      velocity: 0.6850393700787402,
      duration: '104i',
    },
    {
      time: '1056i',
      noteName: 'C5',
      velocity: 0.6614173228346457,
      duration: '104i',
    },
    {
      time: '1248i',
      noteName: 'G4',
      velocity: 0.6771653543307087,
      duration: '104i',
    },
    {
      time: '1248i',
      noteName: 'B4',
      velocity: 0.6771653543307087,
      duration: '104i',
    },
    {
      time: '1248i',
      noteName: 'D5',
      velocity: 0.7165354330708661,
      duration: '104i',
    },
    {
      time: '1440i',
      noteName: 'G4',
      velocity: 0.8818897637795275,
      duration: '248i',
    },
    {
      time: '1440i',
      noteName: 'B4',
      velocity: 0.84251968503937,
      duration: '248i',
    },
    {
      time: '1440i',
      noteName: 'D5',
      velocity: 0.8818897637795275,
      duration: '248i',
    },
    {
      time: '1728i',
      noteName: 'G4',
      velocity: 0.8267716535433071,
      duration: '104i',
    },
    {
      time: '1728i',
      noteName: 'C5',
      velocity: 0.8031496062992126,
      duration: '104i',
    },
    {
      time: '1728i',
      noteName: 'E5',
      velocity: 0.8188976377952756,
      duration: '104i',
    },
    {
      time: '2016i',
      noteName: 'F4',
      velocity: 0.7086614173228346,
      duration: '104i',
    },
    {
      time: '2016i',
      noteName: 'A4',
      velocity: 0.7244094488188977,
      duration: '104i',
    },
    {
      time: '2016i',
      noteName: 'C5',
      velocity: 0.7007874015748031,
      duration: '104i',
    },
    {
      time: '2208i',
      noteName: 'C4',
      velocity: 0.9921259842519685,
      duration: '296i',
    },
    {
      time: '2208i',
      noteName: 'F4',
      velocity: 0.968503937007874,
      duration: '200i',
    },
    {
      time: '2208i',
      noteName: 'A4',
      velocity: 0.9606299212598425,
      duration: '208i',
    },
    {
      time: '2400i',
      noteName: 'E4',
      velocity: 0.7559055118110236,
      duration: '104i',
    },
    {
      time: '2400i',
      noteName: 'G4',
      velocity: 0.7007874015748031,
      duration: '104i',
    },
    {
      time: '2592i',
      noteName: 'C4',
      velocity: 0.968503937007874,
      duration: '488i',
    },
    {
      time: '2592i',
      noteName: 'D4',
      velocity: 0.9448818897637795,
      duration: '488i',
    },
    {
      time: '2592i',
      noteName: 'G4',
      velocity: 0.937007874015748,
      duration: '488i',
    },
  ]).start(0)

  part.loop = true
  part.loopEnd = '4m'
  Tone.Transport.bpm.value = 132
  Tone.Transport.start('+0.1')
}

var synth,
  part

export const jump1 = () => {
  /* synth = synth || new Tone.PolySynth(3, Tone.Synth, {
    "oscillator" : {
      "type" : "fatsawtooth",
      "count" : 3,
      "spread" : 30
    },
    "envelope": {
      "attack": 0.01,
      "decay": 0.1,
      "sustain": 0.5,
      "release": 0.4,
      "attackCurve" : "exponential"
    },
  }).toMaster(); */

  console.log('jump 1')


  synth = synth || new Tone.FMSynth().toMaster()

  // var synth = new Tone.FMSynth().toMaster()

  // schedule a series of notes, one per second
  // synth.triggerAttackRelease('C4', 0.5, 0)
  // synth.triggerAttackRelease('E4', '200i', '+1.0')
  // synth.triggerAttackRelease('G4', 0.5, 2)
  // synth.triggerAttackRelease('B4', 0.5, 3)

  part = part || new Tone.Part(((time, note) => {
    synth.triggerAttackRelease(note.noteName, note.duration, time, note.velocity)
  }), [
    {
      time: '400i',
      noteName: 'G4',
      velocity: 0.8110236220472441,
      duration: '50i',
    },
    {
      time: '400i',
      noteName: 'B4',
      velocity: 0.7874015748031497,
      duration: '50i',
    },
    {
      time: '400i',
      noteName: 'D5',
      velocity: 0.8031496062992126,
      duration: '50i',
    },

    {
      time: '200i',
      noteName: 'A4',
      velocity: 0.8110236220472441,
      duration: '50i',
    },
    {
      time: '200i',
      noteName: 'F4',
      velocity: 0.7874015748031497,
      duration: '50i',
    },
    {
      time: '200i',
      noteName: 'C5',
      velocity: 0.8031496062992126,
      duration: '50i',
    },
  ]).start(0)
  part.loop = true
  Tone.Transport.bpm.value = 132
  Tone.Transport.start('+0.001')
// Tone.Transport.stop("+0.1");
}

var synth
let note = 0
let note1 = 0

export function jump2(offset) {
  if (soundDisabled) return;
  // create a synth and connect it to the master output (your speakers)
  const synth = new Tone.Synth().toMaster()

  const octave = 5 + offset

  // play a middle 'C' for the duration of an 8th note
  if (note == 3) {
    synth.triggerAttackRelease(`C${octave}`, '8n')
    note = 0
  } else if (note == 2) {
    note = 3
    synth.triggerAttackRelease(`E${octave}`, '8n')
  } else if (note == 1) {
    note = 2
    synth.triggerAttackRelease(`F${octave}`, '8n')
  } else {
    note = 1
    synth.triggerAttackRelease(`A${octave}`, '8n')
  }
}

export function jump3() {
  if (soundDisabled) return;

  const synth = new Tone.Synth().toMaster()

  if (note1 == 2) {
    synth.triggerAttackRelease('A6', '8n')
    note1 = 0
  } else if (note1 == 1) {
    note1 = 2
    synth.triggerAttackRelease('C6', '8n')
  } else {
    note1 = 1
    synth.triggerAttackRelease('F6', '8n')
  }
}

export function jump4() {
  if (soundDisabled) return;

  const synth = new Tone.Synth().toMaster()

  synth.triggerAttackRelease('E6', '8n', '+0.8')

  synth.triggerAttackRelease('F6', '8n', '+1')
  synth.triggerAttackRelease('F5', '8n', '+1.2')
}

