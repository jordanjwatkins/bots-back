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
    this.menuCanvas = this.mainCanvas.imageFx.initOffCanvas({ key: 'pulserMenu', width: 100, height: 55, bgColor: '#000' })

    this.menuFields = {
      'spawn-1': { values: ['deploy'], value: 'deploy', rect: {} },
    }

    this.menuItems = [
      'spawn-1',
    ]

    this.yOffset = -200
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

        if (value === 'deploy') level.spawn(new Bird({ x:855, y: level.startY - 35, heavy: true, absorbed: 2 }))
        //if (value === 'heavy') level.spawn(new Bird({ x: 820, y: level.startY - 40, width: 40, height: 40, heavy: true }))

        this.bird.pulsesFiredCount += 1

        if (this.bird.pulsesFiredCount >= this.bird.maxChargeCount) return

        setTimeout(() => {
          field.hot = false
        }, 2000)
      }
    })
  }

  getTextRect(y) {
    const fontSize = this.fontSize
    const padding = this.padding

    const scale = this.mainCanvas.scaleInDom

    return { x: -10, y: (10 + (15 + padding * 2 + 5) * y) * scale - 10, width: 200, height: 15 + padding * 2 + 20 }
  }


  closeMenu() {
    return false
  }
}

export default PulserMenu
