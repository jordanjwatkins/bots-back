import ImageFx from '../ImageFx'
import { boxesCollide, collisions } from '../../../libs/collisions'
import birdJumpParticles from './bird/bird-jump-particles';

class PitBridge {
  constructor({ x = 0, y = 0, width = 60, height = 20 }) {
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
  }

  getUpperRightCorner() {
    return {
      x: this.x + this.width,
      y: this.y,
    }
  }

  drawSelectedRect(srcRect, offset = 2) {
   // const cacheKey = `selectedRectW${srcRect.width}H${srcRect.height}O${offset}`

    //if (!this.offCanvases[cacheKey]) {
      const lineWidth = 1

      const rect = {
        width: srcRect.width + (offset * 2) + (lineWidth * 2),
        height: srcRect.height + (offset * 2) + (lineWidth * 2),
      }

      const { canvas, context } = this.offCanvas

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

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.stroke()

    this.mainCanvas.context.drawImage(canvas, 0, 0, canvas.width, canvas.height, srcRect.x - offset, srcRect.y - offset, canvas.width, canvas.height)

    //context.lineDashOffset += 0.1
  }

  update(scene) {
    this.scene = scene

    this.mainCanvas = scene.mainCanvas

    this.isOpen = Math.sin(Date.now() / 380) > 0.9

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

          if (this.isOpen || (this.bridgeWidth < this.targetWidth)) {
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
    this.mainCanvas.drawRect(this)

    this.mainCanvas.drawRect({
      ...this,
      color: 'blue',
      width: this.bridgeWidth,
      height: 10,
    })

    this.drawSelectedRect({ ...this, width: this.bridgeWidth })

    this.drawJumpParticles({ x: 40, y: -this.height })

    if (!this.jumpTimer) {
      this.jumpTimer = 1
    } else {
      this.jumpTimer += 1
    }
    if (this.jumpTimer > 100) {
      this.jumpParticles = null
      this.jumpTimer = 1
    }

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
