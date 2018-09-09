class Pulse {
  constructor({ x = 0, y = 0, width = 10, height = 5, speedX = 4, speedY = 0 }) {
    this.x = x
    this.y = y
    this.z = 3

    this.width = width
    this.height = height

    this.moving = true

    this.color = '#FBF236'

    this.speed = {
      x: speedX,
      y: speedY,
    }
  }

  collisionCheck(entity, scene) {
    if (
      entity.type === 'bird' &&
      entity.flying === false &&
      this.x > entity.x &&
      this.x < entity.x + entity.width &&
      this.y - 10 > entity.y &&
      this.y - 10 < entity.y + entity.height
    ) {
      if (entity.lastPulse === this) return

      entity.pulseHit()

      entity.lastPulse = this

      if (entity.absorber) this.destroy(scene)
    }
  }

  destroy(scene) {
    scene.entities = scene.entities.filter(entity => entity !== this)
  }

  drawSpark(mainCanvas) {
    const sparkSize = 4

    mainCanvas.drawRect({
      x: this.x - this.width - sparkSize + (this.width * 3 + sparkSize) * Math.random(),
      y: this.y - this.height - sparkSize + (this.height * 3 + sparkSize) * Math.random(),
      width: sparkSize,
      height: sparkSize,
      color: this.color,
    })
  }

  update(scene) {
    const { mainCanvas, entities } = scene

    if (this.x > mainCanvas.width) this.destroy(scene)

    if (this.moving) {
      this.x += this.speed.x
      this.y += this.speed.y
    }

    entities.forEach(entity => this.collisionCheck(entity, scene))

    mainCanvas.drawRect(this)

    this.drawSpark(mainCanvas)
    this.drawSpark(mainCanvas)
    this.drawSpark(mainCanvas)
  }
}

export default Pulse
