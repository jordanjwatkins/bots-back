import knote from '../../../libs/knote'

let startTime

const eighthNoteTime = 0.25
const bars = 8
let songBars = 32

songBars = 8
let cycle = 0
let time = 0

export function thrones() {
  startTime = knote.audioContext.currentTime

  for (let bar = 0; bar < bars; bar++) {
    time = startTime + (bar * bars * eighthNoteTime) + (cycle * bars * (eighthNoteTime * 4))

    if (cycle === 0 || cycle === 2) {
      if (bar === 0) {
        songNote('A6', 1, 2)
        songNote('D5', 3, 2)

        songNote('F5', 5, 1)
        songNote('G5', 6, 1)

        songNote('A6', 7, 2)
      }

      if (bar === 1) {
        songNote('D5', 1, 2)

        songNote('F5', 3, 1)
        songNote('G5', 4, 1)

        songNote('A6', 5, 2)
        songNote('D5', 7, 2)
      }

      if (bar === 2) {
        songNote('F5', 1, 1)
        songNote('G5', 2, 1)

        songNote('A6', 3, 2)
        songNote('D5', 5, 2)

        songNote('F5', 7, 1)
        songNote('G5', 8, 1)
      }

      if (bar === 3) {
        songNote('E5', 1, 2)
        songNote('A5', 3, 4)
      }
    }

    if (cycle === 1 || cycle === 3) {
      if (bar === 0) {
        songNote('G5', 1, 2)
        songNote('C5', 3, 2)

        songNote('E5', 5, 1)
        songNote('F5', 6, 1)

        songNote('G5', 7, 2)
      }

      if (bar === 1) {
        songNote('C5', 1, 2)

        songNote('E5', 3, 1)
        songNote('F5', 4, 1)

        songNote('G5', 5, 2)
        songNote('C5', 7, 2)
      }

      if (bar === 2) {
        songNote('E5', 1, 1)
        songNote('F5', 2, 1)

        songNote('G5', 3, 2)
        songNote('C5', 5, 2)

        songNote('F5', 7, 1)
        songNote('E5', 8, 1)
      }

      if (bar === 3) {
        songNote('D5', 1, 4)
      }
    }

    songBars--

    if (songBars > 0 && bar === bars - 1) {
      cycle++
      bar = -1
    }
  }


  /*

    console.log(time)
    setTimeout(() => {
    console.log('next')

    songBars = 16
    cycle = 0

    thrones()
  }, (time - startTime - 6) * 1000) */
}

function songNote(noteName, eighthNoteInBar, eighthNotesOfDuration) {
  const note = knote.makeNote(noteName)
  const start = time + eighthNoteTime * (eighthNoteInBar - 1)

  knote.playSequenceNote(note, start, eighthNoteTime * eighthNotesOfDuration)
}

export default thrones
