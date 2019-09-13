//import images from './images'
import ImageFx from './ImageFx'

class MainCanvas {
  constructor({ width = 200, height = 200 } = {}) {
    this.canvas = document.createElement('canvas')

    this.canvas.width = width
    this.canvas.height = height

    this.context = this.canvas.getContext('2d')

    //this.canvas.style.backgroundColor = '#639bff'

    this.canvas.style.backgroundColor = '#1d0b15'

    this.context.imageSmoothingEnabled = false

    this.imageFx = new ImageFx(this.canvas, this.context)
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
    const boundingRect = this.canvas.getBoundingClientRect()

    // Support for Edge
    if (Number.isFinite(boundingRect.left)) {

      const { left, top, width, height } = boundingRect

      return {
        x: left,
        y: top,
        width,
        height,
      }
    }

    return boundingRect
  }

  /*set opacity(value) {
    if (value < 0) value = 0
    if (value > 1) value = 1

    this.context.globalAlpha = value
  }*/

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawRect({ x, y, color, width = 30, height = 60 }) {
    this.context.fillStyle = color || '#000'

    this.context.fillRect(x, y, width, height)
  }

  drawVignette() {
    this.imageFx.vignette()
  }

  drawNoise(alpha) {
    this.noiseCount = this.noiseCount || 1
    //this.noiseSpeed = 5 // # of renders per noise update

    // don't update the noise every frame
    if (this.noiseCount > 5) {
      // randomize render offset to make one frame of noise seem like several
      //this.noiseOffsetX = Math.round(Math.random() * 50)
      //this.noiseOffsetY = Math.round(Math.random() * 50)

      this.noiseCount = 0
    }

    this.imageFx.noise(Math.round(Math.random() * 50), Math.round(Math.random() * 50), alpha)

    this.noiseCount += 1
  }

  isClickHit(event, clickRect, scale = 1) {
    const canvasRect = this.boundingRect

    return (
      event.pageY < canvasRect.y + clickRect.y * scale + clickRect.height * scale &&
      event.pageY > canvasRect.y + clickRect.y * scale &&
      event.pageX < canvasRect.x + clickRect.x * scale + clickRect.width * scale &&
      event.pageX > canvasRect.x + clickRect.x * scale
    )
  }

  /*clickCoords = (event) => {
    const canvasRect = this.boundingRect

    return (this.debug) ?
      {
        x: Math.round(event.pageX - canvasRect.x),
        y: Math.round(event.pageY - canvasRect.y),
        unscaledX: Math.round((event.pageX - canvasRect.x) / this.scaleInDom),
        unscaledY: Math.round((event.pageY - canvasRect.y) / this.scaleInDom),
      } :
      {
        x: event.pageX - canvasRect.x,
        y: event.pageY - canvasRect.y,
        unscaledX: (event.pageX - canvasRect.x) / this.scaleInDom,
        unscaledY: (event.pageY - canvasRect.y) / this.scaleInDom,
      }
  }*/

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

  drawSelectedRect(...args) {
    this.imageFx.drawSelectedRect(...args)
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

  drawRollingLineReversed() {
    const { canvas, context } = this

    const vh = canvas.height
    const vw = canvas.width

    context.save()

    context.globalAlpha = 0.05

    context.lineWidth = vh / 8
    context.strokeStyle = '#FFF'

    if (this.rollY2 === undefined) this.rollY2 = vh + 200

    if (this.rollY2 < -200) this.rollY2 = vh + 200

    this.rollY2 -= 10

    const y = this.rollY2

    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(vw, y)
    context.moveTo(0, y + vh / 4)
    context.lineTo(vw, y + vh / 4)
    context.closePath()

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

    context.save()

    context.setTransform(1, 0, 0, 1, 0, 0)
    context.scale(0.5, 0.5)

    context.globalAlpha = 0.2

    context.lineWidth = '0.1'
    context.strokeStyle = '#000'

    this.scanlines = this.scanlines || this.makeScanlines(canvas.height, canvas.width)

    this.scanlines.forEach((line) => {
      context.lineWidth = line.width

      context.beginPath()

      context.moveTo(line.start[0], line.start[1])
      context.lineTo(line.end[0], line.end[1])
      context.closePath()

      context.stroke()
    })

    context.restore()

    this.scanlinesCanvas = canvas
  }

  drawTriangleFromPoints(points, scale, color = '#FFF') {
    const { context } = this

    this.globalAlpha = this.globalAlpha || 0.2

    if (Math.random() > 0.2) this.globalAlpha = '0.2'
    if (Math.random() > 0.9) this.globalAlpha = '0.25'
    if (Math.random() > 0.9) this.globalAlpha = '0.3'

    context.save()

    context.globalAlpha = this.globalAlpha

    const [{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }] = points

    context.lineWidth = 3
    context.strokeStyle = color
    context.fillStyle = color

    context.beginPath()
    context.moveTo(x1, y1)
    context.lineTo(x2, y2)
    context.lineTo(x3, y3)
    context.closePath()

    //context.stroke()
    context.fill()

    context.restore()
  }
}

export default MainCanvas
