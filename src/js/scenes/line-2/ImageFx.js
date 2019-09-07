class ImageFx {
  constructor(canvas, context) {
    this.canvas = canvas
    this.context = context

    this.offCanvases = {}
  }

  initOffCanvas({ key = 'c1', bgColor, width, height }) {
    const canvas = document.createElement('canvas')

    canvas.width = width || this.canvas.width + 50
    canvas.height = height || this.canvas.height + 50

    const context = canvas.getContext('2d')

    if (bgColor) {
      context.fillStyle = bgColor
      context.fillRect(0, 0, canvas.width, canvas.height)
    }

    this.offCanvases[key] = {
      canvas,
      context,
      drawRect: this.drawRect,
      centerX: canvas.width / 2,
      centerY: canvas.width / 2,
      clear: () => context.clearRect(0, 0, canvas.width, canvas.height),
      trace: this.trace,
      strokeRect: this.strokeRect,
    }

    return this.offCanvases[key]
  }

  drawRect({ x, y, color, width = 30, height = 60 }) {
    this.context.fillStyle = color || '#000'

    this.context.fillRect(x, y, width, height)
  }

  strokeRect({ x, y, color, width = 30, height = 60 }) {
    this.context.fillStyle = color || '#000'

    this.context.strokeRect(x, y, width, height)
  }

  trace() {
    this.strokeRect({ x: 0, y: 0, color: 'red', width: this.canvas.width, height: this.canvas.height })
  }

  // stroke rect instead of drawing path?
  drawSelectedRect(srcRect, offset = 2) {
    const cacheKey = `selectedRectW${srcRect.width}H${srcRect.height}O${offset}`

    if (!this.offCanvases[cacheKey]) {
      const lineWidth = 1

      const rect = {
        width: srcRect.width + (offset * 2) + (lineWidth * 2),
        height: srcRect.height + (offset * 2) + (lineWidth * 2),
      }

      const { canvas, context } = this.initOffCanvas({ key: cacheKey, width: rect.width, height: rect.height })

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
      l(rect.width - lineWidth, rect.height - lineWidth)
      l(lineWidth, rect.height - lineWidth)
      l(lineWidth, lineWidth)
      cp()
    }

    const { canvas, context } = this.offCanvases[cacheKey]

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.stroke()

    this.context.drawImage(canvas, 0, 0, canvas.width, canvas.height, srcRect.x - offset, srcRect.y - offset, canvas.width, canvas.height)

    context.lineDashOffset += 0.1
  }

  noise(offsetX, offsetY) {
    if (!this.offCanvases['c1']) {
      // the noise canvases are a bit larger than the destination canvas so they can be offset randomly and still fill the destination canvas
      const { canvas, context } = this.initOffCanvas({ key: 'c1', bgColor: '#FFF', width: this.canvas.width + 50, height: this.canvas.height + 50 })
      const { canvas: canvas2, context: context2 } = this.initOffCanvas({ key: 'c2', bgColor: '#000', width: this.canvas.width + 50, height: this.canvas.height + 50 })

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      const filtered = this.applyNoise(imageData)

      context.putImageData(filtered, 0, 0)

      const imageData2 = context2.getImageData(0, 0, canvas.width, canvas.height)
      const filtered2 = this.applyNoise(imageData2)

      context2.putImageData(filtered2, 0, 0)

      //const { canvas: canvas3, context: context3 } = this.initOffCanvas({ key: 'c3', bgColor: '#000' })
      //const imageData3 = this.context.getImageData(0, 0, canvas.width, canvas.height)
      //const filtered3 = this.hueShift(imageData3)

      //context3.putImageData(filtered3, 0, 0)
    }

    this.context.save()

    const alpha = 1
    const coarsenessX = 1
    const coarsenessY = 1
    const coarsenessHeight = this.canvas.height / coarsenessY
    const coarsenessWidth = this.canvas.height / coarsenessX

    this.context.globalAlpha = alpha

    this.context.drawImage(this.offCanvases['c1'].canvas, offsetX, offsetY, coarsenessWidth, coarsenessHeight, 0, 0, this.canvas.width, this.canvas.height)

    this.context.globalAlpha = alpha

    this.context.drawImage(this.offCanvases['c2'].canvas, offsetX, offsetY, coarsenessWidth, coarsenessHeight, 0, 0, this.canvas.width, this.canvas.height)

    //this.context.drawImage(this.offCanvases.c3.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, this.canvas.width, this.canvas.height)

    this.context.restore()
  }

  vignette() {
    if (!this.offCanvases['v1']) {
      const { canvas, context } = this.initOffCanvas({ key: 'v1' })

      // Transform to facilitate ellipse
      //context.setTransform(1, 0, 0, 0.6153846153846154, 0, 0)

      // Create gradient
      const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0.000, canvas.width / 2, canvas.height / 2, canvas.width / 2)

      // Add colors
      gradient.addColorStop(0.860, 'rgba(0, 0, 0, 0.000)')
      gradient.addColorStop(1.000, 'rgba(0, 0, 0, 0.267)')

      // Fill with gradient
      context.fillStyle = gradient
      context.fillRect(0, 0, canvas.width, canvas.height)
    }

    const { canvas } = this.offCanvases['v1']

    this.context.drawImage(canvas, 0, 0, canvas.width, canvas.height, -80, 0, this.canvas.width + 160, this.canvas.height)
  }

  /*hueShift(imageData, frames = 1) {
    eachPixel(imageData, ({ x, y, pixelIndex }) => {
      const pixels = imageData.data
      const i = pixelIndex

      const frameWidth = imageData.width / frames
      const frameX = (x % frameWidth)

      const p = Math.floor(frameX + y * frameWidth)

      const r = pixels[i]
      const g = pixels[i + 1]
      const b = pixels[i + 2]
      const a = pixels[i + 3]

      if (r > 100) imageData.data[xYToPixelIndex(x + 1, y - 3, imageData)] = imageData.data[xYToPixelIndex(x + 1, y - 3, imageData)] + r / 2
      if (g > 200) imageData.data[xYToPixelIndex(x - 5, y - 6, imageData) + 1] = imageData.data[xYToPixelIndex(x - 5, y - 6, imageData) + 1] + g / 2

      return {
        r,
        g,
        b,
        a,
      }
    })

    return imageData
  }*/

  applyNoise(imageData, frames = 1) {
    if (!this.noiseMap) this.noiseMap = makeBinaryNoiseMap(imageData.width, imageData.height, frames)

    // console.log(imageData.width);

    eachPixel(imageData, ({ x, y, pixelIndex }) => {
      const pixels = imageData.data
      const i = pixelIndex

      const frameWidth = imageData.width / frames
      const frameX = (x % frameWidth)

      const p = Math.floor(frameX + y * frameWidth)

      const r = pixels[i]
      const g = pixels[i + 1]
      const b = pixels[i + 2]
      const a = pixels[i + 3]

      let alpha = (this.noiseMap[p]) ? 35 : 0

      // some browsers (Edge) don't like invalid values
      if (alpha < 0) alpha = 0
      if (alpha > 255) alpha = 255

      alpha *= Math.random()

      return {
        r,
        g,
        b,
        a: alpha,
      }
    })

    return imageData
  }
}

function xYToPixelIndex(x, y, imageData) {
  return ((y * imageData.width) * 4) + (x * 4)
}

function pixelIndexToXY(pixelIndex, imageData) {
  return {
    x: (pixelIndex / 4) % imageData.width,
    y: Math.floor((pixelIndex / 4) / imageData.width),
  }
}

function eachPixel(imageData, fn) {
  const pixels = imageData.data

  let x
  let y

  for (let i = 0; i < pixels.length; i += 4) {
    x = (i / 4) % imageData.width
    y = Math.floor((i / 4) / imageData.width)

    const updatedPixel = fn({ imageData, x, y, pixelIndex: i })

    // eslint-disable-next-line no-continue
    if (!updatedPixel) continue

    const { r, g, b, a } = fn({ imageData, x, y, pixelIndex: i })

    pixels[i] = r
    pixels[i + 1] = g
    pixels[i + 2] = b
    pixels[i + 3] = a
  }
}

function makeNoiseMap(width, height, frames) {
  const map = []

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width / frames; j++) {
      map.push(255 - Math.random() * 100)
    }
  }

  return map
}

function makeBinaryNoiseMap(width, height, frames) {
  const map = []

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width / frames; j++) {
      if (Math.random() > 0.5) {
        map.push(1)
      } else {
        map.push(0)
      }
    }
  }

  return map
}

export default ImageFx
