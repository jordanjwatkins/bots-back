class ImageFx {
  constructor(canvas, context) {
    this.canvas = canvas
    this.context = context

    this.offCanvases = {}
  }

  initOffCanvas({ key = 'c1', bgColor, width, height }) {
    const canvas = document.createElement('canvas')

    canvas.width = width || this.canvas.width
    canvas.height = height || this.canvas.height

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
    this.context.strokeStyle = color || '#000'

    this.context.strokeRect(x, y, width, height)
  }

  drawSelectedRect(srcRect, offset = 2, lineWidth = 1, color = '#fff', speed = 0.1, lineDash = [5, 3], auxContext) {
    const cacheKey = `k${srcRect.width}${srcRect.height}${offset}${color}`

    if (!this.offCanvases[cacheKey]) {
      const { context, canvas } = this.initOffCanvas({
        key: cacheKey,
        width: srcRect.width + Math.abs(offset) * 2 + lineWidth * 2,
        height: srcRect.height + Math.abs(offset) * 2 + lineWidth * 2,
      })

      context.lineWidth = lineWidth
      context.strokeStyle = color
      context.setLineDash(lineDash)
    }

    const { canvas, context } = this.offCanvases[cacheKey]

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.strokeRect(lineWidth / 2, lineWidth / 2, srcRect.width + lineWidth + offset, srcRect.height + lineWidth + offset)

    ;(auxContext || this.context).drawImage(
      canvas,
      0, 0, canvas.width, canvas.height,
      srcRect.x - offset / 2 - lineWidth,
      srcRect.y - offset / 2 - lineWidth,
      canvas.width, canvas.height,
    )

    context.lineDashOffset += speed
  }

  noise(offsetX, offsetY) {
    if (!this.offCanvases['c1']) {
      // the noise canvases are a bit larger than the destination canvas so they can be offset randomly and still fill the destination canvas
      const { canvas, context } = this.initOffCanvas({ key: 'c1', bgColor: '#FFF', width: this.canvas.width + 50, height: this.canvas.height + 50 })

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      context.putImageData(this.applyNoise(imageData), 0, 0)

      this.alpha = 0.3
    }

    this.alpha += this.staticV || 0

    if (this.alpha > 1) this.alpha = 1
    if (this.alpha < 0.1) this.alpha = 0.1

    this.context.globalAlpha = this.alpha

    this.context.drawImage(this.offCanvases['c1'].canvas, offsetX, offsetY, this.canvas.height, this.canvas.height, 0, 0, this.canvas.width, this.canvas.height)

    this.context.globalAlpha = 1
  }

  static(v) {
    this.staticV = v || 0.02
  }

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

  applyNoise(imageData) {
    const noiseMap = makeBinaryNoiseMap(imageData.width, imageData.height)

    for (let i = 0; i < imageData.data.length; i += 4) {
      let alpha = (noiseMap[Math.floor(i / 4)]) ? 255 : 0

      alpha *= Math.random()

      imageData.data[i] = alpha
      imageData.data[i + 1] = alpha
      imageData.data[i + 2] = alpha
    }

    return imageData
  }
}

function makeBinaryNoiseMap(width, height) {
  const map = []

  for (let i = 0; i < width * height; i++) {
    map.push(Math.round(Math.random()))
  }

  return map
}

export default ImageFx
