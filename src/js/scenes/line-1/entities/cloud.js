class Cloud {
  constructor({ x = 0, y = 100, width = 100, height = 30, speedX = 0.5, speedY = 0 } = {}) {
    this.x = x
    this.y = y
    this.z = 1

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

  update(scene, delta) {
    const { mainCanvas } = scene

    if (this.x > mainCanvas.width) {
      this.x = -(this.width * 2) - (this.width * Math.random())
    }

    if (this.moving) {
      this.x += this.speed.x / 16 * delta
      this.y += this.speed.y / 16 * delta
    }

    mainCanvas.drawRect(this)

    mainCanvas.drawRect({
      x: this.x + this.width / 2 - this.width / 3.4,
      y: this.y - (this.height - (this.height / 3)),
      height: this.height - (this.height / 3),
      width: this.width * 0.7,
      color: this.color,
    })
  }
}

export default Cloud
