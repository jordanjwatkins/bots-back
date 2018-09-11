import knote from '../../../libs/knote'

export { intro } from './intro'
export { exposition } from './exposition'

const { songNote } = knote

const soundDisabled = false

let note = 0
let note1 = 0

export function pulse(offset = 0) {
  if (soundDisabled) return

  const octave = 4 + offset

  if (note === 3) {
    songNote(`C${octave}`, 1, 1)
    note = 0
  } else if (note === 2) {
    note = 3
    songNote(`E${octave}`, 1, 1)
  } else if (note === 1) {
    note = 2
    songNote(`F${octave}`, 1, 1)
  } else {
    note = 1
    songNote(`A${octave}`, 1, 1)
  }
}

export function hop() {
  if (soundDisabled) return

  if (note1 === 2) {
    songNote('A6', 1, 1)
    note1 = 0
  } else if (note1 === 1) {
    note1 = 2
    songNote('C6', 1, 1)
  } else {
    note1 = 1
    songNote('F6', 1, 1)
  }
}

export function quickEnd() {
  if (soundDisabled) return

  songNote('E6', 1, 1)
  songNote('F6', 2, 1)
  songNote('F5', 3, 1)
}
