import { boxesCollide, collisions } from '../../../../libs/collisions'
import Particles from '../particles'
import ImageFx from '../../ImageFx'

export default {
  enemyAhead() {
    return collisions(this, this.enemies, { x: 10 * this.directionX, y: 0 })
  },

  enemyHere() {
    return collisions(this, this.enemies, { x: -(20 * this.directionX), y: 0 })
  },

  fly() {
    this.x += this.speed.x
    this.y += this.speed.y
  },

  update({ mainCanvas, entities, level, pulser }) {
    if (this.dead) return

    this.mainCanvas = mainCanvas
    this.level = level

    this.pulser = pulser

    this.imageFx = this.imageFx || new ImageFx(this.mainCanvas.canvas, this.mainCanvas.context)

    if (!this.fightParticles) this.fightParticles = new Particles({ target: this })

    if (!this.eventsAttached) this.attachEvents(mainCanvas)

    const good = entities.filter(entity => entity.type === 'bird' && entity !== this && !entity.bad && entity.hp > 0)
    const bad = entities.filter(entity => entity.type === 'bird' && entity !== this && entity.bad && entity.hp > 0)

    this.allies = (this.bad) ? bad : good
    this.enemies = (this.bad) ? good : bad

    const stopGo = this.menu.getField('stop-go')

    if (stopGo.value === 'go') {
      this.speed.x = ((this.menu.getField('slow-fast').value === 'fast') ? 2 : 1) * this.directionX
      this.flying = true
    } else {
      this.speed.x = 0
      this.flying = false
    }

    this.updateOnOffBack(stopGo)

    let nextEnemies = this.enemyAhead()
    let nextEnemy = nextEnemies[0] ? nextEnemies[0].box2 : null

    if (nextEnemy) {
      this.speed.x = 0
      //nextEnemy.speed.x = 0
    }

    if (!nextEnemy) {
      nextEnemies = this.enemyHere()
      nextEnemy = nextEnemies[0] ? nextEnemies[0].box2 : null

      //console.log('!nextEnemy', nextEnemy);
    }

    //nextEnemies = this.enemyHere()
    //nextEnemy = nextEnemies[0] ? nextEnemies[0].box2 : null

    if (nextEnemy) {
      this.speed.x = 0
    // nextEnemy.speed.x = 0
    }

    this.updatePlatforms()

    this.fly()

    if (this.hp > 0) this.draw(mainCanvas)

    if (this.jumpParticlesOn) this.drawJumpParticles()

    if (nextEnemy && nextEnemy.hp > 0 && this.hp > 0) {
      this.mainCanvas.lateRenders.push(() => this.fightParticles.draw())
      this.hp -= 1

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
    const y3 = 480 - this.pulser.eyeOffset

    if (this.menu && this.menu.isMenuOpen) this.mainCanvas.lateRenders.push(() => this.mainCanvas.drawTriangleFromPoints([{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }], 1))

    if (this.menu && this.menu.isMenuOpen) this.mainCanvas.lateRenders.push(() => this.menu.drawMenu())

    this.spawnScan()

    if (this.menu && this.menu.debugRectFn) {
      // this.mainCanvas.context.setTransform(1, 0, 0, 1, 0, 0)
      this.menu.debugRectFn()
      //this.mainCanvas.lateRenders.push(() => this.menu.debugRectFn())
    }
  },
}
