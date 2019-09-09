import ImageFx from '../ImageFx'

class Platform {
  constructor({ x = 0, y = 0, width = 60, height = 20 }) {
    this.imageFx = new ImageFx()

    this.offCanvas = this.imageFx.initOffCanvas({ width: 100, height: 100 })

    this.x = x
    this.y = y
    this.z = 6

    this.width = width
    this.height = height

    this.moving = true

    this.color = 'green'

    this.entry = this.getUpperRightCorner()
    this.exit = { x: this.x, y: this.y }

    this.type = 'platform'
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

    this.draw()
  }

  draw() {
    this.mainCanvas.drawRect(this)

    this.mainCanvas.drawRect({...this, height: this.height / 3, color: '#222' })
    this.mainCanvas.drawRect({...this, height: this.height / 3, color: '#555', y: this.y + this.height / 3 })
    this.mainCanvas.drawRect({...this, height: this.height / 3, color: '#222', y: this.y + this.height / 3 * 2 })

    this.mainCanvas.drawSelectedRect({ ...this }, 0)
  }
}

export default Platform
