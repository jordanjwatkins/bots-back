import { boxesCollide, collisions } from '../../../libs/collisions'
import BirdMenu from './bird-menu'
import Particles from './particles'
import ImageFx from '../ImageFx'

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

    //canvas.addEventListener('click', this.onClick)

    this.menu = new BirdMenu(this)
  }

  detachEvents(mainCanvas) {
    const { canvas } = mainCanvas

    this.eventsAttached = false

    canvas.removeEventListener('click', this.onClick)
  }

  onClick = (event) => {
    if (this.dead) return

    if (this.isBirdClick(event, this.mainCanvas)) {
      this.absorbed += 1

      if (this.absorbed > 3) this.absorbed = 0

      this.selected = !this.selected

      if (this.selected) {
        this.menu.openMenu()

        console.log('selected:', this)
      }
    }

    this.onAnyClick(event)
  }

  onAnyClick(event) {
    const isBirdClick = this.isBirdClick(event, this.mainCanvas)
    const isMenuClick = this.menu.isMenuClick(event)

    if (!isMenuClick && !isBirdClick) {
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

  closeMountableAllies() {
    if (this.movingToBack || this.movingToGround || this.backOccupied) return

    return this.allies.filter((ally) => {
      if (
        !ally.movingToBack &&
        !ally.movingToGround &&
        !ally.backOccupied &&
        !ally.dead &&

        ally.x < this.x &&
        this.x - ally.x < 100
      ) {
        return ally
      }
    })
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

      const filterAllies = this.closeMountableAllies()

      if (
        filterAllies &&
        filterAllies[0]
      ) {
        console.log('moving to back')

        this.host = filterAllies[0]

        this.movingToBack = true

        this.jumpParticlesOn = true
        this.jumpParticles = null
      }
    }

    if (this.movingToBack && this.host.dead) {
      this.movingToBack = false
      this.movingToGround = true
      this.host = null
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
          this.y = this.host.y - this.height
          this.x = this.host.x + this.host.width / 2 - this.width / 2
        }
      }
    } else if (!this.movingToBack && !this.movingToGround && this.y + this.height < this.level.groundY) {
      this.y = this.level.groundY - this.height
    }

    if (this.movingToBack) {
      let target = this.host

      while (target.backOccupier) {
        target = target.backOccupier
      }

      stopGo.disabled = true

      let dx = (target.x + target.width / 2 - this.x - (this.width / 2)) / 10
      let dy = (target.y - (this.y + this.height)) / 10

      dx = Math.floor(dx)
      dy = Math.floor(dy)

      //if (dx === 0 && dy === 0) {
      if (Math.abs(dx * 10) < 15 && Math.abs(dy * 10) < 15) {
        console.log('back land')

        this.movingToBack = false
        this.flying = false

        this.onBack = true
        this.host = target
        target.backOccupied = true
        target.backOccupier = this

        stopGo.disabled = false
        stopGo.value = 'stop'

        dx = 0
        dy = 0
        this.x = target.x + target.width / 2 - this.width / 2
        this.y = target.y - this.height
      } else {
        dx += this.directionX
        dy -= 1
      }

      this.speed.x = dx
      this.speed.y = dy

      this.z = 5
    }

    if (this.movingToGround) {
      this.flying = true

      if (!this.target) {
        this.target = { x: this.x, y: this.level.groundY }
      }

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

        if (this.host) this.host.backOccupied = false
      }

      if (this.flying) {
        this.speed.x = dx
        this.speed.y = Math.ceil(dy / 30)
      }
    }
  }

  enemyAhead() {
    return collisions(this, this.enemies, { x: 10 * this.directionX, y: 0 })
  }

  enemyHere() {
    return collisions(this, this.enemies, { x: -(20 * this.directionX), y: 0 })
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

  update({ mainCanvas, entities, level, pulser }) {
    if (this.dead) return

    this.mainCanvas = mainCanvas
    this.level = level

    this.pulser = pulser

    this.imageFx = this.imageFx || new ImageFx(this.mainCanvas.canvas, this.mainCanvas.context)

    if (!this.fightParticles) this.fightParticles = new Particles({ target: this })

    if (!this.eventsAttached) this.attachEvents(mainCanvas)

    if (!this.y) return

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

    //x = 100
    //y = 100

    //console.log(x, y);


    /*const x1 = x
    const y1 = y + this.menu.menuCanvas.canvas.height

    const x2 = x + this.menu.menuCanvas.canvas.width / 2
    const y2 = y + this.menu.menuCanvas.canvas.height + 280

    const x3 = x + this.menu.menuCanvas.canvas.width
    const y3 = y1*/

    //console.log('points:', x1, y1, x2, y2, x3, y3);
    // 100 300 150 400 200 300

    const x1 = x + ((y < 480 - this.pulser.eyeOffset) ? this.menu.menuCanvas.canvas.width : 0)
    const y1 = y

    const x2 = x + this.menu.menuCanvas.canvas.width
    const y2 = y + ((x + this.menu.menuCanvas.canvas.width < 930) ? this.menu.menuCanvas.canvas.height : 0)

    const x3 = 930
    const y3 = 480 - this.pulser.eyeOffset

    //this.mainCanvas.drawTriangleFromPoints([{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }], 1)

    if (this.menu && this.menu.isMenuOpen) this.mainCanvas.lateRenders.push(() => this.mainCanvas.drawTriangleFromPoints([{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }], 1))

    if (this.menu && this.menu.isMenuOpen) this.mainCanvas.lateRenders.push(() => this.menu.drawMenu())

    this.spawnScan()

    if (this.menu && this.menu.debugRectFn) {
      // this.mainCanvas.context.setTransform(1, 0, 0, 1, 0, 0)
      this.menu.debugRectFn()
      //this.mainCanvas.lateRenders.push(() => this.menu.debugRectFn())
    }
  }

  spawnScan() {
    if (this.bad) this.offset = this.height + 5

    if (this.offset > this.height + 4) return

    this.offset = this.offset || 1
    this.frameCount = this.frameCount || 1

    if (this.frameCount < 2) {
      this.frameCount += 1
    } else {
      this.frameCount = 1
      this.offset += 1
    }

    const x1 = this.x
    const y1 = this.y + this.offset

    const x2 = this.x + this.width
    const y2 = this.y + this.offset

    const x3 = 930
    const y3 = 480 - this.pulser.eyeOffset

    //this.mainCanvas.drawTriangleFromPoints([{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }], 1)

    this.mainCanvas.lateRenders.push(() => this.mainCanvas.drawTriangleFromPoints([{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }], 1))
  }

  fly() {
    this.x += this.speed.x
    this.y += this.speed.y
  }

  drawToCanvas() {
    this.offCanvas = this.offCanvas || this.imageFx.initOffCanvas({width: this.width, height: this.height + 4 })

    this.offCanvas.drawRect({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      color: this.color,
    })

    if (this.absorber) {
      this.offCanvas.drawRect({
        x: 0,
        y: 0 + this.height - 4,
        width: this.width,
        height: 4,
        color: 'grey',
      })
    }

    if (this.verticalSwapper) {
      this.offCanvas.drawRect({
        x: 0 + 8,
        y: 0 - 8,
        width: 5,
        height: 8,
        color: this.color,
      })
    }

    const yellow = '#FBF236'

    // feet
    this.offCanvas.drawRect({
      x: 0 + 2,
      y: 0 + this.height,
      width: 3,
      height: 3,
      color: yellow,
    })

    this.offCanvas.drawRect({
      x: 0 + this.width - 5,
      y: 0 + this.height,
      width: 3,
      height: 3,
      color: yellow,
    })

    // wings
    if (this.flying && Math.sin(Date.now() / 26) > 0) {
      this.offCanvas.drawRect({
        x: 0 - 8,
        y: 0 + 5,
        width: 8,
        height: 3,
        color: this.color,
      })

      this.offCanvas.drawRect({
        x: 0 + this.width,
        y: 0 + 5,
        width: 9,
        height: 3,
        color: this.color,
      })
    }

    // eyes
    if (this.heavy) {
      if (this.absorbed === 1) {
        this.offCanvas.drawRect({
          x: 0,
          y: 0 + 3,
          width: 7,
          height: 7,
          color: 'white',
        })

        this.offCanvas.drawRect({
          x: 0 + this.width - 7,
          y: 0 + 3,
          width: 7,
          height: 7,
          color: 'white',
        })
      }

      if (this.absorbed === 2) {
        this.offCanvas.drawRect({
          x: 0,
          y: 0 + 3,
          width: 7,
          height: 7,
          color: 'white',
        })

        this.offCanvas.drawRect({
          x: 0 + this.width - 9,
          y: 0 + 1,
          width: 11,
          height: 11,
          color: 'white',
        })
      }

      if (this.absorbed === 3) {
        this.offCanvas.drawRect({
          x: 0,
          y: 0 + 3,
          width: 7,
          height: 7,
          color: 'white',
        })

        this.offCanvas.drawRect({
          x: 0 + this.width - 10,
          y: 0,
          width: 13,
          height: 13,
          color: 'white',
        })
      }
    }

    const eyeColor = (this.bad) ? 'white' : 'black'

    this.offCanvas.drawRect({
      x: 0 + 2,
      y: 0 + 5,
      width: 3,
      height: 3,
      color: eyeColor,
    })

    this.offCanvas.drawRect({
      x: 0 + this.width - 5,
      y: 0 + 5,
      width: 3,
      height: 3,
      color: eyeColor,
    })

    // beak
    this.offCanvas.drawRect({
      x: 0 + 9,
      y: 0 + 8,
      width: 3,
      height: 4,
      color: yellow,
    })
  }

  draw(mainCanvas) {
    this.drawToCanvas()
    mainCanvas.context.drawImage(this.offCanvas.canvas, 0, 0, this.width, this.offset, this.x, this.y, this.width, this.offset)
    // draw
    //mainCanvas.drawRect(this)

    /*if (this.absorber) {
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
    })*/

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
/*
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
    })*/
  }

  destroy() {
    this.menu.destroy()
    if (this.eventsAttached) this.detachEvents(this.mainCanvas)
  }
}

export default Bird
