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

  update({ mainCanvas, allFlying, entities }) {
    if (!this.y) return

    this.lines = this.lines || entities.filter(entity => entity.type === 'line')

    if (!this.currentLine) {
      this.lines.some((line, index) => {
        if (line.y === this.y + this.height) {
          this.currentLine = line
          this.currentLineIndex = index

          return true
        }

        return false
      })
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
