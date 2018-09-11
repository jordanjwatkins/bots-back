import knote from '../../../libs/knote'

const { songNote, songNoise } = knote

export function exposition() {
  const beat = setInterval(() => {
    songNote('Eb4', 1, 1)
  }, 488)

  setTimeout(() => {
    bar()
    songNote('A4', 12, 3)

    setTimeout(() => {
      bar()
      songNote('Bb4', 12, 3)
    }, 0.20 * 19.6 * 1000)

    setTimeout(() => {
      bar()
      songNote('A4', 12, 3)

      setTimeout(() => {
        bar()
        songNote('Db4', 12, 3, 1)
      }, 0.20 * 19.6 * 1000)
    }, 0.20 * 19.6 * 1000 * 2)

    setTimeout(() => {
      bar()
      songNote('A4', 12, 3)

      setTimeout(() => {
        bar()
        songNote('Bb4', 12, 3)
      }, 0.20 * 19.6 * 1000)

      setTimeout(() => {
        bar()
        songNote('A4', 12, 3)

        setTimeout(() => {
          bar()
          songNote('Db4', 12, 3, 1)

          setTimeout(() => {
            songNoise(0, 4)
            clearInterval(beat)
          }, 3700)
        }, 0.20 * 19.6 * 1000)
      }, 0.20 * 19.6 * 1000 * 2)
    }, 0.20 * 19.6 * 1000 * 4.1)
  }, 2280)
}

function bar() {
  songNote('E4', 1, 0)
  songNote('Eb4', 2, 3)

  songNote('E4', 6, 0)
  songNote('Eb4', 7, 3)

  songNote('E4', 11, 0)
}

export default exposition
