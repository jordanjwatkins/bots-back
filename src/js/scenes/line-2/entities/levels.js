import Bird from './bird'
import Line from './line'
import Platform from './platform'

export default (scene) => {
  const { mainCanvas } = scene

  const levels = {
    oneLineTwoSimple: () => {
      const groundY = 550

      return {
        groundY,
        entities: [
          // new Bird({ x: 900, y: groundY - 20 }),
          // new Bird({ x: 960, y: groundY - 50, heavy: true, width: 50, height: 50 }),
          new Bird({ x: 30, y: groundY - 20, bad: true }),
          // new Bird({ x: 70, y: groundY - 20, bad: true }),
          // new Bird({ x: 90, y: groundY - 20, bad: true }),
          // new Bird({ x: 130, y: groundY - 20, bad: true }),
          new Bird({ x: 150, y: groundY - 20, bad: true }),
        ],

        groups: {
          platforms: [
            new Platform({ x: 650, y: groundY - 60 }),
          ],
        },

        spawn(entity) {
          this.entities.push(entity)
        },

        update() {
          if (!this.timeout) {
            this.timeout = setInterval(() => {
              const bird = new Bird({ x: -20, y: groundY - 20, bad: true })

              // bird.menu.menuFields['stop-go'].value = 'go'
              this.spawn(bird)
            }, 15000)
          }
        },
      }
    },

    stackTests: () => {
      const groundY = 550

      return {
        groundY,
        entities: [

          new Bird({ x: 10, y: groundY - 50, heavy: true, width: 50, height: 50, preSpawned: true }),
          new Bird({ x: 70, y: groundY - 20, preSpawned: true }),
          new Bird({ x: 100, y: groundY - 20, preSpawned: true }),

          new Bird({ x: 580, y: groundY - 50, heavy: true, width: 50, height: 50, preSpawned: true }),

          new Bird({ x: 900, y: groundY - 20, preSpawned: true }),
          new Bird({ x: 960, y: groundY - 50, heavy: true, width: 50, height: 50, preSpawned: true }),
        ],

        groups: {
          platforms: [
            new Platform({ x: 650, y: groundY - 60 }),
          ],
        },

        spawn(entity) {
          this.entities.push(entity)
        },

        update() {
          if (!this.timeout) {
            this.timeout = setInterval(() => {
              const bird = new Bird({ x: -20, y: groundY - 20, bad: true })

              // bird.menu.menuFields['stop-go'].value = 'go'
              this.spawn(bird)
            }, 15000)
          }
        },
      }
    },

    test: () => ({
      entities: [],
    }),
  }

  return levels
}
