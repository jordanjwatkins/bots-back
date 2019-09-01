import Bird from './bird'
import Line from './line'

export default (scene) => {
  const { mainCanvas } = scene

  const levels = {
    oneLineTwoSimple: () => {
      const groundY = 550

      return {
        groundY,
        entities: [
          new Bird({ x: 960, y: groundY - 20 }),
          new Bird({ x: 900, y: groundY - 50, heavy: true, width: 50, height: 50 }),
          new Bird({ x: 30, y: groundY - 20, bad: true }),
        ],
      }
    },

    test: () => {
      return {
        entities: [],
      }
    },
  }

  return levels
}
