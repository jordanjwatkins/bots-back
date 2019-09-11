import ImageFx from '../ImageFx'

let offCanvas
let offCanvas2
let lateRenders = []

class Platform {
  static clear() {
    offCanvas = null
    offCanvas2 = null
    lateRenders = []
  }

  constructor({ x = 0, y = 0, width = 60, height = 20, upgrade }) {


    //this.offCanvas = offCanvas

    this.x = x
    this.y = y
    this.z = 6

    this.width = width
    this.height = height

    this.moving = true

    this.color = 'green'

    this.entry = this.getUpperRightCorner()
    this.exit = { x: this.x, y: this.y }

    this.type = (upgrade) ? 'u' : 'p'

    this.rgba = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 255)`
    this.rgba2 = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 255)`

    this.drawn = false
    this.upgrade = upgrade
  }

  getUpperRightCorner() {
    return {
      x: this.x + this.width,
      y: this.y,
    }
  }

  update(scene) {
    this.scene = scene

    this.mainCanvas = scene.mainCanvas

    if (!this.imageFx) this.imageFx = new ImageFx(this.mainCanvas.canvas, this.mainCanvas.context)

    offCanvas = offCanvas || this.imageFx.initOffCanvas({})
    offCanvas2 = offCanvas2 || this.imageFx.initOffCanvas({})

    this.draw()
  }

  /*draw2() {
    this.mainCanvas.drawRect(this)

    this.mainCanvas.drawRect({...this, height: this.height / 3, color: '#222' })
    this.mainCanvas.drawRect({...this, height: this.height / 3, color: '#555', y: this.y + this.height / 3 })
    this.mainCanvas.drawRect({...this, height: this.height / 3, color: '#222', y: this.y + this.height / 3 * 2 })

    this.mainCanvas.drawRect({...this, height: 2, color: '#000', x: this.x - 1000, width: 1000, y: this.y + 3 * this.height / 12 })

    this.mainCanvas.drawRect({...this, height: 1000, color: '#000', y: this.y - 1000, width: 2, x: this.x + this.width / 1.2 })
    this.mainCanvas.drawRect({...this, height: 1000, color: '#000', y: this.y - 1000, width: 2, x: this.x + this.width / 1.7 })

    this.mainCanvas.drawRect({...this, height: 1000, color: '#000', y: this.y + this.height, width: 2, x: this.x + this.width / 1.4 })

    this.mainCanvas.context.filter = 'blur(1px)'
    this.mainCanvas.drawRect({ ...this, color: this.rgba2, x: this.x - 3, y: this.y - 2, width: this.width + 6, height: this.height + 5 })
    this.mainCanvas.drawSelectedRect({ ...this }, -27, 17, this.rgba, 0.1)
    this.mainCanvas.context.filter = 'none'
  }*/

  drawUpgrade() {
    offCanvas2.strokeRect({ ...this, color: '#39ff14', width: 20, x: this.x + 5, y: this.y + 5, height: 20 })
    offCanvas2.context.lineWidth = 3
    offCanvas2.strokeRect({ ...this, color: '#39ff14'})
    offCanvas2.context.filter = 'blur(5px)'
    offCanvas2.strokeRect({ ...this, color: '#39ff14'})
  }

  draw() {
    if (!this.drawn || this.drawn === 1) {
      this.drawn = true

      if (this.upgrade) return this.drawUpgrade()

      //this.drawn = (this.drawn === 1) ? true : 1
      //this.offCanvas = offCanvas
      //this.offCanvas = this.imageFx.initOffCanvas({ width: 500, height: 500 })

      //if (!this.offCanvas.drawSelectedRect) this.offCanvas.drawSelectedRect = this.imageFx.drawSelectedRect

      offCanvas.drawRect(this)

      offCanvas.drawRect({ ...this, height: this.height / 3, color: '#222' })
      offCanvas.drawRect({ ...this, height: this.height / 3, color: '#555', y: this.y + this.height / 3 })
      offCanvas.drawRect({ ...this, height: this.height / 3, color: '#222', y: this.y + this.height / 3 * 2 })

      if (this.height >= 30) offCanvas.drawRect({ ...this, height: 2, color: this.rgba, y: this.y + this.height / 15 })

      offCanvas.drawRect({ ...this, height: 2, color: '#000', x: this.x - 1000, width: 1000, y: this.y + 3 * this.height / 12 })

      offCanvas.drawRect({ ...this, height: 1000, color: '#000', y: this.y - 1000, width: 2, x: this.x + this.width / 1.3 * Math.random() })
      offCanvas.drawRect({ ...this, height: 1000, color: '#000', y: this.y - 1000, width: 2, x: this.x + this.width / 1.7 * Math.random() })

      offCanvas.drawRect({ ...this, height: 1000, color: '#000', y: this.y + this.height, width: 2, x: this.x + this.width / 1.4 * Math.random() })

      //this.offCanvas.context.filter = 'blur(1px)'
      //this.offCanvas.drawRect({ ...this, color: this.rgba2, x: this.x - 3, y: this.y - 2, width: this.width + 6, height: this.height + 5 })

      //this.offCanvas.context.filter = 'none'
      if (this.height < 30) lateRenders.push(() => this.imageFx.drawSelectedRect({ ...this }, -26, 14, '#555', 0))
      if (this.height < 30) lateRenders.push(() => this.mainCanvas.drawRect({ ...this, height: 5, color: this.rgba, y: this.y + this.height / 2 }))

      offCanvas.strokeRect({ x: -100, y: 99, width: 1100, height: 122 })

      lateRenders.push(() => this.imageFx.drawSelectedRect({ x: -100, y: 100, width: 1100, height: 120 }, 0, 3, 'yellow', 17, [15, 1003]))
      lateRenders.push(() => this.imageFx.drawSelectedRect({ x: -100, y: 100, width: 1100, height: 120 }, 0, 3, '#FFF', 15, [5, 1003]))

      offCanvas.strokeRect({ x: -100, y: 209, width: 1100, height: 222 })

      lateRenders.push(() => this.imageFx.drawSelectedRect({ x: -100, y: 210, width: 1100, height: 220 }, 0, 3, 'yellow', 13, [15, 1003]))
      lateRenders.push(() => this.imageFx.drawSelectedRect({ x: -100, y: 210, width: 1100, height: 220 }, 0, 3, '#FFF', 16, [15, 1003]))
    }

    if (!this.upgrade && this.type === 'u') offCanvas2.clear()
  }

  drawAll() {
    this.mainCanvas.context.drawImage(offCanvas.canvas, 0, 0)

    //lateRenders.forEach((fn) => fn())
  }

  drawLate() {
    if (offCanvas2) this.mainCanvas.context.drawImage(offCanvas2.canvas, 0, 0)
    //this.mainCanvas.context.drawImage(offCanvas.canvas, 0, 0)
    lateRenders.forEach(fn => fn())

  }
}

export default Platform
