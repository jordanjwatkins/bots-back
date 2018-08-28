import Bird from './bird'
import Line from './line'

export default (scene) => {
  const { mainCanvas } = scene

  const birdSize = 20
  const lineHeight = 5

  const lineTop = 400
  const line2Top = 200
  const line3Top = 300

  const line1 = new Line({
    y: lineTop,
    width: mainCanvas.canvas.width,
    height: lineHeight,
  })

  const line2 = new Line({
    y: line2Top,
    width: mainCanvas.canvas.width,
    height: lineHeight,
  })

  const line3 = new Line({
    y: line3Top,
    width: mainCanvas.canvas.width,
    height: lineHeight,
  })

  const levels = {
    oneLineTwoSimple({ absorber = false } = {}) {
      const entities = [
        line1,

        new Bird({
          x: 300,
          y: lineTop - birdSize,
          absorber,
        }),

        new Bird({
          x: 600,
          y: lineTop - birdSize,
          absorber,
        }),
      ]

      return {
        optimalPulseCount: 2,
        absorberOptimalPulseCount: 3,
        birdCount: getBirdCount(entities),
        entities,
      }
    },

    switchTwoClose({ absorber = false } = {}) {
      const entities = [
        line1,
        line2,

        new Bird({
          x: 400,
          y: line2Top - birdSize,
          verticalSwapper: true,
          absorber,
        }),

        new Bird({
          x: 500,
          y: lineTop - birdSize,
          verticalSwapper: true,
          absorber,
        }),
      ]

      return {
        optimalPulseCount: 2,
        absorberOptimalPulseCount: 2,
        birdCount: getBirdCount(entities),
        entities,
      }
    },

    switchTwoSpread({ absorber = false } = {}) {
      const entities = [
        line1,
        line2,

        new Bird({
          x: 300,
          y: line2Top - birdSize,
          verticalSwapper: true,
          absorber,
        }),

        new Bird({
          x: 600,
          y: line2Top - birdSize,
          verticalSwapper: true,
          absorber,
        }),
      ]

      return {
        optimalPulseCount: 2,
        absorberOptimalPulseCount: 3,
        birdCount: getBirdCount(entities),
        entities,
      }
    },

    oneSwitcher({ absorber = false } = {}) {
      const entities = [
        line1,
        line2,

        new Bird({
          x: 200,
          y: lineTop - birdSize,
          verticalSwapper: true,
          absorber,
        }),

        new Bird({
          x: 400,
          y: lineTop - birdSize,
          absorber,
        }),

        new Bird({
          x: 700,
          y: lineTop - birdSize,
          absorber,
        }),

        new Bird({
          x: 900,
          y: lineTop - birdSize,
          absorber,
        }),
      ]

      return {
        optimalPulseCount: 4,
        absorberOptimalPulseCount: 8,
        birdCount: getBirdCount(entities),
        entities,
      }
    },

    switchThreeClose({ absorber = false } = {}) {
      const entities = [
        line3,
        line2,

        new Bird({
          x: 400,
          y: line2Top - birdSize,
          verticalSwapper: true,
          absorber,
          startLine: line3,
        }),

        new Bird({
          x: 500,
          y: line3Top - birdSize,
          verticalSwapper: true,
          absorber,
          startLine: line3,
        }),

        new Bird({
          x: 700,
          y: line3Top - birdSize,
          verticalSwapper: true,
          absorber,
          startLine: line3,
        }),
      ]

      return {
        optimalPulseCount: 3,
        absorberOptimalPulseCount: 5,
        birdCount: getBirdCount(entities),
        entities,
      }
    },

    switchThreeSpreadThreeLine({ absorber = false } = {}) {
      const entities = [
        line1,
        line3,
        line2,

        new Bird({
          x: 400,
          y: lineTop - birdSize,
          verticalSwapper: true,
          absorber,
          startLine: line1,
        }),

        new Bird({
          x: 600,
          y: line3Top - birdSize,
          verticalSwapper: true,
          absorber,
        }),

        new Bird({
          x: 800,
          y: line3Top - birdSize,
          verticalSwapper: true,
          absorber,
        }),
      ]

      return {
        optimalPulseCount: 4,
        absorberOptimalPulseCount: 5,
        birdCount: getBirdCount(entities),
        entities,
      }
    },

    switchFourClose({ absorber = false } = {}) {
      const entities = [
        line1,
        line2,

        new Bird({
          x: 300,
          y: lineTop - birdSize,
          verticalSwapper: true,
          absorber,
        }),

        new Bird({
          x: 400,
          y: line2Top - birdSize,
          verticalSwapper: true,
          absorber,
        }),

        new Bird({
          x: 500,
          y: lineTop - birdSize,
          verticalSwapper: true,
          absorber,
        }),

        new Bird({
          x: 600,
          y: line2Top - birdSize,
          verticalSwapper: true,
          absorber,
        }),
      ]

      return {
        optimalPulseCount: 3,
        absorberOptimalPulseCount: 6,
        birdCount: getBirdCount(entities),
        entities,
      }
    },

    switchFourSpread({ absorber = false } = {}) {
      const entities = [
        line1,
        line2,

        new Bird({
          x: 200,
          y: lineTop - birdSize,
          verticalSwapper: true,
          absorber,
        }),

        new Bird({
          x: 400,
          y: line2Top - birdSize,
          verticalSwapper: true,
          absorber,
        }),

        new Bird({
          x: 700,
          y: lineTop - birdSize,
          verticalSwapper: true,
          absorber,
        }),

        new Bird({
          x: 900,
          y: line2Top - birdSize,
          verticalSwapper: true,
          absorber,
        }),
      ]

      return {
        optimalPulseCount: 4,
        absorberOptimalPulseCount: 8,
        birdCount: getBirdCount(entities),
        entities,
      }
    },

    oneLineTwoSimpleOneHeavy({ absorber = false } = {}) {
      const entities = [
        line1,

        new Bird({
          x: 300,
          y: lineTop - birdSize,
          absorber,
        }),

        new Bird({
          x: 450,
          y: lineTop - birdSize * 2,
          width: birdSize * 2,
          height: birdSize * 2,
          absorber,
          heavy: true,
        }),

        new Bird({
          x: 600,
          y: lineTop - birdSize,
          absorber,
        }),
      ]

      return {
        optimalPulseCount: 5,
        absorberOptimalPulseCount: 8,
        birdCount: getBirdCount(entities),
        entities,
      }
    },

    twoHeavyDefended({ absorber = false } = {}) {
      const entities = [
        line1,
        line2,

        new Bird({
          x: 100,
          y: lineTop - birdSize,
          absorber,
        }),

        new Bird({
          x: 250,
          y: lineTop - birdSize,
          absorber,
        }),

        new Bird({
          x: 400,
          y: lineTop - birdSize * 2,
          width: birdSize * 2,
          height: birdSize * 2,
          absorber,
          heavy: true,
        }),

        new Bird({
          x: 600,
          y: line2Top - birdSize,
          absorber,
        }),

        new Bird({
          x: 750,
          y: line2Top - birdSize,
          absorber,
        }),

        new Bird({
          x: 900,
          y: line2Top - birdSize * 2,
          width: birdSize * 2,
          height: birdSize * 2,
          absorber,
          heavy: true,
        }),
      ]

      return {
        optimalPulseCount: 12,
        absorberOptimalPulseCount: 24,
        birdCount: getBirdCount(entities),
        entities,
      }
    },
  }

  const preppedLevels = Object.entries(levels).reduce((obj, entry) => {
    const [key, value] = entry

    obj[key] = value

    return obj
  }, {})

  const preppedAbsorberLevels = Object.entries(levels).reduce((obj, entry) => {
    const [key, value] = entry

    obj[`${key}Absorber`] = () => value({ absorber: true })

    return obj
  }, {})

  return Object.assign({}, preppedLevels, preppedAbsorberLevels)
}

function getBirdCount(entities) {
  return entities.filter(entity => entity.constructor.name === 'Bird').length
}
