export default {
  drawJumpParticles() {
    if (!this.jumpParticles) {
      this.makeJumpParticles()
    }

    this.mainCanvas.context.save()

    this.jumpParticles.forEach((particle) => {
      particle.x += particle.vX
      particle.y += particle.vY

      particle.vY += 0.1

      this.drawSpark(particle, 2, '#8A6F30')
    })

    this.mainCanvas.context.restore()
  },

  makeJumpParticles() {
    this.jumpParticles = Array(50).fill(0).map(() => ({
      x: (this.x + this.width / 2) + 1 * Math.random() * this.randomDirection(),
      y: this.y + this.height,
      vX: (1 * Math.random()) * this.randomDirection(),
      vY: -0.9 - Math.random(),
    }))
  },

  randomDirection() {
    return (0.5 - Math.random() > 0) ? 1 : -1
  },

  drawSpark(spark, sparkSize = 4, color) {
    this.mainCanvas.drawRect({
      x: spark.x,
      y: spark.y,
      width: sparkSize,
      height: sparkSize,
      color,
    })
  },
}
