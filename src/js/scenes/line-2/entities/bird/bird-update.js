import { boxesCollide, collisions } from '../../../../libs/collisions'
import Particles from '../particles'
import ImageFx from '../../ImageFx'

export default {
  enemyFarAhead() {
    return collisions(this, this.enemies, { x: 100 * this.directionX, y: 0, height: 200 })
  },

  enemyAhead() {
    return collisions(this, this.enemies, { x: 10 * this.directionX, y: 0, height: 20 })
  },

  enemyBelow() {
    return collisions(this, this.enemies, { x: 10 * this.directionX, y: 20, width: 20 })
  },

  allyAhead() {
    return collisions(this, this.allies, { x: 10 * this.directionX, y: 0 })
  },

  allyBelow() {
    return collisions(this, this.allies, { x: 10 * this.directionX, y: 20, width: 20 })
  },

  enemyHere() {
    return collisions(this, this.enemies, { x: -(20 * this.directionX), y: 0 })
  },

  fly() {
    this.x += this.speed.x
    this.y += this.speed.y
  },

  update(scene) {
    const { mainCanvas, entities, level, pulser } = scene



    if (this.dead) {
      if (this.hp > -40) {
        if (!this.splat) {
          this.jumpParticlesOn = true
          this.jumpParticles = null
          this.splat = true
        }

        this.mainCanvas.lateRenders.push(() => this.fightParticles.draw())
        this.mainCanvas.lateRenders.push(() => this.drawJumpParticles())
      }

      this.hp -= 1

      return
    }

    if (this.isFrozen) {
      this.speed.x = 0
      //this.updatePlatforms()
      this.fly()
      //this.draw(mainCanvas)

      //return

      if (this.y > 700) this.dead = true
    }

    this.mainCanvas = mainCanvas
    this.level = level

    this.pulser = pulser

    this.imageFx = this.imageFx || new ImageFx(this.mainCanvas.canvas, this.mainCanvas.context)

    if (!this.fightParticles) this.fightParticles = new Particles({ target: this })
    if (!this.thrustParticles) this.thrustParticles = new Particles({ target: this })

    if (!this.eventsAttached) this.attachEvents(mainCanvas)

    const good = entities.filter(entity => entity.type === 'bird' && entity !== this && !entity.bad && entity.hp > 0)
    const bad = entities.filter(entity => entity.type === 'bird' && entity !== this && entity.bad && entity.hp > 0)

    this.allies = (this.bad) ? bad : good
    this.enemies = (this.bad) ? good : bad

    const stopGo = this.menu.getField('stop-go')

    // jump down from spawner
    if ((stopGo.value === 'go') && this.y + this.height === level.startY - 5) {
      this.y += 5

      this.clearingSpawner = true

      console.log('clearing');


      //this.pulser.occupied = false
    }

    if (this.clearingSpawner) {
      if (this.x < 800) {
        console.log('cleared');

        this.pulser.occupied = false
        this.clearingSpawner = false
      }
    }

    if (stopGo.value === 'go') {
      this.speed.x = ((this.menu.getField('slow-fast').value === 'fast') ? 2.5 : 2) * this.directionX
      this.flying = true
    } else {
      this.speed.x = 0
      this.flying = false
    }

    if (!this.bad) this.updateOnOffBack(stopGo)

    let nextEnemies = this.enemyAhead()
    let nextEnemy = nextEnemies[0] ? nextEnemies[0].box2 : null

    if (nextEnemy) {
      this.speed.x = 0
    } else {
      nextEnemies = this.enemyBelow()
      nextEnemy = nextEnemies[0] ? nextEnemies[0].box2 : null
    }

    if (nextEnemy) { //this.bad &&
      //console.log(nextEnemy, this.movingToGround, this.movingOffPlatform);

      if (this.movingToGround || this.movingOffPlatform) {
        this.movingToGround = false

        this.fallDead = nextEnemy
        //if (this.fallDead)

        console.log('instakill')

        //nextEnemy.hp = 0
      }

    }

    //if (!this.movingToGround && !this.movingOffPlatform && this.fallDead && this.fallDead.hp) {
      //this.fallDead.hp = 0
    //  this.fallDead = false

    //  console.log('instakill complete')
    //}

    if (!nextEnemy) {
      nextEnemies = this.enemyHere()
      nextEnemy = nextEnemies[0] ? nextEnemies[0].box2 : null

      //console.log('!nextEnemy', nextEnemy);
    }

    if (this.bad && this.sleeping) {
      let nextEnemies = this.enemyFarAhead()
      let nextEnemy = nextEnemies[0] ? nextEnemies[0].box2 : null

      if (nextEnemy) {
        this.sleeping = false

        this.flying = true
      }
    }

    let nextAllies = this.allyAhead()
    let nextAlly = nextAllies[0] ? nextAllies[0].box2 : null

    if (!nextAlly) {
      nextAllies = this.allyBelow()
      nextAlly = nextAllies[0] ? nextAllies[0].box2 : null
    }

    if (nextAlly) {
      //console.log('ally below');

    }

    // don't go below the ground
    if (this.y + this.height > this.level.groundY && !this.isFrozen) {
      this.y = this.level.groundY - this.height
      this.speed.y = 0
    }

    //nextEnemies = this.enemyHere()
    //nextEnemy = nextEnemies[0] ? nextEnemies[0].box2 : null

    if (nextEnemy || (nextAlly && !this.movingToGround && !this.movingToBack) || (this.bad && this.x > 900)) {
      this.speed.x = 0
    // nextEnemy.speed.x = 0
    }

    if (this.bad && this.x > 900) {
      this.pulser.dead = true
    }

    this.updatePlatforms()

    if (this.speed.y !== 0) this.thrustParticles.drawThrust()

    if (this.isFrozen) {
      this.speedY -= 2
    }

    this.fly()

    if (this.hp > 0) this.draw(mainCanvas)

    if (this.jumpParticlesOn) this.drawJumpParticles()

    if ((this.bad && this.x > 900) || (nextEnemy && nextEnemy.hp > 0 && !this.movingOffPlatform) && this.hp > 0) {
      this.mainCanvas.lateRenders.push(() => this.fightParticles.draw())

      // this.hp -= 1
      if (nextEnemy && nextEnemy.damage) {
        if (nextEnemy.fallDead && nextEnemy.fallDead === this) {
          console.log('instakilled');

          this.hp = 0
        } else {
          this.hp -= nextEnemy.damage
        }
      }

      this.jumpParticlesOn = true

      if (this.hp === 75 || this.hp === 50 || this.hp === 25) this.jumpParticles = null
    }

    if (this.hp <= 0 && this.selected) {
      this.selected = null
      this.menu.closeMenu()
      this.mainCanvas.selected = null

      return
    }

    if (this.hp <= 0) {
      this.dead = true

      if (this.host) {
        this.host.backOccupied = false
      }


      if (this.eventsAttached) this.detachEvents(mainCanvas)
    }

    //this.fightParticles.draw()

    let { x, y } = this.menu.getMenuXy()

    const x1 = x + ((y < 480 - this.pulser.eyeOffset) ? this.menu.menuCanvas.canvas.width : 0)
    const y1 = y

    const x2 = x + this.menu.menuCanvas.canvas.width
    const y2 = y + ((x + this.menu.menuCanvas.canvas.width < 930) ? this.menu.menuCanvas.canvas.height : 0)

    const x3 = 930
    const y3 = this.pulser.y - 18 - this.pulser.eyeOffset

    if (this.menu && this.menu.isMenuOpen && pulser.eyeOffset > 30) this.mainCanvas.lateRenders.push(() => this.mainCanvas.drawTriangleFromPoints([{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }], 1))

    if (this.menu && this.menu.isMenuOpen && pulser.eyeOffset > 30) this.mainCanvas.lateRenders.push(() => this.menu.drawMenu())

    this.spawnScan()

    if (this.menu && this.menu.debugRectFn) {
      // this.mainCanvas.context.setTransform(1, 0, 0, 1, 0, 0)
      this.menu.debugRectFn()
      //this.mainCanvas.lateRenders.push(() => this.menu.debugRectFn())
    }

    if (!this.bad && this.x + this.width < 0) scene.startNextLevel()
  },
}
