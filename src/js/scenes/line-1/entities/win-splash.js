import * as sounds from '../sounds'

const colorPrimary = '#3F3F74'

let isOpen = false

class WinSplash {
  constructor(scene) {
    const { mainCanvas } = scene

    this.width = mainCanvas.width / 2
    this.height = mainCanvas.height / 2

    this.x = this.width - (this.width / 2)
    this.y = this.height - (this.height / 2) - 30

    this.color = 'white'

    this.z = 4

    this.opacity = 0
    this.delay = 150
    this.starDelay = 20

    this.scene = scene

    isOpen = true

    setTimeout(() => this.attachEvents(), 1000)
  }

  destroy() {
    isOpen = false

    this.detachEvents()

    this.scene.entities = this.scene.entities.filter(entity => entity !== this)
  }

  attachEvents() {
    const { canvas } = this.scene.mainCanvas

    canvas.addEventListener('click', this.onClick)
  }

  detachEvents() {
    const { canvas } = this.scene.mainCanvas

    canvas.removeEventListener('click', this.onClick)
  }

  onClick = (event) => {
    if (this.isRestartClick(event)) {
      this.scene.storage.initLevel(this.scene.nextLevel)

      this.scene.freshStart()
    }

    if (this.isNextLevelClick(event)) this.scene.startNextLevel()
  }

  isRestartClick(event) {
    const { mainCanvas, debug } = this.scene

    const scale = mainCanvas.scaleInDom

    const clickRect = {
      y: 300 * scale,
      x: 265 * scale,
      height: 120 * scale,
      width: 120 * scale,
    }

    if (debug && !this.restartDebugRect) {
      this.restartDebugRect = mainCanvas.clickAreaDebug(clickRect)
    }

    return mainCanvas.isClickHit(event, clickRect)
  }

  isNextLevelClick(event) {
    const { mainCanvas, debug } = this.scene

    const scale = mainCanvas.scaleInDom

    const clickRect = {
      y: 300 * scale,
      x: 610 * scale,
      height: 120 * scale,
      width: 120 * scale,
    }

    if (debug && !this.nextLevelDebugRect) {
      this.nextLevelDebugRect = mainCanvas.clickAreaDebug(clickRect)
    }

    return mainCanvas.isClickHit(event, clickRect)
  }

  drawStars() {
    const { mainCanvas, starScore } = this.scene
    const { context } = mainCanvas

    context.save()

    let x = 365
    const y = 265

    const fadedAlpha = (this.opacity - 0.6 > 0) ? this.opacity - 0.6 : 0
    const alpha = (this.opacity - 0.1 > 0) ? this.opacity - 0.1 : 0

    this.starDelay -= 1

    context.globalAlpha = (starScore > 0 && this.starDelay < 0) ?
      alpha :
      fadedAlpha

    if (starScore > 0 && this.starDelay < 0 && !this.startSound1) {
      this.startSound1 = true
      sounds.hop()
    }

    mainCanvas.drawStar(x, y, colorPrimary, 20)

    context.globalAlpha = (starScore > 1 && this.starDelay < -20) ?
      alpha :
      fadedAlpha

    if (starScore > 1 && this.starDelay < -20 && !this.startSound2) {
      this.startSound2 = true
      sounds.hop()
    }

    x += 120

    mainCanvas.drawStar(x, y, colorPrimary, 20)

    context.globalAlpha = (starScore > 2 && this.starDelay < -40) ?
      alpha :
      fadedAlpha

    if (starScore > 2 && this.starDelay < -40 && !this.startSound3) {
      this.startSound3 = true
      sounds.hop()
    }

    if (this.starDelay < 0 && !this.startSound4) {
      this.startSound4 = true

      setTimeout(() => {
        if (isOpen) sounds.quickEnd()
      }, 1500)
    }

    x += 120

    mainCanvas.drawStar(x, y, colorPrimary, 20)

    context.restore()
  }

  drawText() {
    const { mainCanvas, pulser, bestScoreForLevel } = this.scene
    const { context } = mainCanvas

    context.globalAlpha = this.opacity - 0.1

    const fontFamily = 'fantasy'

    context.textAlign = 'center'

    context.fillStyle = colorPrimary

    context.font = `48px ${fontFamily}`
    context.fillText('Birds Off Line!', this.x + this.width / 2, this.y + 70)

    context.font = `28px ${fontFamily}`
    context.fillText(`Pulse count: ${pulser.pulsesFiredCount}`, this.x + this.width / 2, this.y + 230)

    context.font = `28px ${fontFamily}`
    context.fillText(`Personal best: ${bestScoreForLevel}`, this.x + this.width / 2, this.y + 270)

    context.restore()
  }

  drawBackground() {
    const { mainCanvas } = this.scene
    const { context } = mainCanvas

    context.save()

    context.globalAlpha = 0.3

    mainCanvas.drawRect({
      width: mainCanvas.width,
      height: mainCanvas.height,
      x: 0,
      y: 0,
      color: colorPrimary,
    })

    context.globalAlpha = this.opacity

    mainCanvas.drawRect({
      width: this.width + 20,
      height: this.height + 20,
      x: this.x - 13,
      y: this.y - 5,
      color: colorPrimary,
    })

    context.rotate(0.003 * Math.PI)

    mainCanvas.drawRect(this)
  }

  drawTriangle(context, x, y, scale, flip = false) {
    context.save()

    context.globalAlpha = 0.9

    context.translate(x, y)

    if (flip) context.scale(-1, 1)

    context.lineWidth = 3
    context.strokeStyle = colorPrimary
    context.fillStyle = colorPrimary

    context.beginPath()
    context.moveTo(0, 0)
    context.lineTo(0, 20 * scale)
    context.lineTo(20 * scale, 10 * scale)
    context.closePath()

    context.stroke()
    context.fill()

    context.restore()
  }

  drawRestart(context, x, y) {
    const radius = 25

    context.save()

    context.globalAlpha = 0.9

    context.beginPath()

    context.arc(x, y, radius, 0, 2 * Math.PI, false)
    context.fillStyle = colorPrimary

    // context.fill()
    context.lineWidth = 5
    context.strokeStyle = colorPrimary
    context.stroke()

    this.drawTriangle(context, x - 4, y + 17, 0.7)

    this.drawTriangle(context, x + 6, y - 32, 0.7, true)

    context.restore()
  }

  update() {
    if (this.delay > 0) {
      this.delay -= 1

      return
    }

    if (this.opacity < 0.9) this.opacity += 0.1

    const { context } = this.scene.mainCanvas

    this.drawBackground()
    this.drawText()

    // next level button
    this.drawTriangle(context, 655, 345, 1.5)

    this.drawRestart(context, 325, 360)

    this.drawStars()

    if (this.restartDebugRect) this.restartDebugRect()
    if (this.nextLevelDebugRect) this.nextLevelDebugRect()
  }
}

export default WinSplash
