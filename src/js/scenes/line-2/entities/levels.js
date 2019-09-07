import Bird from './bird'
import Platform from './platform'
import PitBridge from './pit-bridge'
import Pulser from './pulser'

export default (scene) => {
  const { mainCanvas } = scene

  const levels = {
    basics: () => {
      const groundY = 550
      const startY = groundY - 5

      const bird = new Bird({ x: 490, y: groundY - 80, bad: true, speed: { x: 0, y: 0 }, questionable: true, sleeping: true, })
      const bird2 = new Bird({ x: 270, y: groundY - 20, bad: true, speed: { x: 0, y: 0 }, sleeping: true })
      const bird3 = new Bird({ x: 170, y: groundY - 20, bad: true, speed: { x: 0, y: 0 }, sleeping: true })

      const platform2 = new Platform({ x: 450, y: groundY - 60 })

      bird.onPlatform = true
      bird.host = platform2
      bird.target = { entity: bird.host }

      return {
        groundY,
        startY,
        entities: [
          bird,
          bird2,
          bird3,
          //new PitBridge({ x: 300, y: groundY }),
        ],

        pulser: new Pulser({ x: 880, y: groundY - 50 }),

        groups: {
          platforms: [
            new Platform({ x: 650, y: groundY - 60 }),
            platform2,
            //new Platform({ x: 430, y: groundY - 30, width: 20 }), // power up (climb?/sprint?)
          ],
        },

        spawn(entity) {
          this.entities.push(entity)

          setTimeout(() => {
            entity.pulser.occupied = true
          }, 100)
        },

        update() {
          if (!bird.sleeping && !bird.awake) {
            bird.awake = true
            bird.drew = false
            bird.questionable = false

            setTimeout(() => {
              bird.speed.x = 1
              bird.speed.y = 2
              bird.menu.getField('stop-go').value = 'go'
              bird.movingToGround = true
            }, 1000)

            setTimeout(() => {
              bird2.sleeping = false
            }, 2000)

            setTimeout(() => {
              bird3.sleeping = false
            }, 4000)

            setTimeout(() => {
              bird2.speed.x = 1
              bird2.menu.getField('stop-go').value = 'go'
              bird2.drew = false

              bird3.speed.x = 1
              bird3.menu.getField('stop-go').value = 'go'
              bird3.drew = false
            }, 6000)
          }
        },
      }
    },

    stackAttack: () => {
      const groundY = 550
      const startY = groundY - 80

      const bird = new Bird({ x: 690, y: groundY - 20, bad: true, speed: { x: 0, y: 0 }, questionable: true })


      return {
        groundY,
        startY,
        entities: [
          bird,
          //bird2,
          //bird3,
          //new PitBridge({ x: 300, y: groundY }),
        ],

        pulser: new Pulser({ x: 880, y: 420 }),

        groups: {
          platforms: [
            new Platform({ x: 750, y: startY, width: 300, height: 300 }),
          ],
        },

        spawn(entity) {
          entity.onPlatform = true
          entity.host = this.groups.platforms[0]
          entity.target = { entity: entity.host }
          this.entities.push(entity)
        },

        update() {

        },
      }
    },

    bridgeRun: () => {
      const groundY = 550
      const startY = groundY

      return {
        startY,
        groundY,
        entities: [
          // new Bird({ x: 900, y: groundY - 20 }),
          // new Bird({ x: 960, y: groundY - 50, heavy: true, width: 50, height: 50 }),
          new Bird({ x: 30, y: groundY - 20, bad: true }),
          // new Bird({ x: 70, y: groundY - 20, bad: true }),
          // new Bird({ x: 90, y: groundY - 20, bad: true }),
          // new Bird({ x: 130, y: groundY - 20, bad: true }),
          new Bird({ x: 150, y: groundY - 20, bad: true }),
          new PitBridge({ x: 300, y: groundY, width: 200, height: 200 }),
        ],

        groups: {
          platforms: [
            new Platform({ x: 650, y: groundY - 50 }),
          ],
        },

        spawn(entity) {
          this.entities.push(entity)
        },

        update() {

        },
      }
    },

    /*
      stackTests: () => {
        const groundY = 550

        return {
          groundY,
          entities: [

            new Bird({ x: 10, y: groundY - 50, heavy: true, width: 50, height: 50, preSpawned: true }),
            new Bird({ x: 70, y: groundY - 20, preSpawned: true }),
            new Bird({ x: 100, y: groundY - 20, preSpawned: true }),

            new Bird({ x: 580, y: groundY - 50, heavy: true, width: 50, height: 50, preSpawned: true }),

            new Bird({ x: 770, y: groundY - 20, preSpawned: true }),
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
    */
  }

  return levels
}
