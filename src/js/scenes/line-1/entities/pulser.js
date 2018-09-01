import { jump2 } from '../sound'
import Pulse from './pulse'

class Pulser {
  constructor({ x = 0, y = 0, width = 100, height = 50, speedX = 4, speedY = 0 }) {
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
    this.chargeSpeed = 4
    this.maxChargeCount = 3
    this.chargeCount = this.maxChargeCount
    this.pulsesFiredCount = 0
  }

  destroy(scene) {
    scene.entities = scene.entities.filter(entity => entity !== this)
  }

  canPulse() {
    return (this.chargeCount > 0)
  }

  firePulse({ lines, entities, allFlying }, lineToPulse) {
    if (!this.canPulse()) return

    this.chargeCount -= 1

    if (!allFlying) this.pulsesFiredCount += 1

    const lineIndex = lines.findIndex(line => line === lineToPulse)

    jump2(lineIndex)

    entities.push((
      new Pulse({
        x: 0,
        y: lineToPulse.y,
      })
    ))
  }

  updateChargeProgress(scene) {
    const { mainCanvas } = scene;

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

    for (let i = 0; i < chunkCount; i++) {
      mainCanvas.drawRect({
        x: this.x + 3 + chunkWidth * i + gutterWidth * i,
        y: this.y + this.height - chunkWidth - 4,
        width: chunkWidth,
        height: chunkWidth,
        color: 'yellow'
      })
    }
  }

  drawCharges(mainCanvas) {
    const gutterWidth = 2
    const fullBarWidth = this.width - 6
    const chunkWidth = (fullBarWidth - gutterWidth * (this.maxChargeCount - 1)) / this.maxChargeCount

    for (let i = 0; i < this.chargeCount; i++) {
      mainCanvas.drawRect({
        x: this.x + 3 + chunkWidth * i + gutterWidth * i,
        y: this.y + 4,
        width: chunkWidth,
        height: chunkWidth / 2,
        color: 'yellow'
      })
    }
  }

  update(scene) {
    scene.mainCanvas.drawRect(this)

    this.updateChargeProgress(scene)
  }
}

export default Pulser
