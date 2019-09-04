import * as sounds from '../sounds'
import Pulse from './pulse'
import PulserMenu from './pulser-menu';

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

    this.type = 'pulser'
  }

  destroy(scene) {
    scene.entities = scene.entities.filter(entity => entity !== this)

    this.menu.destroy()
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
    this.scene = scene
    this.mainCanvas = scene.mainCanvas

    if (!this.menu) this.menu = new PulserMenu(this)

    this.menu.isMenuOpen = true

    if (this.menu && this.menu.isMenuOpen) {

      if (this.menu && this.menu.debugRectFn) {
        // this.mainCanvas.context.setTransform(1, 0, 0, 1, 0, 0)
        this.menu.debugRectFn()
        //this.mainCanvas.lateRenders.push(() => this.menu.debugRectFn())
      }
      //if (this.scene.pulser !== this.scene.mainCanvas.selected) {
        //this.menu.closeMenu()
      //} else {
        //this.menu.drawMenu()
      //}

      let savedAlpha = parseInt(scene.mainCanvas.context.globalAlpha)

      //console.log(parseInt(this.mainCanvas.globalAlpha), savedAlpha, savedAlpha + parseInt(scene.mainCanvas.globalAlpha) - 0.1);

      const temp = parseInt(scene.mainCanvas.globalAlpha) - 1


      //scene.mainCanvas.context.globalAlpha = temp

      //console.log(scene.mainCanvas.context.globalAlpha );

      this.globalAlpha = this.globalAlpha || 0.2

      if (Math.random() > 0.2) this.globalAlpha = '0.9'
      if (Math.random() > 0.8) this.globalAlpha = '0.8'
      if (Math.random() > 0.9) this.globalAlpha = '0.93'

      scene.mainCanvas.context.globalAlpha = this.globalAlpha

      this.menu.drawMenu()

      scene.mainCanvas.context.globalAlpha = savedAlpha

      let { x, y } = this.menu.getMenuXy()

      //x = 100
      //y = 100

      //console.log(x, y);


      const x1 = x
      const y1 = y + this.menu.menuCanvas.canvas.height

      const x2 = x + this.menu.menuCanvas.canvas.width / 2
      const y2 = 480 - this.eyeOffset

      const x3 = x + this.menu.menuCanvas.canvas.width
      const y3 = y1

      //console.log('points:', x1, y1, x2, y2, x3, y3);
      // 100 300 150 400 200 300

      /*const x1 = x + this.menu.menuCanvas.canvas.width
      const y1 = y + this.menu.menuCanvas.canvas.height

      const x2 = x + this.menu.menuCanvas.canvas.width / 2
      const y2 = 510

      const x3 = x + this.menu.menuCanvas.canvas.width
      const y3 = y1*/

      scene.mainCanvas.drawTriangleFromPoints([{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }], 1)
      //scene.mainCanvas.drawTriangleFromPoints([{ x: 200, y: 200 }, { x: 220, y: 220 }, { x: 240, y: 140 }], 3)

      //scene.mainCanvas.drawTriangleFromPoints([{ x: 100, y: 300 }, { x: 220, y: 220 }, { x: 240, y: 140 }], 1)
    }

    scene.mainCanvas.drawRect(this)

    this.updateChargeProgress(scene)

    this.eyeOffset = this.eyeOffset || 1

    this.eyeOffset += 0.1

    if (this.eyeOffset > 100) this.eyeOffset = 100

    scene.mainCanvas.drawRect({
      x: this.x + this.width / 2 - 2,
      y: this.y - 20 - Math.round(this.eyeOffset),
      width: 4,
      height: 20 + Math.round(this.eyeOffset),
      color: '#333',
    })

    scene.mainCanvas.drawRect({
      x: this.x + this.width / 2 - 15,
      y: this.y - 20 - Math.round(this.eyeOffset),
      width: 30,
      height: 10,
      color: '#333',
    })

    scene.mainCanvas.drawRect({
      x: this.x + this.width / 2 - 15,
      y: this.y - 17 - Math.round(this.eyeOffset),
      width: 30,
      height: 5,
      color: 'blue',
    })
  }
}

export default Pulser
