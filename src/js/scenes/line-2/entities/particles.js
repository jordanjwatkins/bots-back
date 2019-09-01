import ImageFx from '../ImageFx'

class Particles {
  constructor(options) {
    const defaults = {

    }

    this.lastTime = Date.now()

    this.instantCount = 0

    Object.assign(this, defaults, options)

    this.particleSize = 20

  }

  makeCanvasKey() {
    const now = Date.now()

    if (now === this.lastTime) {
      this.instantCount += 1
    } else {
      this.instantCount = 0
    }

    const key = `${now}-${this.instantCount}`

    this.lastTime = now

    return key
  }

  makeFightParticle() {
    const { particleSize, target } = this
    const { randomDirection, directionX, x, y, width, height } = target

    return {
      x: (x + width / 2 - particleSize / 2) + ((width / 2) * Math.random() * randomDirection()) + 20 * directionX,
      y: (y + height / 2 - particleSize / 2) + ((height / 2 * Math.random()) * randomDirection()),
      vX: 0.1 * Math.random() * randomDirection(),
      vY: 0.1 * Math.random() * randomDirection(),
      color: (Math.random() > 0.5) ? '#ddd' : '#999',
    }
  }

  drawFightParticles() {
    const { target, particleSize, fightCount, fightParticles } = this
    const { width, mainCanvas, x, y, height } = target

    this.fightCount = fightCount || 0

    if (fightCount > 10) this.fightCount = 0

    if (!fightParticles) {
      this.fightParticles = Array(width * 2).fill(0).map(() => this.makeFightParticle())
    } else if (fightCount === 1) {
      fightParticles.push(this.makeFightParticle())
    }

    mainCanvas.context.save()

    this.fightParticles.forEach((particle) => {
      particle.x += particle.vX
      particle.y += particle.vY

      mainCanvas.context.globalAlpha = 0.3 - 0.1 * Math.random()

      const dy = Math.abs(x - particle.x)
      const dx = Math.abs(y - particle.y)

      if (dx > width / 2 || dy > height / 2) mainCanvas.context.globalAlpha = 0.1
      if (dx > width / 1.1 || dy > height / 1.1) return

      this.drawSpark(particle, particleSize, particle.color)

      mainCanvas.context.globalAlpha = 1
    })

    mainCanvas.context.restore()

    this.fightCount += 1
  }

  randomDirection() {
    return (0.5 - Math.random() > 0) ? 1 : -1
  }

  drawSpark(spark, sparkSize = 4, color) {
    this.target.mainCanvas.drawRect({
      x: spark.x,
      y: spark.y,
      width: sparkSize,
      height: sparkSize,
      color,
    })
  }
}

export default Particles
