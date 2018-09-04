import { intro } from '../sounds'

const colorBackground = '#2f3b4f'
const colorAmerica = 'white'
const colorOffline = 'red'

class AmericaOfflineTitle {
  constructor(scene) {
    const { mainCanvas } = scene

    this.width = mainCanvas.width
    this.height = mainCanvas.height

    this.x = 0
    this.y = 0

    this.color = colorBackground

    this.z = 4

    this.opacity = 1
    this.delay = 10
    this.americaOffDelay = 50
    this.offlineOnDelay = 50
    this.destroyDelay = 5000

    this.scene = scene

    this.isOnline = true

    intro()

    this.attachEvents()
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

    if (this.delay > 0) {
      this.delay -= 1

      return
    }

    if (this.americaOffDelay > -30) {
      this.americaOffDelay -= 1
    }

    if (this.americaOffDelay < 0 && this.americaOffDelay > -12) {
      this.isFlickering = true
    } else if (this.americaOffDelay < -12) {
      this.isFlickering = false
      this.isOnline = false

      setTimeout(() => {
        this.destroy()
      }, this.destroyDelay)
    }

    this.drawText()
  }
}

export default AmericaOfflineTitle
