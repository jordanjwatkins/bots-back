export default {
  drawJumpParticles(offset = { x: 0, y: 0 }, jumpParticles) {
    let particles = jumpParticles || this.jumpParticles

    if (!particles && !jumpParticles) {
      this.jumpParticles = this.makeJumpParticles(offset)
      this.activeCount = 1

      particles = this.jumpParticles
    }

    if (!jumpParticles) {
      this.activeCount += 1

      if (this.activeCount > 100) return
    }


    this.mainCanvas.context.save()

    //console.log('draw jump', this.activeCount);


    particles.forEach((particle) => {
      particle.x += particle.vX
      particle.y += particle.vY

      particle.vY += 0.1

      this.drawSpark(particle, 2, '#8A6F30')
    })

    this.mainCanvas.context.restore()
  },

  drawJumpParticles2(offset = { x: 0, y: 0 }) {
    if (!this.jumpParticles2) {
      this.jumpParticles2 = this.makeJumpParticles(offset)
      this.activeCount2 = 1
    }

    this.activeCount2 += 1

    if (this.activeCount2 > 100) return

    this.drawJumpParticles(offset, this.jumpParticles2)
  },

  makeJumpParticles(offset) {
    return Array(50).fill(0).map(() => ({
      x: (this.x + this.width / 2) + 1 * Math.random() * this.randomDirection() + offset.x,
      y: this.y + this.height + offset.y,
      vX: (1 * Math.random()) * this.randomDirection(),
      vY: -0.9 - Math.random(),
    }))
  },

  randomDirection() {
    return (0.5 - Math.random() > 0) ? 1 : -1
  },

  drawSpark(spark, sparkSize = 4, color) {
    color = this.sparkColor || color

    this.mainCanvas.drawRect({
      x: spark.x,
      y: spark.y,
      width: sparkSize,
      height: sparkSize,
      color,
    })
  },
}
