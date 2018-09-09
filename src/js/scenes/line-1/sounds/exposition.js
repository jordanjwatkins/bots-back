import knote from '../../../libs/knote'

const { songNote, songNoise } = knote

export function exposition() {
  this.beat = setInterval(() => {
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
        songNoise(15, 4)

        setTimeout(() => {
          clearInterval(this.beat)
        }, 2000)
      }, 0.20 * 19.6 * 1000)
    }, 0.20 * 19.6 * 1000 * 2)
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
