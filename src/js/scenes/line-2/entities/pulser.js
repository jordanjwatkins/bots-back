import Particles from './particles'
import PulserMenu from './pulser-menu'

class Pulser {
  constructor({ x = 0, y = 0, width = 100, height = 50, speedX = 4, speedY = 0, chargeCount = 0, chargeSpeed = 5 }) {
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
    this.maxChargeCount = 12
    this.chargeCount = chargeCount
    this.pulsesFiredCount = 0

    this.type = 'pulser'

    this.directionX = 0
  }

  destroy(scene) {
    scene.entities = scene.entities.filter(entity => entity !== this)

    if (this.menu) this.menu.destroy()
  }

  updateChargeProgress(scene) {
    const { mainCanvas } = scene

    if (this.chargeProgress >= 100) {
      this.chargeProgress = 0

      if (this.chargeCount < this.maxChargeCount) this.chargeCount += 1
    }

    if (this.chargeCount + this.pulsesFiredCount < this.maxChargeCount) this.chargeProgress += this.chargeSpeed * 13

    if (this.dead)  {
      this.chargeCount -= 1
    }

    this.mainCanvas.context.filter = 'none'
    //this.drawChargeProgress(mainCanvas)
    this.drawCharges(mainCanvas)
    this.mainCanvas.context.filter = 'none'
  }

  drawCharges(mainCanvas) {
    const gutterWidth = 2
    const fullBarWidth = this.width
    const chunkWidth = (fullBarWidth - gutterWidth * (this.maxChargeCount * 2 - 1)) / this.maxChargeCount * 2

    for (let i = 0; i < this.maxChargeCount; i++) {
      let color = (i >= this.chargeCount - this.pulsesFiredCount) ? '#3a4d94' : 'yellow'

      if (this.dead) color = Math.sin(Date.now() / 300) > 0 ? 'red' : '#3a4d94'

      let y = (i < this.maxChargeCount / 2) ? 0 : chunkWidth + 2
      let x = (i < this.maxChargeCount / 2) ? 0 : -(chunkWidth * (this.maxChargeCount / 2) + gutterWidth * (this.maxChargeCount / 2))

      mainCanvas.drawRect({
        x: this.x + 3 + chunkWidth * i + gutterWidth * i + x,
        y: this.y + 4 + y,
        width: chunkWidth,
        height: chunkWidth,
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

      let savedAlpha = parseInt(scene.mainCanvas.context.globalAlpha)

      this.globalAlpha = this.globalAlpha || 0.2

      if (Math.random() > 0.2) this.globalAlpha = '0.9'
      if (Math.random() > 0.8) this.globalAlpha = '0.8'
      if (Math.random() > 0.9) this.globalAlpha = '0.93'

      scene.mainCanvas.context.globalAlpha = this.globalAlpha

      if (!this.dead && this.eyeOffset > 40) this.menu.drawMenu()

      scene.mainCanvas.context.globalAlpha = savedAlpha

      let { x, y } = this.menu.getMenuXy()

      const x1 = x
      const y1 = y + this.menu.menuCanvas.canvas.height

      const x2 = x + this.menu.menuCanvas.canvas.width / 2
      const y2 = this.y - 18 - this.eyeOffset

      const x3 = x + this.menu.menuCanvas.canvas.width
      const y3 = y1

      if (!this.dead && this.eyeOffset > 40) scene.mainCanvas.drawTriangleFromPoints([{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }], 1)
    }

    this.boxColor = '#222'
    //'#6a8aff'
    //'#444'

    if (this.eyeOffset > 15) scene.mainCanvas.drawRect({ ...this, color: this.boxColor })

    scene.mainCanvas.context.strokeStyle = '#6a8aff'

    if (this.eyeOffset > 15) {
      scene.mainCanvas.context.strokeRect(
        this.x,
        this.y,
        this.width,
        this.height,
      )
    }

    if (this.eyeOffset > 16) this.updateChargeProgress(scene)

    // eye
    this.eyeOffset = (this.eyeOffset !== undefined) ? this.eyeOffset : -15

    if (true) this.eyeOffset = 40

    this.eyeOffset += 0.1

    if (scene.seenIntro) this.eyeOffset += 0.5

    if (this.eyeOffset > 100) this.eyeOffset = 100

    if (this.dead) {
      this.eyeOffset -= 5
      if (this.eyeOffset < 20) this.eyeOffset = 20
    }

    if (this.eyeOffset > 10) {
      scene.mainCanvas.drawRect({
        x: this.x + this.width / 2 - 2,
        y: this.y - 20 - Math.round(this.eyeOffset),
        width: 4,
        height: 20 + Math.round(this.eyeOffset),
        color: this.boxColor,
      })

      scene.mainCanvas.context.strokeRect(
        this.x + this.width / 2 - 2,
        this.y - 20 - Math.round(this.eyeOffset),
        4,
        20 + Math.round(this.eyeOffset)
      )

      scene.mainCanvas.drawRect({
        x: this.x + this.width / 2 - 15,
        y: this.y - 20 - Math.round(this.eyeOffset),
        width: 30,
        height: 10,
        color: '#333',
      })

      this.mainCanvas.context.filter = 'none'
      scene.mainCanvas.drawRect({
        x: this.x + this.width / 2 - 15,
        y: this.y - 17 - Math.round(this.eyeOffset),
        width: 30,
        height: 5,
        color: (this.dead) ? '#000' : '#2472ff',
      })
      this.mainCanvas.context.filter = 'none'

      const x1 = this.x - 60
      const y1 = this.y + this.height

      const x2 = this.x + this.menu.menuCanvas.canvas.width / 2
      const y2 = this.y - 18 - this.eyeOffset

      const x3 = this.x
      const y3 = y1

      if (this.eyeOffset > 27 && this.eyeOffset < 30) scene.mainCanvas.drawTriangleFromPoints([{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }], 1)

      if (this.eyeOffset > 30) {
        // pad
        this.mainCanvas.context.filter = 'none'

        scene.mainCanvas.drawRect({
          x: this.x - 55,
          y: this.y + this.height - 6,
          width: 30,
          height: 4,
          color: 'yellow',
        })
        this.mainCanvas.context.filter = 'none'

        scene.mainCanvas.drawRect({
          x: this.x - 60,
          y: this.y + this.height - 5,
          width: 40,
          height: 5,
          color: '#111',
        })

        scene.mainCanvas.drawRect({
          x: this.x - 55,
          y: this.y + this.height - 3,
          width: 55,
          height: 3,
          color: '#333',
        })
      }
    }

    //this.drawLifter(scene)

    if (!this.fightParticles) this.fightParticles = new Particles({ target: this })
    //if (!this.fightParticles2) this.fightParticles2 = new Particles({ target: { ...this, x: 9, y: 589, directionX: 0, width: 99, height: 99 } })

    //this.mainCanvas.lateRenders.push(() => this.fightParticles.draw())
    if (this.eyeOffset > -10 && this.eyeOffset < 10) this.fightParticles.draw()
    //this.fightParticles2.draw()
    //this.mainCanvas.lateRenders.push(() => this.fightParticles2.draw())
  }
}

export default Pulser
