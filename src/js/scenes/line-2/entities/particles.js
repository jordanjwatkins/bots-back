import ImageFx from '../ImageFx'

class Particles {
  constructor(options) {
    const defaults = {

    }

    this.lastTime = Date.now()

    this.instantCount = 0

    Object.assign(this, defaults, options)

    this.particleSize = 20

    const { x, y, width, height } = this.target

    this.offCanvas = new ImageFx().initOffCanvas({ width: width * 3, height: height * 3 })
  }

  getTargetCenter() {
    const { x, y, width, height } = this.target

    return {
      x: x + width / 2,
      y: y + height / 2,
    }
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
    const { target, offCanvas } = this
    const { randomDirection } = target
    const { centerX, centerY } = offCanvas

    return {
      x: centerX + (target.width / 2 * Math.random() * randomDirection()),
      y: centerY + (target.height / 2 * Math.random() * randomDirection()),
      vX: 1.1 * Math.random() * randomDirection(),
      vY: 1.1 * Math.random() * randomDirection(),
      color: (Math.random() > 0.5) ? '#ddd' : '#999',
    }
  }

  restartFightParticle(particle) {
    const { target, offCanvas } = this
    const { randomDirection } = target
    const { centerX, centerY } = offCanvas

    particle.x = centerX + (target.width / 2 * Math.random() * randomDirection())
    particle.y = centerY + (target.height / 2 * Math.random() * randomDirection())
    particle.vX = 1.1 * Math.random() * randomDirection()
    particle.vY = 1.1 * Math.random() * randomDirection()
    particle.color = (Math.random() > 0.5) ? '#ddd' : '#999'
  }

  drawFightParticles() {
    const { target, particleSize, fightCount, fightParticles, offCanvas } = this
    const { width, height } = target

    this.fightCount = fightCount || 0

    //if (fightCount > 10) this.fightCount = 0

    if (!fightParticles) {
      this.fightParticles = Array(width * 2).fill(0).map(() => this.makeFightParticle())
      //this.moreFightParticles = Array(width * 2).fill(0).map(() => this.makeFightParticle())
    }/* else if (this.moreFightParticles.length > 0 && fightCount < 100 && fightCount % 10 === 0) {
      const particle = this.moreFightParticles.pop()

      if (particle) fightParticles.push(particle)
    }*/

    //offCanvas.context.save()

    this.fightParticles.forEach((particle) => {
      particle.x += particle.vX
      particle.y += particle.vY

      offCanvas.context.globalAlpha = 0.3 - 0.1 * Math.random()

      const dy = Math.abs(offCanvas.centerX - particle.x)
      const dx = Math.abs(offCanvas.centerY - particle.y)

      if (dx > offCanvas.canvas.width / 3 || dy > offCanvas.canvas.height / 3) offCanvas.context.globalAlpha = 0.1
      if (dx > offCanvas.canvas.width / 3 || dy > offCanvas.canvas.height / 3) {
        this.restartFightParticle(particle)
      }

      this.drawSpark(particle, particleSize, particle.color)

      offCanvas.context.globalAlpha = 1
    })

    //offCanvas.context.restore()

    this.fightCount += 1
  }

  randomDirection() {
    return (0.5 - Math.random() > 0) ? 1 : -1
  }

  drawSpark(spark, sparkSize = 4, color) {
    this.offCanvas.drawRect({
      x: spark.x - sparkSize / 2,
      y: spark.y - sparkSize / 2,
      width: sparkSize,
      height: sparkSize,
      color,
    })
  }

  drawToMain() {
    const { x, y } = this.getTargetCenter()

    this.target.mainCanvas.context.drawImage(
      this.offCanvas.canvas,

      0, 0,
      this.offCanvas.canvas.width,
      this.offCanvas.canvas.height,

      x - this.offCanvas.canvas.width / 2 + (this.target.width / 2) * this.target.directionX,
      y - this.offCanvas.canvas.height / 2,
      this.offCanvas.canvas.width,
      this.offCanvas.canvas.height,
    )
  }

  draw() {
    this.drawCount = this.drawCount || 1
    this.drawCount += 1

    //if (this.drawCount % 10 === 0) {
      this.offCanvas.clear()
      this.drawFightParticles()
      //this.offCanvas.trace()
    //}


    this.drawToMain()
  }
}

export default Particles
