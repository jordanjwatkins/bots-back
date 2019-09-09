import ImageFx from '../ImageFx'
import { boxesCollide, collisions } from '../../../libs/collisions'
import birdJumpParticles from './bird/bird-jump-particles';

class PitBridge {
  constructor({ x = 0, y = 0, width = 60, height = 20, lockedClosed }) {
    this.imageFx = new ImageFx()

    this.offCanvas = this.imageFx.initOffCanvas({ width, height })

    this.x = x
    this.y = y
    this.z = 3

    this.width = width
    this.height = height

    this.moving = true

    this.color = 'black'
    this.sparkColor = 'yellow'

    this.entry = this.getUpperRightCorner()
    this.exit = { x: this.x, y: this.y }

    this.type = 'platform'

    this.bridgeWidth = this.width

    this.lineDashOffset = 0
    this.lockedClosed = lockedClosed
  }

  getUpperRightCorner() {
    return {
      x: this.x + this.width,
      y: this.y,
    }
  }

  drawSelectedRect(srcRect, offset = 0) {
   // const cacheKey = `selectedRectW${srcRect.width}H${srcRect.height}O${offset}`

    //if (!this.offCanvases[cacheKey]) {
      const lineWidth = 12
      const { canvas, context } = this.offCanvas

      const rect = {
        width: srcRect.width + (offset * 2) + (lineWidth * 2),
        height: srcRect.height + (offset * 2) + (lineWidth * 2),
      }

      //const { canvas, context } = this.offCanvas

      const m = context.moveTo.bind(context)
      const l = context.lineTo.bind(context)
      const bp = context.beginPath.bind(context)
      const cp = context.closePath.bind(context)


      context.lineWidth = lineWidth
      context.strokeStyle = '#000'
      //context.setLineDash([5, 3])

      bp()
      m(lineWidth - 13, lineWidth - 5)
      l(rect.width - 13 - lineWidth, lineWidth - 5)

      //cp()
    //}

    //const { canvas, context } = this.offCanvas

    context.lineWidth = lineWidth
    context.strokeStyle = '#555'
    context.fillStyle = '#333'
    //context.setLineDash([5, 3])

    context.lineDashOffset = 0
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.setLineDash([0, 0])
    context.stroke()
    context.setLineDash([5, 3])
    context.strokeStyle = '#222'
    context.stroke()
    //context.fillRect()

    context.lineWidth = 20
    context.lineDashOffset = this.lineDashOffset
    context.strokeRect(-20, 35, 250, 4)

    this.mainCanvas.context.drawImage(canvas, 0, 0, canvas.width, canvas.height, srcRect.x - offset, srcRect.y - offset, canvas.width, canvas.height)

    this.lineDashOffset += 1.1
  }

  /*drawSelectedRectNeat(srcRect, offset = 0) {
    // const cacheKey = `selectedRectW${srcRect.width}H${srcRect.height}O${offset}`

     //if (!this.offCanvases[cacheKey]) {
       const lineWidth = 5
       const { canvas, context } = this.offCanvas

       const rect = {
         width: srcRect.width + (offset * 2) + (lineWidth * 2),
         height: srcRect.height + (offset * 2) + (lineWidth * 2),
       }

       //const { canvas, context } = this.offCanvas

       const m = context.moveTo.bind(context)
       const l = context.lineTo.bind(context)
       const bp = context.beginPath.bind(context)
       const cp = context.closePath.bind(context)


       context.lineWidth = lineWidth
       context.strokeStyle = '#000'
       context.setLineDash([5, 3])

       bp()
       m(lineWidth, lineWidth)
       l(rect.width - lineWidth, lineWidth)

       //cp()
     //}

     //const { canvas, context } = this.offCanvas

     context.lineWidth = lineWidth
     context.strokeStyle = '#fff'
     context.setLineDash([5, 3])

     context.lineDashOffset = 0
     context.clearRect(0, 0, canvas.width, canvas.height)
     context.stroke()

     context.lineWidth = this.lineDashOffset
     context.strokeRect(-20, 25, 250, 18)

     this.mainCanvas.context.drawImage(canvas, 0, 0, canvas.width, canvas.height, srcRect.x - offset, srcRect.y - offset, canvas.width, canvas.height)

     this.lineDashOffset += 1.1
   }*/

  update(scene) {
    this.scene = scene

    this.mainCanvas = scene.mainCanvas

    this.isOpen = Math.sin(Date.now() / 380 / scene.skipFrames) > 0.9

    if (this.lockedClosed) this.isOpen = false

    this.targetWidth = (this.isOpen) ? 10 : this.width

    if (this.isOpen) {
      if (this.bridgeWidth > this.targetWidth) this.bridgeWidth -= 35

      if (this.bridgeWidth < this.targetWidth) this.bridgeWidth = this.targetWidth

    } else if (this.bridgeWidth < this.targetWidth) {
      this.bridgeWidth += 30

      if (this.bridgeWidth > this.targetWidth) this.bridgeWidth = this.targetWidth
    }

    //const hits = collisions(this, this.scene.entities)

    //if (hits) console.log(hits);


    this.scene.entities.forEach((entity) => {
      if (entity.type === 'bird') {
        if (boxesCollide(this, entity, { y: -10, x: 25, width: -45 })) {
          //console.log('bird hit');

          if (this.isOpen || (this.bridgeWidth < this.width)) {
            //console.log('fall');
            entity.isFrozen = true
            entity.speed.y = 2

          }

        }
      }
    })

    this.draw()
  }

  draw() {
    this.mainCanvas.drawRect({ ...this, x: this.x - 10, width: this.width + 20, color: '#555' })

    this.mainCanvas.drawRect(this)

    /*this.mainCanvas.drawRect({
      ...this,
      color: 'blue',
      width: this.bridgeWidth,
      height: 10,
    })*/

    this.drawSelectedRect({ ...this, width: this.bridgeWidth })

    this.drawJumpParticles({ x: -this.width / 2 - 6 * Math.random(), y: -this.height })

    if (!this.jumpTimer) {
      this.jumpTimer = 1
    } else {
      this.jumpTimer += 1
    }
    if (this.jumpTimer > 100) {
      this.jumpParticles = null
      this.jumpTimer = 1
    }

    const val = Math.sin(Date.now() / 700)

    if (val > 0 && val < 0.03) {
      console.log('2');

      this.jumpParticles2 = null
    }

    this.drawJumpParticles2({ x: -this.width / 2 + 6 * Math.random(), y: -this.height })

    /*this.mainCanvas.drawRect({
      ...this,
      y: this.y - 10,
      color: '#fff',
      height: 10,
    })*/
  }
}

Object.assign(PitBridge.prototype, birdJumpParticles)

export default PitBridge
