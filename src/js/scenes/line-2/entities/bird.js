import { boxesCollide, collisions } from '../../../libs/collisions'
import BirdMenu from './bird-menu'
import Particles from './particles'

class Bird {
  constructor(props) {
    const defaults = {
      x: 0,
      y: 0,
      z: 3,
      width: 20,
      height: 20,
      // color: '#3F3F74',
      color: '#AC3232',
      // color: 'blue'
      speed: {
        x: 0,
        y: 0,
      },
      maxSpeed: {
        x: 0,
        y: 4,
      },
      flying: false,
      direction: 0,
      absorber: false,
      absorbed: 0,
      type: 'bird',
      directionX: (props.bad) ? 1 : -1,
      hp: 100,
      maxHp: 100,
      damage: 1,
    }

    Object.assign(this, defaults, props)

    this.initialY = this.y
  }

  attachEvents(mainCanvas) {
    this.eventsAttached = true

    const { canvas } = mainCanvas

    canvas.addEventListener('click', this.onClick)

    this.menu = new BirdMenu(this)
  }

  detachEvents(mainCanvas) {
    const { canvas } = mainCanvas

    this.eventsAttached = false

    canvas.removeEventListener('click', this.onClick)
  }

  onClick = (event) => {
    const isMenuClick = this.menu.isMenuClick(event)

    if (this.isBirdClick(event, this.mainCanvas)) {
      this.absorbed += 1

      if (this.absorbed > 3) this.absorbed = 0

      this.selected = !this.selected

      if (this.selected) {
        this.menu.openMenu()
      }
    } else if (!isMenuClick) {
      this.selected = false

      this.menu.closeMenu()
    }

    if (this.selected) {
      this.mainCanvas.selected = this

      if (this.z === 3) this.z = 4
    } else {
      this.menu.closeMenu()

      if (this.z === 4) this.z = 3
    }
  }

  isBirdClick(event, mainCanvas) {
    const scale = mainCanvas.scaleInDom

    const clickRect = {
      y: this.y * scale,
      x: this.x * scale,
      height: this.height * scale,
      width: this.width * scale,
    }

    return mainCanvas.isClickHit(event, clickRect)
  }

  updateOnOffBack(stopGo) {
    if (stopGo.value === 'go') {
      if (this.onBack) {
        console.log('moving to ground')

        this.movingToBack = false
        this.onBack = false
        this.movingToGround = true
        this.flying = true

        this.target = { x: this.x - 40, y: this.level.groundY, width: 1, height: 1 }
      }

      if (!this.movingToBack && !this.movingToGround && !this.backOccupied && this.allies[0] && this.allies[0].x < this.x && this.x - this.allies[0].x < 100) {
        console.log('moving to back')

        this.movingToBack = true

        this.jumpParticlesOn = true
        this.jumpParticles = null
      }
    }

    if (this.onBack) {
      if (this.host) {
        if (this.host.hp <= 0) {
          this.speed.x = 0
          this.y += this.host.height

          this.host = null
          this.onBack = false
        } else {
          this.speed.x = this.host.speed.x
        }
      }
    }

    if (this.movingToBack) {
      const [target] = this.allies

      stopGo.disabled = true

      let dx = (target.x + target.width / 2 - this.x - (this.width / 2)) / 10
      let dy = (target.y - (this.y + this.height)) / 10

      dx = Math.floor(dx)
      dy = Math.floor(dy)

      if (dx === 0 && dy === 0) {
        console.log('back land')

        this.movingToBack = false
        this.flying = false

        this.onBack = true
        this.host = target
        target.backOccupied = true

        stopGo.disabled = false
        stopGo.value = 'stop'
      }

      this.speed.x = dx
      this.speed.y = dy

      this.z = 5
    }

    if (this.movingToGround) {
      this.flying = true

      let dx = (this.target.x - this.x - (this.width / 2)) / 30
      const dy = (this.target.y - (this.y + this.height))

      dx = Math.floor(dx)

      if (dx === 0 && dy === 0) {
        console.log('ground landed')

        this.movingToGround = false
        this.flying = false
        this.speed.x = 0
        this.speed.y = 0
        stopGo.value = 'stop'

        this.jumpParticles = null

        this.host.backOccupied = false
      }

      if (this.flying) {
        this.speed.x = dx
        this.speed.y = Math.ceil(dy / 30)
      }
    }
  }

  enemyAhead() {
    return collisions(this, this.enemies, { x: 20 * this.directionX, y: 0 })
  }

  drawJumpParticles() {
    if (!this.jumpParticles) {
      this.jumpParticles = Array(50).fill(0).map(() => ({
        x: (this.x + this.width / 2) + 1 * Math.random() * this.randomDirection(),
        y: this.y + this.height,
        vX: (1 * Math.random()) * this.randomDirection(),
        vY: -0.9 - Math.random(),
      }))
    }

    this.mainCanvas.context.save()

    this.jumpParticles.forEach((particle) => {
      particle.x += particle.vX
      particle.y += particle.vY

      particle.vY += 0.1

      this.drawSpark(particle, 2, '#8A6F30')
    })

    this.mainCanvas.context.restore()
  }

  randomDirection() {
    return (0.5 - Math.random() > 0) ? 1 : -1
  }

  drawSpark(spark, sparkSize = 4, color) {
    this.mainCanvas.drawRect({
      x: spark.x,
      y: spark.y,
      width: sparkSize,
      height: sparkSize,
      color,
    })
  }

  update({ mainCanvas, entities, level }) {
    this.mainCanvas = mainCanvas
    this.level = level

    if (!this.fightParticles) this.fightParticles = new Particles({target: this })

    if (!this.eventsAttached) this.attachEvents(mainCanvas)

    if (!this.y) return

    const good = entities.filter(entity => entity.type === 'bird' && entity !== this && !entity.bad)
    const bad = entities.filter(entity => entity.type === 'bird' && entity !== this && entity.bad)

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

    const nextEnemies = this.enemyAhead()
    const nextEnemy = nextEnemies[0] ? nextEnemies[0].box2 : null

    if (nextEnemy && nextEnemy.hp > 0) {
      this.speed.x = 0
    }

    this.fly()

    if (this.hp > 0) this.draw(mainCanvas)

    if (this.jumpParticlesOn) this.drawJumpParticles()

    if (nextEnemy && nextEnemy.hp > 0 && this.hp > 0) {
      this.mainCanvas.lateRenders.push(() => this.fightParticles.draw())
      this.hp -= 1

      this.jumpParticlesOn = true
      if (this.hp === 75 || this.hp === 50 || this.hp === 25) this.jumpParticles = null
    }

    if (this.hp <= 0) {
      this.selected = null
      this.menu.closeMenu()
      this.mainCanvas.selected = null

      return
    }

    //this.fightParticles.draw()

    if (this.menu && this.menu.isMenuOpen) this.menu.drawMenu()

    if (this.menu && this.menu.debugRectFn) {
      // this.mainCanvas.context.setTransform(1, 0, 0, 1, 0, 0)
      this.menu.debugRectFn()
    }
  }

  fly() {
    this.x += this.speed.x
    this.y += this.speed.y
  }

  draw(mainCanvas) {
    // draw
    mainCanvas.drawRect(this)

    if (this.absorber) {
      mainCanvas.drawRect({
        x: this.x,
        y: this.y + this.height - 4,
        width: this.width,
        height: 4,
        color: 'grey',
      })
    }

    if (this.verticalSwapper) {
      mainCanvas.drawRect({
        x: this.x + 8,
        y: this.y - 8,
        width: 5,
        height: 8,
        color: this.color,
      })
    }

    const yellow = '#FBF236'

    // feet
    mainCanvas.drawRect({
      x: this.x + 2,
      y: this.y + this.height,
      width: 3,
      height: 3,
      color: yellow,
    })

    mainCanvas.drawRect({
      x: this.x + this.width - 5,
      y: this.y + this.height,
      width: 3,
      height: 3,
      color: yellow,
    })

    // wings
    if (this.flying && Math.sin(Date.now() / 26) > 0) {
      mainCanvas.drawRect({
        x: this.x - 8,
        y: this.y + 5,
        width: 8,
        height: 3,
        color: this.color,
      })

      mainCanvas.drawRect({
        x: this.x + this.width,
        y: this.y + 5,
        width: 9,
        height: 3,
        color: this.color,
      })
    }

    // eyes
    if (this.heavy) {
      if (this.absorbed === 1) {
        mainCanvas.drawRect({
          x: this.x,
          y: this.y + 3,
          width: 7,
          height: 7,
          color: 'white',
        })

        mainCanvas.drawRect({
          x: this.x + this.width - 7,
          y: this.y + 3,
          width: 7,
          height: 7,
          color: 'white',
        })
      }

      if (this.absorbed === 2) {
        mainCanvas.drawRect({
          x: this.x,
          y: this.y + 3,
          width: 7,
          height: 7,
          color: 'white',
        })

        mainCanvas.drawRect({
          x: this.x + this.width - 9,
          y: this.y + 1,
          width: 11,
          height: 11,
          color: 'white',
        })
      }

      if (this.absorbed === 3) {
        mainCanvas.drawRect({
          x: this.x,
          y: this.y + 3,
          width: 7,
          height: 7,
          color: 'white',
        })

        mainCanvas.drawRect({
          x: this.x + this.width - 10,
          y: this.y,
          width: 13,
          height: 13,
          color: 'white',
        })
      }
    }

    const eyeColor = (this.bad) ? 'white' : 'black'

    mainCanvas.drawRect({
      x: this.x + 2,
      y: this.y + 5,
      width: 3,
      height: 3,
      color: eyeColor,
    })

    mainCanvas.drawRect({
      x: this.x + this.width - 5,
      y: this.y + 5,
      width: 3,
      height: 3,
      color: eyeColor,
    })

    // beak
    mainCanvas.drawRect({
      x: this.x + 9,
      y: this.y + 8,
      width: 3,
      height: 4,
      color: yellow,
    })
  }
}

export default Bird
