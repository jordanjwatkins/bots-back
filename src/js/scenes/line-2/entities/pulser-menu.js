import ImageFx from '../ImageFx'
import BirdMenu from './bird/bird-menu'
import Bird from './bird'

class PulserMenu extends BirdMenu {
  constructor(bird) {
    super(bird)

    this.mainCanvas = bird.mainCanvas
    this.scene = bird.scene
    this.bird = bird
    this.imageFx = new ImageFx(bird.mainCanvas.canvas, bird.mainCanvas.context)
    this.menuCanvas = this.mainCanvas.imageFx.initOffCanvas({ key: 'pulserMenu', width: 100, height: 60, bgColor: '#000' })

    this.menuFields = {
      'spawn-1': { values: ['spawn'], value: 'spawn', rect: {} },
      small: { values: ['small'], value: 'small', rect: {} },
      heavy: { values: ['heavy'], value: 'heavy', rect: {} },
      small2: { values: ['small'], value: 'small', rect: {} },
      heavy2: { values: ['heavy'], value: 'heavy', rect: {} },
      small3: { values: ['small'], value: 'small', rect: {} },
      small4: { values: ['small'], value: 'small', rect: {} },
    }

    this.menuItems = [
      'spawn-1',
      //'heavy',
      //'heavy2',
      //'small2',
      //'small3',
      //'small4',
    ]
  }

  onMenuFieldClick(event) {
    const { scene } = this
    const { level } = scene

    console.log('onMenuFieldClick');


    this.menuItems.forEach((fieldKey) => {
      const field = this.menuFields[fieldKey]
      const { rect } = field

      console.log('onMenuFieldClick', fieldKey, field, rect);

      if (this.isMenuFieldClick(event, rect) && !field.disabled) {
        const { value } = field

        console.log('click menu field', value)
        field.hot = true
        field.disabled = true
        //field.blocked = true

        if (value === 'small' || value === 'spawn') level.spawn(new Bird({ x: 830, y: level.startY - 25 }))
        if (value === 'heavy') level.spawn(new Bird({ x: 820, y: level.startY - 40, width: 40, height: 40, heavy: true }))

        this.bird.chargeCount -= 1

        setTimeout(() => {
          field.hot = false
        }, 2000)
      }
    })
  }

  drawMenuText(x, y, text, field) {
    const { context, canvas } = this.menuCanvas

    const fontSize = this.fontSize
    const padding = this.padding

    const lineHeight = 15

    context.fillStyle = (field.disabled) ? '#999' : '#FFF'
    context.font = `${fontSize}px monospace`
    context.textAlign = 'center'

    this.totalWidth = 0

    const scale = this.mainCanvas.scaleInDom

    if (Array.isArray(text)) {
      const textParts = text.join('// / //').split('//')

      textParts.forEach((textPart, index) => {
        if (!field.disabled) context.fillStyle = (textPart === field.value || textPart === ' / ') ? '#FFF' : '#333'

        context.fillText(textPart, 50 + this.totalWidth, 10 + padding + (padding * 2.2 * y) + lineHeight + (lineHeight * y))

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

    const scale = this.mainCanvas.scaleInDom

    //return { x: 0, y: (padding * 2 * y) + fontSize / 2 + (fontSize * y), width: 200, height: fontSize + padding / 2 }

    //console.log('y', y, 15 + (15 + padding * 2) * y);

    //console.log(fontSize, padding, scale, y);



    return { x: -10, y: (10 + (15 + padding * 2 + 5) * y) * scale, width: 200, height: 15 + padding * 2 }
  }

  getMenuXy() {
    const { width } = this.menuCanvas.canvas

    let x = this.bird.x + this.bird.width / 2 - width / 2
    const y = this.bird.y - this.menuCanvas.canvas.height - 200
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

  closeMenu() {
    console.log('pulser close');
    return false

  }
}

export default PulserMenu
