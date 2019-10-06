export default {
  drawToCanvas() {
    this.offCanvas = this.offCanvas || this.imageFx.initOffCanvas({ width: this.width + 10, height: this.height + 4 })

    this.offCanvas.clear()

    this.offCanvas.drawRect({
      x: 2 + ((this.bad) ? 3 : 0),
      y: -2,
      width: this.width - 8,
      height: this.height,
      color: this.color,
    })

    //const yellow = '#FBF236'

    // feet
    /*this.offCanvas.drawRect({
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
    })*/

    const speed = (this.flying) ? 0.4 : 0


    this.imageFx.drawSelectedRect({
      x: 4,
      y: 24,
      width: 24,
      height: 4,
    }, 0, 4, ((this.bad) ? 'red' : 'yellow'), this.bad ? -speed : speed, [5, 3], this.offCanvas.context)
    this.offCanvas.context.filter = 'none'

    if (this.sleeping) return

    // eyes
  /*  if (this.heavy) {
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
    }*/

    let eyeColor = (this.bad) ? 'red' : 'yellow'

    if (this.reverseScan) eyeColor = '#FFF'

    //this.offCanvas.context.filter = 'none'

    this.offCanvas.drawRect({
      x: 0 + 2 + ((this.bad) ? 8 : 0),
      y: 0 + 5,
      width: ((this.bad) ? 15 : 15),
      height: 3,
      color: eyeColor,
    })

    /*this.offCanvas.drawRect({
      x: 0 + this.width - 5 + ((this.bad) ? -5 : 0),
      y: 0 + 5,
      width:  ((this.bad) ? 5 : 3),
      height: 3,
      color: eyeColor,
    })*/


    // beak
    /*this.offCanvas.drawRect({
      x: 0 + 9,
      y: 0 + 8,
      width: 3,
      height: 4,
      color: yellow,
    })*/


    //this.drew = false

  },

  draw(mainCanvas) {
    if (!this.drew) {
      this.drawToCanvas()
      this.drew = true
    }

    if (this.flying) this.drew = false

    if (this.reverseScan) {
      this.spawnScanOffset -= 0.4
      this.drew = false
      this.selected = false
      this.isFrozen = true
      this.menu.isMenuOpen = false
      this.flying = false
    }

    // If the draw height (spawnScanOffset) is larger than the source canvas, nothing renders in iOS
    mainCanvas.context.drawImage(
      this.offCanvas.canvas,
      0, 0,
      this.offCanvas.canvas.width, this.spawnScanOffset,
      this.x, this.y,
      this.offCanvas.canvas.width, this.spawnScanOffset,
    )

    // wings
    /*if (this.flying && Math.sin(Date.now() / 26) > 0) {
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
    }*/
    /*if (this.flying) {
      mainCanvas.drawSelectedRect({
        x: this.x, //+ Math.sin(Date.now() / 126) * 20,
        y: this.y + 22,
        width: 18,
        height: 3,
        color: 'yellow',
      }, 0, 3, 'yellow', 0.4)

      this.drew = false
    } else {
      mainCanvas.drawSelectedRect({
        x: this.x, //+ Math.sin(Date.now() / 126) * 20,
        y: this.y + 22,
        width: 18,
        height: 3,
        color: 'yellow',
      }, 0, 3, 'yellow', 0)
    }*/

  },
}
