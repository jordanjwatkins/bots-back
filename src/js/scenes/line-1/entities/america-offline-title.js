import * as sounds from '../sounds'
import Line from './line'
import Bird from './bird'

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

    this.opacity = 0
    this.delay = 50
    this.americaOffDelay = 320
    this.destroyDelay = 1800

    this.scene = scene

    this.isOnline = true

    this.init()

    this.attachEvents()
  }

  init() {
    const { mainCanvas } = this.scene
    const line1Top = -50

    this.lines = [
      new Line({ width: mainCanvas.width, y: 100, z: 4 }),
      new Line({ width: mainCanvas.width, y: line1Top, z: 4 }),
    ]

    const birdSize = 20

    const bird1 = new Bird({
      x: 200,
      y: line1Top - birdSize,
      verticalSwapper: true,
      lines: this.lines,
    })

    const bird2 = new Bird({
      x: 700,
      y: line1Top - birdSize,
      verticalSwapper: true,
      lines: this.lines,
    })

    const bird3 = new Bird({
      x: 450,
      y: line1Top - birdSize * 2,
      width: birdSize * 2,
      height: birdSize * 2,
      verticalSwapper: true,
      heavy: true,
      absorbed: 3,
      lines: this.lines,
    })

    setTimeout(() => {
      bird1.pulseHit(true)
    }, 1600)

    setTimeout(() => {
      bird2.pulseHit(true)
    }, 3200)

    setTimeout(() => {
      bird3.pulseHit(true)
    }, 5000)

    setTimeout(() => {
      this.cancelIntro = sounds.intro()
    }, 500)

    this.birds = [
      bird1,
      bird2,
      bird3,
    ]
  }

  destroy() {
    this.cancelIntro()
    this.detachEvents()

    this.scene.mainCanvas.opacity = 1

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
    this.destroy()
  }

  drawText() {
    const { mainCanvas } = this.scene
    const { context } = mainCanvas

    mainCanvas.opacity = this.opacity - 0.1

    const fontFamily = 'fantasy'

    context.textAlign = 'center'

    context.fillStyle = colorAmerica

    mainCanvas.opacity = (this.isOnline && !this.isFlickering) ?
      this.opacity - 0.1 :
      this.opacity - 0.8

    context.font = `148px ${fontFamily}`
    context.fillText('America', this.x + (this.width / 2), this.y + 310)

    context.fillStyle = colorOffline

    if (this.isFlickering) {
      this.flicker(this.opacity - 0.8, this.opacity - 0.1, 0.1)
    } else {
      mainCanvas.opacity = (!this.isOnline) ?
        this.opacity - 0.1 :
        this.opacity - 0.8
    }

    context.font = `148px ${fontFamily}`
    context.fillText('Offline', this.x + (this.width / 2), this.y + 470)

    context.restore()
  }

  drawBackground() {
    const { mainCanvas } = this.scene
    const { context } = mainCanvas

    context.save()

    context.globalAlpha = 1

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

    if (this.opacity + 0.01 < 1) {
      this.opacity += 0.01
    }

    if (this.americaOffDelay > -30) {
      this.americaOffDelay -= 1
    }

    if (this.americaOffDelay < 0 && this.americaOffDelay > -12) {
      this.isFlickering = true
    } else if (this.americaOffDelay < -12 && this.isOnline) {
      this.isFlickering = false
      this.isOnline = false

      setTimeout(() => {
        this.destroy()
      }, this.destroyDelay)
    }

    this.drawText()

    this.scene.mainCanvas.opacity = this.opacity

    this.lines.forEach(line => line.update(this.scene))
    this.birds.forEach(bird => bird.update(this.scene))
  }
}

export default AmericaOfflineTitle
