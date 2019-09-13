import Bird from './bird'
import Platform from './platform'
import PitBridge from './pit-bridge'
import Pulser from './pulser'

export default (scene) => {
  const { mainCanvas } = scene

  const levels = {
    basics: () => {
      const groundY = 550
      const startY = groundY

      const bird = new Bird({ x: 490, y: groundY - 80, bad: true, speed: { x: 0, y: 0 }, questionable: true, sleeping: true })
      const bird2 = new Bird({ x: 270, y: groundY - 20, bad: true, speed: { x: 0, y: 0 }, sleeping: true })
      const bird3 = new Bird({ x: 170, y: groundY - 20, bad: true, speed: { x: 0, y: 0 }, sleeping: true })

      const platform2 = new Platform({ x: 400, width: 120, y: groundY - 60 })

      bird.onPlatform = true
      bird.host = new Platform({ x: 400, width: 120, y: groundY - 60 })
      bird.target = { entity: bird.host }

      return {
        groundY,
        startY,
        entities: [
          bird,
          bird2,
          bird3,
          new PitBridge({ x: -50, y: groundY, width: 200, height: 200, lockedClosed: true }),
          // new PitBridge({ x: 300, y: groundY }),
        ],

        pulser: new Pulser({ x: 880, y: groundY - 50 }),

        groups: {
          platforms: [
            new Platform({ x: 650, y: groundY - 60 }),
            bird.host,
            new Platform({ x: 350, y: groundY - 120 }),
            new Platform({ x: 170, y: startY - 200, width: 20, height: 20, upgrade: 'booster' }),
            new Platform({ x: 150, y: groundY - 160 }),
          ],
        },

        spawn(entity) {
          this.entities.push(entity)

          setTimeout(() => {
            entity.menu.menuFields['dont-climb'].value = 'dont'
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
      const startY = groundY - 120

      const bird = new Bird({ x: 690, y: groundY - 20, bad: true, speed: { x: 0, y: 0 }, questionable: true })

      // const thrusterUpgrade = new Platform({ x: 710, y: startY + 30, width: 30, height: 30, upgrade: 'thruster' })
      // const thrusterUpgrade =

      return {
        groundY,
        startY,
        entities: [
          bird,
          // bird2,
          // bird3,
          new PitBridge({ x: 380, y: groundY, width: 200, height: 300 }),

        ],

        pulser: new Pulser({ x: 880, y: startY - 50 }),

        groups: {
          platforms: [
            new Platform({ x: 750, y: startY, width: 300, height: 300 }),

            new Platform({ x: 480, y: startY + 40, width: 60, height: 20 }),

            new Platform({ x: -40, y: startY + 40, width: 300, height: 380 }),

            new Platform({ x: 500, y: startY + 140, width: 20, height: 20, upgrade: 'thruster' }),
          ],
        },

        spawn(entity) {
          entity.onPlatform = true
          entity.host = this.groups.platforms[0]
          entity.target = { entity: entity.host }
          this.entities.push(entity)

          setTimeout(() => {
            // entity.menu.menuFields['dont-climb'].value = 'dont'
            entity.pulser.occupied = true
          }, 100)
        },

        resetBaddie() {
          // this.entities.push(new Bird({ x: 690, y: groundY - 20, bad: true, speed: { x: 0, y: 0 }, questionable: true }))
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
          //new Bird({ x: 30, y: groundY - 30, bad: true }),
          // new Bird({ x: 70, y: groundY - 20, bad: true }),
          // new Bird({ x: 90, y: groundY - 20, bad: true }),
          // new Bird({ x: 130, y: groundY - 20, bad: true }),
          new Bird({ x: 220, y: groundY - 30, bad: true }),
          new PitBridge({ x: 300, y: groundY, width: 200, height: 200 }),
          new PitBridge({ x: -100, y: groundY - 400, width: 200, height: 700, steam: false, z: 2, lockedClosed: true }),
        ],

        groups: {
          platforms: [
            new Platform({ x: 0, y: groundY - 280, width: 300, height: 280, z: 6 }),
            new Platform({ x: 630, y: groundY - 80, width: 100 }),

            new Platform({ x: 630, y: groundY - 110, width: 20, height: 20, upgrade: 'e1', color: '#2472ff' }),
            new Platform({ x: 630, y: groundY - 20, width: 20, height: 20, upgrade: 'e2', color: '#2472ff' }),
            new Platform({ x: 130, y: groundY - 30, width: 20, height: 20, upgrade: 'e3', color: '#2472ff' }),

           // new Platform({ x: 600, y: groundY - 20, width: 20, height: 20, upgrade: 'e2', color: '#2472ff' }),
           // new Platform({ x: 630, y: groundY - 20, width: 20, height: 20, upgrade: 'e1', color: '#2472ff' }),
            //new Platform({ x: 660, y: groundY - 20, width: 20, height: 20, upgrade: 'e3', color: '#2472ff' }),
          ],
        },

        spawn(entity) {
          this.entities.push(entity)

          setTimeout(() => {
            entity.menu.menuFields['dont-climb'].value = 'dont'
            entity.pulser.occupied = true
          }, 100)
        },

        update() {
          if (scene.e3) mainCanvas.lateRenders.push(() => mainCanvas.drawTriangleFromPoints([{ x: -20, y: 100 }, { x: 200, y: 550 }, { x: 300, y: 550 }], 1, '#f73434'))

          if (scene.e2) mainCanvas.lateRenders.push(() => mainCanvas.drawTriangleFromPoints([{ x: -20, y: 100 }, { x: 400, y: 550 }, { x: 600, y: 550 }], 1, '#ff9292'))

          if (scene.e1) {
            mainCanvas.lateRenders.push(() => mainCanvas.drawTriangleFromPoints([{ x: -20, y: 100 }, { x: 750, y: 550 }, { x: 890, y: 550 }], 1, 'red'))

            //this.spawnScanOffset -= 0.4
          }

          if (scene.e3) { // && scene.e2 && scene.e3) {

            console.log('game won');
            if (!this.startStatic) {
              this.startStatic = true
              setTimeout(() => {
                this.staticOn = true

              }, 300)
            }

            if (!this.staticOn) return

            (this.gameWon) ? mainCanvas.imageFx.static(-0.02) : mainCanvas.imageFx.static(0.04)

            if ( !this.gameWon) {
              setTimeout(() => {
                this.gameWon = true

              }, 300)
            }

          }
        },
      }
    },

   /* stackTests: () => {
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

    platformTests: () => {
      const groundY = 550
      const startY = groundY

      return {
        groundY,
        entities: [
          new Bird({ x: 730, y: groundY - 20, heavy: true, width: 20, height: 20, preSpawned: true }),
        ],

        groups: {
          platforms: [
            //new Platform({ x: 650, y: groundY - 60 }),
            new Platform({ x: 170, y: startY - 200, width: 20, height: 20, upgrade: 'booster' }),
            new Platform({ x: 150, y: groundY - 160 }),
            new Platform({ x: 250, y: groundY - 140 }),
            new Platform({ x: 350, y: groundY - 120 }),
            new Platform({ x: 470, y: groundY - 100 }),
            new Platform({ x: 550, y: groundY - 60 }),
            new Platform({ x: 650, y: groundY - 60 }),
          ],
        },

        spawn(entity) {
          this.entities.push(entity)
        },

        update() {

        },
      }
    },*/

  }

  return levels
}
