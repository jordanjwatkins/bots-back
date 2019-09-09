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

    context.imageSmoothingEnabled = false

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

      const { context } = this.initOffCanvas({ key: cacheKey, width: rect.width, height: rect.height })

      context.lineWidth = lineWidth
      context.strokeStyle = '#000'
      context.setLineDash([5, 3])

      context.beginPath()
      context.moveTo(lineWidth, lineWidth)
      context.lineTo(rect.width - lineWidth, lineWidth)
      context.lineTo(rect.width - lineWidth, rect.height - lineWidth)
      context.lineTo(lineWidth, rect.height - lineWidth)
      context.lineTo(lineWidth, lineWidth)
      context.closePath()
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

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      context.putImageData(this.applyNoise(imageData), 0, 0)
    }

    this.context.drawImage(this.offCanvases['c1'].canvas, offsetX, offsetY, this.canvas.height, this.canvas.height, 0, 0, this.canvas.width, this.canvas.height)
  }

  /*
  // cached version (slightly larger code)
  vignette2() {
    if (!this.offCanvases['v1']) {
      const { canvas, context } = this.initOffCanvas({ key: 'v1' })

      // Create gradient
      const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2)

      // Add colors
      gradient.addColorStop(0.9, 'rgba(0,0,0,0)')
      gradient.addColorStop(1, 'rgba(0,0,0,0.3)')

      // Fill with gradient
      context.fillStyle = gradient
      context.fillRect(0, 0, canvas.width, canvas.height)
    }

    const { canvas } = this.offCanvases['v1']

    this.context.drawImage(canvas, 0, 0, canvas.width, canvas.height, -80, 0, this.canvas.width + 160, this.canvas.height)
  }*/

  vignette() {
    // Create gradient
    const gradient = this.context.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 0,
      this.canvas.width / 2 - 10, this.canvas.height / 2,
      this.canvas.width / 2 + 20,
    )

    // Add colors
    gradient.addColorStop(0.9, 'rgba(0,0,0,0)')
    gradient.addColorStop(1, 'rgba(0,0,0,0.2)')

    // Fill with gradient
    this.context.fillStyle = gradient
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

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

    const { r, g, b, a } = fn({ imageData, x, y, pixelIndex: i  })

    pixels[i] = r
    pixels[i + 1] = g
    pixels[i + 2] = b
    pixels[i + 3] = a
  }
}

/*function makeNoiseMap(width, height, frames) {
  const map = []

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width / frames; j++) {
      map.push(255 - Math.random() * 100)
    }
  }

  return map
}*/

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
