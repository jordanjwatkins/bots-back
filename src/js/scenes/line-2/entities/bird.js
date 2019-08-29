import * as sounds from '../sounds'

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
    }

    Object.assign(this, defaults, props)

    this.initialY = this.y
  }

  attachEvents(mainCanvas) {
    this.eventsAttached = true

    const { canvas } = mainCanvas

    canvas.addEventListener('click', this.onClick)
  }

  detachEvents(mainCanvas) {
    const { canvas } = mainCanvas

    this.eventsAttached = false

    canvas.removeEventListener('click', this.onClick)
  }

  onClick = (event) => {
    if (this.isBirdClick(event, this.mainCanvas)) {
      this.absorbed += 1
      this.selected = !this.selected
    } else {
      this.selected = false
    }

    if (this.selected) {
      this.mainCanvas.selected = this

      this.speed.x = -1
      this.flying = true

      if (!this.backOccupied && this.allies[0].x < this.x) {
        console.log('moving to back');

        this.movingToBack = true
      }

      if (this.onBack) {
        console.log('moving to ground')

        this.movingToBack = false
        this.onBack = false
        this.movingToGround = true

        this.target = { x: this.x - 40, y: this.level.groundY, width: 1, height: 1 }
      }

      if (this.z === 3) this.z = 4
    } else {
      this.speed.x = 0
      this.flying = false
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

  pulseHit(mute = false) {
    if (this.heavy && this.absorbed < 3) {
      this.absorbed += 1

      return
    }

    if (!mute) sounds.hop()

    this.flying = true
    this.speed.y = -this.maxSpeed.y

    if (this.verticalSwapper) {
      this.swapLines()

      return
    }

    // return to starting place after short hover
    setTimeout(() => {
      this.speed.y = this.maxSpeed.y
      this.direction = 0
    }, 400)
  }

  swapLines() {
    if (this.isOnLowestLine()) {
      this.direction = -1
    } else if (this.isOnHighestLine()) {
      this.direction = 1
    } else {
      this.direction = this.direction || 1
    }

    this.moveToNextLine()
  }

  moveToNextLine() {
    this.speed.y = this.direction * this.maxSpeed.y
    this.currentLineIndex -= this.direction
    this.currentLine = this.lines[this.currentLineIndex]
  }

  isOnLowestLine() {
    const [lowestLine] = this.lines

    return (this.y + this.height + 1 >= lowestLine.y)
  }

  isOnHighestLine() {
    const highestLine = this.lines[this.lines.length - 1]

    return (this.y + this.height - 10 <= highestLine.y)
  }

  update({ mainCanvas, allFlying, entities, level }) {
    this.mainCanvas = mainCanvas
    this.level = level

    if (!this.eventsAttached) this.attachEvents(mainCanvas)

    if (!this.y) return

    this.allies = entities.filter(entity => entity.type === 'bird' && entity !== this)

    if (this.movingToBack) {
      const target = this.allies[0]

      let dx = (target.x + target.width / 2 - this.x - (this.width / 2)) / 100
      let dy = (target.y - (this.y + this.height)) / 100

      dx = Math.floor(dx)
      dy = Math.floor(dy)

      if (dx === 0 && dy === 0) {
        this.movingToBack = false
        this.flying = false

        this.onBack = true
        this.host = target
        target.backOccupied = true
      }

      this.speed.x = dx
      this.speed.y = dy

      this.z = 5
    }

    if (this.onBack) {
      this.speed.x = this.host.speed.x

      this.x += this.speed.x
      this.y += this.speed.y
    }

    if (this.movingToGround) {
      this.flying = true


      let dx = (this.target.x - this.x - (this.width / 2)) / 100
      let dy = (this.target.y - (this.y + this.height))

      dx = Math.floor(dx)

      if (dx === 0 && dy === 0) {
        this.movingToGround = false
        this.flying = false
        this.speed.x = 0
        this.speed.y = 0
      }

      if (this.flying) {
        this.speed.x = dx
        this.speed.y = Math.ceil(dy / 100)
      }

    }

    if (allFlying) {
      this.speed.y = -this.maxSpeed.y
      this.direction = 2
    }

    if (this.flying) {
      this.fly()
    }

    this.draw(mainCanvas)
  }

  fly() {
    this.x += this.speed.x
    this.y += this.speed.y

    if (this.heavy && this.absorbed < 2) return

    if (!this.currentLine) return

    if (this.y + this.height > this.currentLine.y && this.direction === 0) {
      this.y = this.currentLine.y - this.height
      this.speed.y = 0
      this.flying = false
      this.absorbed = 0
    }

    if (this.y + this.height < this.currentLine.y && this.direction === -1) {
      this.y = this.currentLine.y - this.height
      this.speed.y = 0
      this.flying = false

      if (!this.verticalSwapper) this.direction = 0
    }

    if (this.y + this.height > this.currentLine.y && this.direction === 1) {
      this.y = this.currentLine.y - this.height
      this.speed.y = 0
      this.flying = false

      if (!this.verticalSwapper) this.direction = 0
    }
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

    mainCanvas.drawRect({
      x: this.x + 2,
      y: this.y + 5,
      width: 3,
      height: 3,
      color: 'black',
    })

    mainCanvas.drawRect({
      x: this.x + this.width - 5,
      y: this.y + 5,
      width: 3,
      height: 3,
      color: 'black',
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
