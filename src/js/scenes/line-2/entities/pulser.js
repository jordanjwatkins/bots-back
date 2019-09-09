//import * as sounds from '../sounds'
//import Pulse from './pulse'
import Particles from './particles'

import PulserMenu from './pulser-menu'

class Pulser {
  constructor({ x = 0, y = 0, width = 100, height = 50, speedX = 4, speedY = 0, chargeCount = 0, chargeSpeed = 1 }) {
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

    this.directionX = 0
  }

  destroy(scene) {
    scene.entities = scene.entities.filter(entity => entity !== this)

    this.menu.destroy()
  }

  /*canPulse() {
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
  }*/

  updateChargeProgress(scene) {
    const { mainCanvas } = scene

    if (this.chargeProgress >= 100) {
      this.chargeProgress = 0

      if (this.chargeCount < this.maxChargeCount) this.chargeCount += 1
    }

    if (this.chargeCount < this.maxChargeCount) this.chargeProgress += this.chargeSpeed

    if (this.dead) this.chargeCount -= 1

    this.mainCanvas.context.filter = 'blur(1px)'
    this.drawChargeProgress(mainCanvas)
    this.drawCharges(mainCanvas)
    this.mainCanvas.context.filter = 'none'
  }

  drawChargeProgress(mainCanvas) {
    const progressIndicatorCount = 10
    const fullBarWidth = this.width - 6
    const gutterWidth = 1
    const chunkWidth = Math.round((fullBarWidth - gutterWidth * (progressIndicatorCount - 1)) / progressIndicatorCount)
    const chunkCount = Math.floor(this.chargeProgress / progressIndicatorCount)

    for (let i = 0; i < progressIndicatorCount - 1; i++) {
      let color = (i >= chunkCount) ? '#3a4d94' : 'yellow'

      if (this.dead && !(i >= chunkCount)) color = 'red'

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
      const color = (i >= this.chargeCount) ? '#3a4d94' : 'yellow'

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

    this.boxColor = '#6a8aff'

    if (this.eyeOffset > 15) scene.mainCanvas.drawRect({ ...this, color: this.boxColor })
    scene.mainCanvas.context.strokeStyle = '#444'
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
    this.eyeOffset = (this.eyeOffset !== undefined) ? this.eyeOffset : -70

    //if (true) this.eyeOffset = 40

    this.eyeOffset += 0.1

    //this.eyeOffset += 0.5

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

    this.mainCanvas.context.filter = 'blur(1px)'
    scene.mainCanvas.drawRect({
      x: this.x + this.width / 2 - 15,
      y: this.y - 17 - Math.round(this.eyeOffset),
      width: 30,
      height: 5,
      color: (this.dead) ? 'black' : '#2472ff',
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
    this.mainCanvas.context.filter = 'blur(2px)'
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

    this.drawLifter(scene)

    if (!this.fightParticles) this.fightParticles = new Particles({ target: this })
    if (!this.fightParticles2) this.fightParticles2 = new Particles({ target: { ...this, x: 9, y: 589, directionX: 0, width: 99, height: 99 } })

    //this.mainCanvas.lateRenders.push(() => this.fightParticles.draw())
    if (this.eyeOffset > -10 && this.eyeOffset < 10) this.fightParticles.draw()
    //this.fightParticles2.draw()
    this.mainCanvas.lateRenders.push(() => this.fightParticles2.draw())
  }

  drawLifter(scene) {
    //this.liftFrame = this.liftFrame || 3
    this.liftFrame = this.liftFrame || 44

    //this.liftFrame += 0.1
    this.liftFrame -= 0.1

    //this.liftFrame -= 0.5

    let lifterX = this.x - 5
    let lifterY = this.y + this.height - 34

    this.lifterXOffset = this.lifterXOffset || 0

    this.lifterBodyState = 1
    this.lifterEyeState = 1
    this.lifterLegState = 1

    if (this.lifterArmState > 18) {
      this.lifterBodyState = 2
      this.lifterEyeState = 2
    }

    if (this.lifterArmState > 39) {
      this.lifterEyeState = 1
    }

    // turn point: 21, near-max: 39 max: ?
    if (this.liftFrame > 3) {
      this.lifterArmState = Math.floor(this.liftFrame)
    } else {
      this.lifterLegState = 2

      //this.lifterXOffset -= 0.1
    }

    lifterX += Math.floor(this.lifterXOffset)

    if (Math.sin(Date.now() / 100) > 0) {
      //this.lifterArmState = 12
    }

    if (this.lifterLegState > 1) {
      if (Math.sin(Date.now() / 100) > 0) {
        this.lifterLegState = 3
      }
    }

    const boxWidth = (this.eyeOffset > -5) ? 98 : 20
    const boxHeight = (this.eyeOffset > 0) ? 52 : 28

    // box
    if (this.eyeOffset < 16) scene.mainCanvas.drawRect({
      x: lifterX + 6 - ((this.lifterArmState > 21) ? this.lifterArmState - 22 : 0) + ((this.lifterArmState > 39) ? this.lifterArmState - 39 : 0),
      y: lifterY + 9 - boxHeight + 28 - ((this.lifterArmState > 21) ? 22 : this.lifterArmState) + ((this.lifterArmState > 39 && this.lifterArmState < 43) ? this.lifterArmState - 39 : 0),
      width: boxWidth, //(this.lifterArmState > 11) ? 28 : 20,
      height: boxHeight, //(this.lifterArmState > 11) ? 20 : 28,
      color: this.boxColor,
    })

    // torso
    scene.mainCanvas.drawRect({
      x: lifterX,
      y: (this.lifterBodyState === 2) ? lifterY + 16 : lifterY,
      width: 4,
      height: (this.lifterBodyState === 2) ? 8 : 24,
      color: 'blue',
    })

    if (this.lifterBodyState === 2) {
      // torso2
      scene.mainCanvas.drawRect({
        x: lifterX - 14,
        y: lifterY + 16,
        width: 14,
        height: 4,
        color: 'blue',
      })
    }

    // eyes
    scene.mainCanvas.drawRect({
      x: (this.lifterBodyState === 2) ? lifterX - 14 + ((this.lifterEyeState === 2) ? 1 : 0) : lifterX,
      y: (this.lifterBodyState === 2) ? lifterY + 18 + ((this.lifterEyeState === 1) ? -1 : 0) : lifterY + 1,
      width: (this.lifterEyeState === 2) ? 1 : 2,
      height: (this.lifterEyeState === 2) ? 2 : 1,
      color: 'yellow',
    })

    // groove
    scene.mainCanvas.drawRect({
      x: lifterX + 1,
      y: lifterY + 3, //(this.lifterBodyState === 2) ? lifterY + 13 :
      width: 2,
      height: 20, // (this.lifterBodyState === 2) ? 10 : 20,
      color: 'red',
    })

    if (this.lifterBodyState === 2) {
      // groove2
      /*scene.mainCanvas.drawRect({
        x: lifterX - 10,
        y: lifterY + 17,
        width: 12,
        height: 2,
        color: 'red',
      })*/
    }

    // hips
    scene.mainCanvas.drawRect({
      x: lifterX,
      y: lifterY + 24,
      width: 3,
      height: 1,
      color: 'green',
    })

    // left joint
    scene.mainCanvas.drawRect({
      x: lifterX - 1,
      y: lifterY + 25,
      width: 1,
      height: 1,
      color: 'green',
    })

    // right joint
    scene.mainCanvas.drawRect({
      x: lifterX + 3,
      y: lifterY + 25,
      width: 1,
      height: 1,
      color: 'green',
    })

    // left leg
    scene.mainCanvas.drawRect({
      x: lifterX - 2,
      y: lifterY + 26,
      width: 1,
      height: (this.lifterLegState === 3) ? 7 : 8,
      color: 'green',
    })

    // right leg
    scene.mainCanvas.drawRect({
      x: lifterX + 4,
      y: lifterY + 26,
      width: 1,
      height: (this.lifterLegState === 2) ? 7 : 8,
      color: 'green',
    })

    if (this.lifterArmState < 22) {
      // arm
      scene.mainCanvas.drawRect({
        x: lifterX + 1,
        y: lifterY + 24 - this.lifterArmState,
        width: 20,
        height: 2,
        color: 'green',
      })
    } else {
      scene.mainCanvas.drawRect({
        x: lifterX + 1 - this.lifterArmState + 22 + ((this.lifterArmState > 39) ? this.lifterArmState - 39 : 0),
        y: lifterY + 3 + ((this.lifterArmState > 39 && this.lifterArmState < 43) ? this.lifterArmState - 39 : 0),
        width: 20,
        height: 2,
        color: 'green',
      })
      // arm up
      /*scene.mainCanvas.drawRect({
        x: lifterX + 1 - this.lifterArmState + 12,
        y: lifterY - 6,
        width: 1,
        height: 20,
        color: 'green',
      })*/

      // arm down
      /*scene.mainCanvas.drawRect({
        x: lifterX + 1,
        y: lifterY + 24 - this.lifterArmState,
        width: 1,
        height: 20,
        color: 'green',
      })*/
    }



  }
}

export default Pulser
