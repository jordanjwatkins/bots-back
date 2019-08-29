import Bird from './bird'
import Line from './line'

export default (scene) => {
  const { mainCanvas } = scene

  const levels = {
    oneLineTwoSimple: () => {
      return {
        entities: [
          new Bird({ x: 900, y: 526 }),
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
