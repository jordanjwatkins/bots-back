const colorBackground = '#2f3b4f'

class LevelSelect {
  constructor(scene) {
    const { mainCanvas } = scene

    this.width = mainCanvas.width
    this.height = mainCanvas.height / 8

    this.x = 0
    this.y = mainCanvas.height - this.height

    this.color = colorBackground

    this.z = 4

    this.opacity = 1

    this.scene = scene

    this.init()

    this.attachEvents()
  }

  init() {

  }

  destroy() {
    this.detachEvents()

    this.scene.titleScreen = null
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

  onClick = () => {

  }

  drawText() {
    const { mainCanvas } = this.scene
    const { context } = mainCanvas

    context.globalAlpha = this.opacity - 0.1

    const fontFamily = 'fantasy'

    context.textAlign = 'center'

    context.fillStyle = colorAmerica

    context.globalAlpha = (this.isOnline && !this.isFlickering) ?
      this.opacity - 0.1 :
      this.opacity - 0.8

    context.font = `148px ${fontFamily}`
    context.fillText('America', this.x + (this.width / 2), this.y + 270)

    context.fillStyle = colorOffline

    if (this.isFlickering) {
      this.flicker(this.opacity - 0.8, this.opacity - 0.1, 0.3)
    } else {
      context.globalAlpha = (!this.isOnline) ?
        this.opacity - 0.1 :
        this.opacity - 0.8
    }

    context.font = `148px ${fontFamily}`
    context.fillText('Offline', this.x + (this.width / 2), this.y + 430)

    context.restore()
  }

  drawBackground() {
    const { mainCanvas } = this.scene
    const { context } = mainCanvas

    context.save()

    context.globalAlpha = this.opacity

    mainCanvas.drawRect(this)
  }

  flicker(offOpacity, onOpacity, toggleRate = 1) {
    const { context } = this.scene.mainCanvas

    if (Math.sin(new Date() / (100 * toggleRate)) > 0) {
      context.globalAlpha = offOpacity
    } else {
      context.globalAlpha = onOpacity
    }
  }

  update() {
    this.drawBackground()
  }
}

export default LevelSelect
