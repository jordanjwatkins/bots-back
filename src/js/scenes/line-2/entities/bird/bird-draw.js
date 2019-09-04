export default {
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
  },

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
  },
}
