import knote from '../../../libs/knote'

const { songNote, songNoise } = knote

export function intro() {
  const cancelers = [
    songNoise(13, 2),
    songNoise(24, 2.7),
    songNoise(36, 16),

    songNote('C5', 1, 0),

    songNote('C5', 1, 4),

    songNote('E5', 5, 1),
    songNote('G4', 6, 1),
    songNote('C5', 7, 1),
    songNote('E5', 8, 1),
    songNote('G4', 9, 1),

    songNote('C5', 10, 4),

    songNote('E5', 14, 1),
    songNote('G4', 15, 1),
    songNote('C5', 16, 1),
    songNote('E5', 17, 1),
    songNote('G4', 18, 1),

    songNote('C5', 19, 4),

    songNote('E5', 23, 1),
    songNote('A5', 24, 1),
    songNote('G5', 25, 1),
    songNote('C5', 26, 1),
    songNote('E5', 27, 1),
  ]

  // song interrupted
  /*
  songNote('D5', 28, 4)

  songNote('Db5', 32, 1)
  songNote('D5', 33, 1)
  songNote('G5', 34, 4)
  */

  return () => {
    cancelers.forEach(canceler => canceler())
  }
}

export default intro
