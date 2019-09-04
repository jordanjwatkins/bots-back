import ImageFx from '../../ImageFx'

class BirdMenu {
  constructor(bird) {
    this.mainCanvas = bird.mainCanvas
    this.bird = bird
    this.imageFx = new ImageFx(bird.mainCanvas.canvas, bird.mainCanvas.context)
    this.menuCanvas = this.mainCanvas.imageFx.initOffCanvas({ key: 'birdMenu', width: 200, height: 100, bgColor: '#000' })

    this.menuFields = {
      'stop-go': { values: ['stop', 'go'], value: 'stop', rect: {} },
      'slow-fast': { values: ['slow', 'fast'], value: 'slow', rect: {} },
      'climb-dont': { values: ['climb', 'dont'], value: 'climb ', rect: {} },
    }

    this.menuItems = [
      'stop-go',
      'slow-fast',
    ]

    if (this.bird.bad) {
      this.menuFields['stop-go'].value = 'go'
    }

    this.addMenuFieldOnClick()

    if (!this.bird.bad && this.bird.type === 'bird' && !this.bird.preSpawned) {
      setTimeout(() => {
        this.openMenu()
        this.mainCanvas.selected = this.bird
        this.bird.selected = true
      }, 800)
    }

    this.fontSize = 18
    this.padding = 7
  }

  destroy() {
    this.removeMenuFieldOnClick()
  }

  getField(fieldKey) {
    if (!this.menuFields[fieldKey]) return

    return this.menuFields[fieldKey]
  }

  addMenuFieldOnClick() {
    this.onMenuFieldClickHandler = event => this.onMenuFieldClick(event)

    this.mainCanvas.canvas.addEventListener('click', this.onMenuFieldClickHandler)
  }

  removeMenuFieldOnClick() {
    this.mainCanvas.canvas.removeEventListener('click', this.onMenuFieldClickHandler)
  }

  onMenuFieldClick(event) {
    this.menuItems.forEach((fieldKey) => {
      const field = this.menuFields[fieldKey]
      const { rect } = field

      if (this.isMenuFieldClick(event, rect) && !field.disabled) {
        console.log('click menu field', field.value)

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
      this.debugRectFn = mainCanvas.clickAreaDebug(clickRect, 10)
    }


    return mainCanvas.isClickHit(event, clickRect, scale)
  }

  isMenuFieldClick(event, srcRect) {
    if (!this.isMenuOpen) return false

    const { mainCanvas } = this

    const scale = mainCanvas.scaleInDom

    const { x, y } = this.getMenuXy()

    console.log(scale);


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

    field.rect = this.drawMenuText(0, index, values, field)
  }

  drawMenuText(x, y, text, field) {
    const { context, canvas } = this.menuCanvas

    const { fontSize, padding } = this

    context.fillStyle = (field.disabled) ? '#999' : '#FFF'
    context.font = `${fontSize}px monospace`

    this.totalWidth = 0

    if (Array.isArray(text)) {
      const textParts = text.join('// - //').split('//')

      textParts.forEach((textPart, index) => {
        if (!field.disabled) context.fillStyle = (textPart === field.value || textPart === ' / ') ? '#FFF' : '#999'
        //context.fillText(textPart, padding + this.totalWidth, padding + (padding * 2 * y) + fontSize + (fontSize * y))

        //context.fillText(textPart, padding + this.totalWidth, padding + (padding * 2 * y) + 15 + (15 * y))

        context.fillText(textPart, 20 + padding + this.totalWidth, 10 + padding + (padding * 2.2 * y) + 15 + (15 * y))

        this.totalWidth += context.measureText(textPart).width
      })
    } else {
      //context.fillText(text, padding, (padding * y * 2) + padding + fontSize / 2 + (fontSize * y))
    }

    return this.getTextRect(y)
  }

  getTextRect(y) {
    const fontSize = this.fontSize
    const padding = this.padding

    //return { x: 0, y: (padding * 2 * y) + fontSize / 2 + (fontSize * y), width: 200, height: fontSize + padding / 2 }

   // return { x: 0, y: (15 + padding * 2) * y + 15 * y - y * 2, width: 220, height: 15 + padding * 2 }

   return { x: -10, y: 10 + (15 + padding * 3 + 7) * y, width: this.menuCanvas.canvas.width, height: 15 + padding * 2 }
  }
}

export default BirdMenu
