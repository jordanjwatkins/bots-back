export default {
  drawToCanvas() {
    this.offCanvas = this.offCanvas || this.imageFx.initOffCanvas({ width: this.width + 10, height: this.height + 4 })

    this.offCanvas.drawRect({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      color: this.color,
    })

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

    if (this.sleeping) return

    // eyes
    if (this.heavy) {
      // Clear right eye overflow
      if (this.absorbed === 0) this.offCanvas.context.clearRect(this.width, 0, this.width + 5, this.offCanvas.canvas.height)

      if (this.absorbed === 1) {
        this.offCanvas.drawRect({
          x: 0,
          y: 0 + 3,
          width: 7,
          height: 7,
          color: '#FFF',
        })

        this.offCanvas.drawRect({
          x: 0 + this.width - 7,
          y: 0 + 3,
          width: 7,
          height: 7,
          color: '#FFF',
        })
      }

      if (this.absorbed === 2) {
        this.offCanvas.drawRect({
          x: 0,
          y: 0 + 3,
          width: 7,
          height: 7,
          color: '#FFF',
        })

        this.offCanvas.drawRect({
          x: 0 + this.width - 9,
          y: 0 + 1,
          width: 11,
          height: 11,
          color: '#FFF',
        })
      }

      if (this.absorbed === 3) {
        this.offCanvas.drawRect({
          x: 0,
          y: 0 + 3,
          width: 7,
          height: 7,
          color: '#FFF',
        })

        this.offCanvas.drawRect({
          x: 0 + this.width - 10,
          y: 0,
          width: 13,
          height: 13,
          color: '#FFF',
        })
      }
    }

    const eyeColor = (this.bad) ? '#FFF' : '#000'

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
    if (!this.drew ) {
      this.drawToCanvas()
      this.drew = true
    }

    mainCanvas.context.drawImage(
      this.offCanvas.canvas,
      0, 0,
      this.offCanvas.canvas.width, this.spawnScanOffset,
      this.x, this.y,
      this.offCanvas.canvas.width, this.spawnScanOffset,
    )

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
  },
}
