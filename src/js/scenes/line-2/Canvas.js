import images from './images'
import ImageFx from './ImageFx'

class MainCanvas {
  constructor({ width = 200, height = 200 } = {}) {
    this.canvas = document.createElement('canvas')

    this.canvas.width = width
    this.canvas.height = height

    this.context = this.canvas.getContext('2d')

    this.canvas.style.backgroundColor = '#639bff'

    this.context.imageSmoothingEnabled = false

    this.imageFx = new ImageFx(this.canvas, this.context)
    /*this.imageFx2 = new ImageFx(this.canvas, this.context)
    this.imageFx3 = new ImageFx(this.canvas, this.context)
    this.imageFx4 = new ImageFx(this.canvas, this.context)
    this.imageFx5 = new ImageFx(this.canvas, this.context)*/
  }

  get scaleInDom() {
    return this.canvas.clientWidth / this.canvas.width
  }

  get width() {
    return this.canvas.width
  }

  get height() {
    return this.canvas.height
  }

  get boundingRect() {
    return this.canvas.getBoundingClientRect()
  }

  set opacity(value) {
    if (value < 0) value = 0
    if (value > 1) value = 1

    this.context.globalAlpha = value
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  testRect(color) {
    this.context.fillStyle = color || '#000'

    this.context.fillRect(0, 0, 40, 20)
  }

  transform(thing) {
    this.context.translate(thing.x, thing.y + (thing.height / 2))

    if (thing.scaleX) this.flipX(thing)
    if (thing.rotation) this.rotateThing(thing)

    this.context.translate(-thing.x, -thing.y - (thing.height / 2))
  }

  flipX(thing) {
    this.context.scale(thing.scaleX, 1)
  }

  rotateThing(thing) {
    this.context.rotateThing(thing.rotation * (Math.PI / 180))
  }

  drawRect({ x, y, color, width = 30, height = 60 }) {
    this.context.fillStyle = color || '#000'

    this.context.fillRect(x, y, width, height)
  }

  drawThing(thing, frame = 0) {
    if (thing.spriteName) thing.sprite = images[thing.spriteName]

    if (!thing.sprite) return

    const spriteX = thing.x - (thing.width / 2)
    const spriteY = thing.y - (thing.height / 2)

    this.context.drawImage(
      thing.sprite,

      // sprite frame box
      frame * thing.frameWidth + thing.frameOffset, 0, thing.frameWidth, thing.frameHeight,

      // position in world
      spriteX, spriteY,

      // dimensions in world
      thing.width, thing.height,
    )
  }

  drawVignette() {
    this.imageFx.vignette()
  }

  drawNoise() {
    this.noiseCount = this.noiseCount || 1

    if (this.noiseCount > 5) {
      this.noiseOffsetX = Math.round(Math.random() * 30)
      this.noiseOffsetY = Math.round(Math.random() * 30)

      this.noiseCount = 0
    }

    this.imageFx.noise(this.noiseOffsetX, this.noiseOffsetY)



    /*if (this.noiseCount < 5) {
      this.imageFx.noise()
    } else if (this.noiseCount < 10) {
      this.imageFx2.noise()
    } else if (this.noiseCount < 15) {
      this.imageFx4.noise()
    } else if (this.noiseCount < 20) {
      this.imageFx5.noise()
    } else {
      this.imageFx3.noise()
      this.noiseCount = 0
    }*/

    this.noiseCount += 1
  }

  isClickHit(event, clickRect) {
    const canvasRect = this.boundingRect

    return (
      event.pageY < canvasRect.y + clickRect.y + clickRect.height &&
      event.pageY > canvasRect.y + clickRect.y &&
      event.pageX < canvasRect.x + clickRect.x + clickRect.width &&
      event.pageX > canvasRect.x + clickRect.x
    )
  }

  clickCoords = (event) => {
    const canvasRect = this.boundingRect

    return {
      x: event.pageX - canvasRect.x,
      y: event.pageY - canvasRect.y,
    }
  }

  clickAreaDebug(clickRect, offset = 2) {
    return () => {
      this.context.setTransform(1, 0, 0, 1, 0, 0)

      const { x, y, width, height } = clickRect

      this.drawRect({
        x: x - offset,
        y: y - offset,
        width: width + offset * 2,
        height: height + offset * 2,
        color: 'red',
      })
    }
  }

  drawSelectedRect(srcRect, offset = 2) {
    /*const { context } = this

    const m = context.moveTo.bind(context)
    const l = context.lineTo.bind(context)
    const bp = context.beginPath.bind(context)
    const cp = context.closePath.bind(context)

    context.lineWidth = '1'
    context.strokeStyle = '#000'
    context.setLineDash([5, 3])
    context.lineDashOffset += 0.1

    const rect = {
      x: srcRect.x - offset - context.lineWidth,
      y: srcRect.y - offset - context.lineWidth,
      width: srcRect.width + offset * 2 + context.lineWidth * 2,
      height: srcRect.height + offset * 2 + context.lineWidth * 2,
    }

    bp()
    m(rect.x, rect.y)
    l(rect.x + rect.width, rect.y)
    l(rect.x + rect.width, rect.y + rect.height)
    l(rect.x, rect.y + rect.height)
    l(rect.x, rect.y)
    cp()

    context.stroke()*/
    this.imageFx.drawSelectedRect(srcRect, offset)
  }

  makeScanlines(vh, vw) {
    const lines = []
    let y = 0

    while (y < vh * 2) {
      const line = {
        start: [0, y],
        end: [vw * 2, y],
        width: 3,
      }

      y += 7

      lines.push(line)
    }

    return lines
  }

  drawRollingLine() {
    const { canvas, context } = this

    const vh = canvas.height
    const vw = canvas.width

    const m = context.moveTo.bind(context)
    const l = context.lineTo.bind(context)
    const bp = context.beginPath.bind(context)
    const cp = context.closePath.bind(context)

    context.save()

    context.globalAlpha = 0.05

    context.lineWidth = vh / 5
    context.strokeStyle = '#000'

    if (this.rollY === undefined) this.rollY = -100

    if (this.rollY > vh +  vh / 5) this.rollY = -100 - (800 * Math.random())

    this.rollY += 10

    const y = this.rollY

    bp()
    m(0, y)
    l(vw, y)
    cp()

    context.stroke()

    context.restore()
  }

  drawRollingLine2() {
    const { canvas, context } = this

    const vh = canvas.height
    const vw = canvas.width

    const m = context.moveTo.bind(context)
    const l = context.lineTo.bind(context)
    const bp = context.beginPath.bind(context)
    const cp = context.closePath.bind(context)

    context.save()

    context.globalAlpha = 0.05

    context.lineWidth = vh / 8
    context.strokeStyle = '#FFF'

    if (this.rollY2 === undefined) this.rollY2 = -100

    if (this.rollY2 > vh) this.rollY2 = -100

    this.rollY2 += 10

    const y = this.rollY2

    bp()
    m(0, y)
    l(vw, y)
    m(0, y + vh / 4)
    l(vw, y + vh / 4)
    cp()

    context.stroke()

    context.restore()
  }

  drawRollingLineReversed() {
    const { canvas, context } = this

    const vh = canvas.height
    const vw = canvas.width

    const m = context.moveTo.bind(context)
    const l = context.lineTo.bind(context)
    const bp = context.beginPath.bind(context)
    const cp = context.closePath.bind(context)

    context.save()

    context.globalAlpha = 0.05

    context.lineWidth = vh / 8
    context.strokeStyle = '#FFF'

    if (this.rollY2 === undefined) this.rollY2 = vh + 200

    if (this.rollY2 < -200) this.rollY2 = vh + 200

    this.rollY2 -= 10

    const y = this.rollY2

    bp()
    m(0, y)
    l(vw, y)
    m(0, y + vh / 4)
    l(vw, y + vh / 4)
    cp()

    context.stroke()

    context.restore()
  }

  drawScanlines() {
    if (this.scanlinesCanvas) {
      this.context.drawImage(this.scanlinesCanvas, 0, 0)

      return
    }

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    canvas.width = this.canvas.width
    canvas.height = this.canvas.height

    const vh = canvas.height
    const vw = canvas.width

    const m = context.moveTo.bind(context)
    const l = context.lineTo.bind(context)
    const bp = context.beginPath.bind(context)
    const cp = context.closePath.bind(context)

    context.save()

    context.setTransform(1, 0, 0, 1, 0, 0)
    context.scale(0.5, 0.5)

    context.globalAlpha = 0.2

    context.lineWidth = '0.1'
    context.strokeStyle = '#000'

    this.scanlines = this.scanlines || this.makeScanlines(vh, vw)

    this.scanlines.forEach((line) => {
      context.lineWidth = line.width

      bp()

      m(line.start[0], line.start[1])
      l(line.end[0], line.end[1])
      cp()

      context.stroke()
    })

    context.restore()

    this.scanlinesCanvas = canvas
  }

  drawStar(x, y, color, size) {
    const { context } = this

    context.save()

    const length = size

    context.translate(x, y)

    // initial offset rotation so our star is straight
    context.rotate((Math.PI * 1 / 10))

    context.beginPath()

    // make a point, 5 times
    for (let i = 5; i--;) {
      // draw line up
      context.lineTo(0, length)
      // move origin to current same location as pen
      context.translate(0, length)
      // rotate the drawing board
      context.rotate((Math.PI * 2 / 10))
      // draw line down
      context.lineTo(0, -length)
      // again, move origin to pen...
      context.translate(0, -length)
      // ...and rotate, ready for next arm
      context.rotate(-(Math.PI * 6 / 10))
    }

    // last line to connect things up
    context.lineTo(0, length)
    context.closePath()

    context.fillStyle = color
    context.strokeStyle = color

    // stroke the path, you could also .fill()
    context.stroke()
    context.fill()

    context.restore()
  }
}

export default MainCanvas
