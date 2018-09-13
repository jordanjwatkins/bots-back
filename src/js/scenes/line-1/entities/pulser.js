import * as sounds from '../sounds'
import Pulse from './pulse'

class Pulser {
  constructor({ x = 0, y = 0, width = 100, height = 50, speedX = 4, speedY = 0, chargeCount = 3, chargeSpeed = 4 }) {
    this.x = x
    this.y = y
    this.z = 3

    this.width = width
    this.height = height

    this.moving = true

    this.color = '#333'

    this.speed = {
      x: speedX,
      y: speedY,
    }

    this.chargeProgress = 0
    this.chargeSpeed = chargeSpeed
    this.maxChargeCount = 3
    this.chargeCount = chargeCount
    this.pulsesFiredCount = 0
  }

  destroy(scene) {
    scene.entities = scene.entities.filter(entity => entity !== this)
  }

  canPulse() {
    return (this.chargeCount > 0)
  }

  firePulse({ lines, entities, allFlying, titleScreen, exposition }, lineToPulse) {
    if (!this.canPulse() || allFlying || titleScreen || exposition) return

    this.chargeCount -= 1

    this.pulsesFiredCount += 1

    const lineIndex = lines.findIndex(line => line === lineToPulse)

    sounds.pulse(lineIndex)

    entities.push((
      new Pulse({
        x: 0,
        y: lineToPulse.y,
      })
    ))
  }

  updateChargeProgress(scene) {
    const { mainCanvas } = scene

    if (this.chargeProgress >= 100) {
      this.chargeProgress = 0

      if (this.chargeCount < this.maxChargeCount) this.chargeCount += 1
    }

    if (this.chargeCount < this.maxChargeCount) this.chargeProgress += this.chargeSpeed

    this.drawChargeProgress(mainCanvas)
    this.drawCharges(mainCanvas)
  }

  drawChargeProgress(mainCanvas) {
    const progressIndicatorCount = 10
    const fullBarWidth = this.width - 6
    const gutterWidth = 1
    const chunkWidth = Math.round((fullBarWidth - gutterWidth * (progressIndicatorCount - 1)) / progressIndicatorCount)
    const chunkCount = Math.floor(this.chargeProgress / progressIndicatorCount)

    for (let i = 0; i < progressIndicatorCount - 1; i++) {
      const color = (i >= chunkCount) ? '#111' : 'yellow'

      mainCanvas.drawRect({
        x: this.x + 6 + chunkWidth * i + gutterWidth * i,
        y: this.y + this.height - chunkWidth - 4,
        width: chunkWidth,
        height: chunkWidth,
        color,
      })
    }
  }

  drawCharges(mainCanvas) {
    const gutterWidth = 2
    const fullBarWidth = this.width - 6
    const chunkWidth = (fullBarWidth - gutterWidth * (this.maxChargeCount - 1)) / this.maxChargeCount

    for (let i = 0; i < this.maxChargeCount; i++) {
      const color = (i >= this.chargeCount) ? '#111' : 'yellow'

      mainCanvas.drawRect({
        x: this.x + 3 + chunkWidth * i + gutterWidth * i,
        y: this.y + 4,
        width: chunkWidth,
        height: chunkWidth / 2,
        color,
      })
    }
  }

  update(scene) {
    scene.mainCanvas.drawRect(this)

    this.updateChargeProgress(scene)
  }
}

export default Pulser
