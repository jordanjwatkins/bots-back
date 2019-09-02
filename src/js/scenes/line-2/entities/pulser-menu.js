import ImageFx from '../ImageFx'
import BirdMenu from './bird-menu'
import Bird from './bird';

class PulserMenu extends BirdMenu {
  constructor(bird) {
    super(bird)

    this.mainCanvas = bird.mainCanvas
    this.scene = bird.scene
    this.bird = bird
    this.imageFx = new ImageFx(bird.mainCanvas.canvas, bird.mainCanvas.context)
    this.menuCanvas = this.mainCanvas.imageFx.initOffCanvas({ key: 'pulserMenu', width: 100, height: 200, bgColor: '#000' })

    this.menuFields = {
      small: { values: ['small'], value: 'small', rect: this.getTextRect(0) },
      heavy: { values: ['heavy'], value: 'heavy', rect: this.getTextRect(1) },
    }

    this.menuItems = [
      'small',
      'heavy',
    ]
  }

  onMenuFieldClick(event) {
    const { scene } = this
    const { level } = scene

    this.menuItems.forEach((fieldKey) => {
      const field = this.menuFields[fieldKey]
      const { rect } = field

      if (this.isMenuFieldClick(event, rect) && !field.disabled) {
        const { value } = field

        console.log('click menu field', value)
        field.disabled = true

        if (value === 'small') level.spawn(new Bird({ x: 900 - 30 * Math.random(), y: level.groundY - 20 }))
        if (value === 'heavy') level.spawn(new Bird({ x: 900 - 80 * Math.random(), y: level.groundY - 40, width: 40, height: 40, heavy: true }))

        setTimeout(() => {
          field.disabled = false
        }, 2000)
      }
    })
  }

  drawMenuText(x, y, text, field) {
    const { context, canvas } = this.menuCanvas

    const fontSize = 18
    const padding = 10

    context.fillStyle = (field.disabled) ? '#999' : '#FFF'
    context.font = `${fontSize}px monospace`
    context.textAlign = 'center'

    this.totalWidth = 0

    if (Array.isArray(text)) {
      const textParts = text.join('// / //').split('//')

      textParts.forEach((textPart, index) => {
        if (!field.disabled) context.fillStyle = (textPart === field.value || textPart === ' / ') ? '#FFF' : '#333'
        context.fillText(textPart, 50 + this.totalWidth, (padding * y) + padding + fontSize / 2 + (fontSize * y))

        this.totalWidth += context.measureText(textPart).width
      })
    } else {
      context.fillText(text, padding, (padding * y * 2) + padding + fontSize / 2 + (fontSize * y))
    }

    return this.getTextRect(y, padding)
  }
}

export default PulserMenu
