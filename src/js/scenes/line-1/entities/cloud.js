class Cloud {
  constructor({ x = 0, y = 100, width = 100, height = 30, speedX = 0.5, speedY = 0 } = {}) {
    this.x = x
    this.y = y
    this.z = 3

    this.width = width
    this.height = height

    this.moving = true

    this.color = 'white'

    this.speed = {
      x: speedX,
      y: speedY,
    }
  }

  destroy(scene) {
    scene.entities = scene.entities.filter(entity => entity !== this)
  }

  update(scene) {
    const { mainCanvas } = scene

    if (this.x > mainCanvas.width) {
      this.x = -250
      this.y = this.y - 40 + Math.round(80 * Math.random())
    }

    if (this.moving) {
      this.x += this.speed.x
      this.y += this.speed.y
    }

    mainCanvas.drawRect(this)

    mainCanvas.drawRect({
      x: this.x + 20,
      y: this.y - 20,
      height: 20,
      width: 70,
      color: this.color,
    })
  }
}

export default Cloud
