import ImageFx from '../ImageFx'

class BirdMenu {
  constructor(bird) {
    this.mainCanvas = bird.mainCanvas
    this.bird = bird
    this.imageFx = new ImageFx(bird.mainCanvas.canvas, bird.mainCanvas.context)
    this.menuCanvas = this.mainCanvas.imageFx.initOffCanvas({ key: 'birdMenu', width: 200, height: 100, bgColor: '#000' })

    this.menuFields = {
      'go-stop': { values: ['go', 'stop'], value: 'go' },
    }

    this.menuItems = [
      'go-stop',
    ]

    this.addMenuFieldOnClick()
  }

  addMenuFieldOnClick() {
    this.onMenuFieldClickHandler = event => this.onMenuFieldClick(event)

    this.mainCanvas.canvas.addEventListener('click', this.onMenuFieldClickHandler)
  }

  removeMenuFieldOnClick() {
    this.mainCanvas.canvas.addEventListener('click', this.onMenuFieldClickHandler)
  }

  onMenuFieldClick(event) {
    this.menuItems.forEach((fieldKey) => {
      const field = this.menuFields[fieldKey]
      const { rect } = field

      if (this.isMenuFieldClick(event, rect) && !field.disabled) {
        field.value = (field.values[0] === field.value) ? field.values[1] : field.values[0]
      }
    })
  }

  isMenuClick(event) {
    if (!this.isMenuOpen) return false

    const { mainCanvas } = this

    const scale = mainCanvas.scaleInDom

    const { x, y } = this.getMenuXy()

    const clickRect = {
      x,
      y,
      height: this.menuCanvas.canvas.height,
      width: this.menuCanvas.canvas.width,
    }

    const debug2 = false

    if (debug2 && this.bird.width === 20) {
      this.debugRectFn = mainCanvas.clickAreaDebug(clickRect, 0)
    }


    return mainCanvas.isClickHit(event, clickRect, scale)
  }

  isMenuFieldClick(event, srcRect) {
    if (!this.isMenuOpen) return false

    const { mainCanvas } = this

    const scale = mainCanvas.scaleInDom

    const { x, y } = this.getMenuXy()

    const clickRect = {
      x: x + srcRect.x / scale,
      y: y + srcRect.y / scale,
      height: srcRect.height,
      width: srcRect.width,
    }

    const debug2 = false

    if (debug2) {
      this.debugRectFn = mainCanvas.clickAreaDebug(clickRect, 0)
    }

    return mainCanvas.isClickHit(event, clickRect, scale)
  }

  openMenu() {
    this.isMenuOpen = true
  }

  closeMenu() {
    this.isMenuOpen = false
  }

  drawMenu() {
    this.menuCanvas.context.fillStyle = '#000'
    this.menuCanvas.context.fillRect(0, 0, this.menuCanvas.canvas.width, this.menuCanvas.canvas.height)
    const { x, y } = this.getMenuXy()

    this.drawMenuItems()

    this.mainCanvas.context.drawImage(this.menuCanvas.canvas, x, y)
  }

  getMenuXy() {
    const { width } = this.menuCanvas.canvas

    let x = this.bird.x + this.bird.width / 2 - width / 2
    const y = this.bird.y - this.menuCanvas.canvas.height - 20
    const margin = 20

    const paddedRightX = x + width + margin

    if (paddedRightX > this.mainCanvas.canvas.width) {
      x -= (paddedRightX - this.mainCanvas.canvas.width)
    }

    if (x - margin < 0) {
      x = margin
    }

    return { x, y }
  }

  drawMenuItems() {
    this.menuItems.forEach((fieldKey, index) => {
      const field = this.menuFields[fieldKey]

      this.drawMenuItem(index, fieldKey, field)
    })
  }

  drawMenuItem(index, fieldKey, field) {
    const { values, value } = field

    field.rect = this.drawMenuText(0, index, value, field)
  }

  drawMenuText(x, y, text, field) {
    const { context, canvas } = this.menuCanvas

    const fontSize = 18
    const padding = 10

    context.fillStyle = (field.disabled) ? '#333' : '#FFF'
    context.font = `${fontSize}px monospace`
    context.fillText(text, padding, padding + fontSize / 2 + (fontSize * y))

    return this.getTextRect(y)
  }

  getTextRect(y) {
    const fontSize = 18

    return { x: 0, y: 0 + fontSize / 2 + (fontSize * y), width: 200, height: 20 }
  }
}

export default BirdMenu
