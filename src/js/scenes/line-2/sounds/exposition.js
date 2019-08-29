import knote from '../../../libs/knote'

const { songNote, songNoise } = knote

export function exposition(endTitle = false) {
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

        if (endTitle) {
          setTimeout(() => clearInterval(beat), 3000)
        }
      }, 0.20 * 19.6 * 1000)
    }, 0.20 * 19.6 * 1000 * 2)

    if (endTitle) {
      return () => {
        let id = setTimeout(() => {}, 0)

        while (id--) {
          window.clearTimeout(id)
        }
      }
    }

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
            if (this) this.staticCancel = songNoise(0, 4)
            clearInterval(beat)
          }, 3700)
        }, 0.20 * 19.6 * 1000)
      }, 0.20 * 19.6 * 1000 * 2)
    }, 0.20 * 19.6 * 1000 * 4.1)
  }, 2280)

  return () => {
    let id = setTimeout(() => {}, 0)

    while (id--) {
      clearTimeout(id)
    }

    if (this && this.staticCancel) this.staticCancel()
  }
}

function bar() {
  songNote('E4', 1, 0)
  songNote('Eb4', 2, 3)

  songNote('E4', 6, 0)
  songNote('Eb4', 7, 3)

  songNote('E4', 11, 0)
}

export default exposition
