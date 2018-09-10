import * as sounds from '../sounds'

class AmericaOfflineTitle {
  constructor(scene) {
    const { mainCanvas } = scene

    this.width = mainCanvas.width
    this.height = mainCanvas.height

    this.x = 0
    this.y = 0

    this.color = '#000000'

    this.z = 4

    this.opacity = 1

    this.scene = scene

    this.init()

    this.attachEvents()
  }

  init() {
    this.mayor = {
      x: 110,
      y: 200,
      frameWidth: 7,
      frameHeight: 10,
      width: 70,
      height: 100,
      spriteName: 'spritesheet',
      frameOffset: 27,
    }

    setTimeout(() => {
      this.mayorShowing = true
    }, 1000)

    this.textGroup = 1

    /* eslint-disable max-len */
    this.text1 = [
      'Hello, fellow citizens. As you all know, we are facing a serious crisis.',
      "As your duly and entirely legitimately elected mayor, I'd like to reassure you all and put your minds at ease...",
      "So... we have a plan. I think it's pretty good.",
    ]

    this.text2 = [
      "A young, lady scientist... er, sorry... notes... a yo-- ... a 'just scientist' has come up with a device.",
      'The device should let us, gently, deal with this fowl invasion.',
      "It goes without saying, we'll stay carefully within our beloved (and strictly enforced animal rights laws).",
    ]

    this.text3 = [
      "I won't go into too many details now, but, to boil it down, we've put together a top notch team.",
      "They'll be using the device to 'tickle' the birds off the lines leading to a local radio tower.",
      "Ultimately, this will allow us to broadcast a powerful, but gentle, 'tickle' over a wide area.",
      "That 'Mass Tickle' should, ideally, restore our beloved internet and reconnect us with the outside world.",
    ]
  }

  destroy() {
    this.detachEvents()

    this.scene.exposition = null

    this.scene.entities = this.scene.entities.filter(entity => entity !== this)
  }

  attachEvents() {
    const { canvas } = this.scene.mainCanvas

    canvas.addEventListener('click', this.onClick)
  }

  detachEvents() {
    const { canvas } = this.scene.mainCanvas

    canvas.removeEventListener('click', this.onClick)
  }

  onClick = () => {

  }

  drawText(text, x, y) {
    const { mainCanvas } = this.scene
    const { context } = mainCanvas

    context.textAlign = 'left'
    context.fillStyle = '#ffffff'
    context.font = '16px fantasy'

    context.fillText(text, x, y)

    context.restore()
  }

  drawBackground() {
    const { mainCanvas } = this.scene
    const { context } = mainCanvas

    context.save()

    context.globalAlpha = 1

    mainCanvas.drawRect(this)

    context.restore()
  }

  drawMayor() {
    const { mainCanvas } = this.scene

    if (this.mayorShowing) {
      mainCanvas.drawThing(this.mayor)
    }

    this.textLines = this.textLines || 0

    if (!this[`text${this.textGroup}`]) {
      this.destroy()

      return
    }

    if (!this.textTimeout) {
      this.textTimeout = setTimeout(() => {
        if (!this[`text${this.textGroup}`]) return

        if (this.textLines < this[`text${this.textGroup}`].length) {
          this.textLines += 1
        } else {
          this.textLines = 1
          this.textGroup += 1
        }

        clearTimeout(this.textTimeout)
        this.textTimeout = null
      }, 800)
    }

    if (this.textGroup === 3) {
      this.scene.mainCanvas.drawThing({
        x: 325, y: 513, width: 48 * 4, height: 20 * 4, frameWidth: 24, frameHeight: 10, frame: 0, frameOffset: 1, spriteName: 'spritesheet',
      })

      // tower
      this.scene.mainCanvas.drawThing({
        x: 625, y: 453, width: 13 * 11, height: 18 * 11, frameWidth: 13, frameHeight: 18, frame: 0, frameOffset: 36, spriteName: 'spritesheet',
      })
    }

    for (let i = 0; i < this.textLines; i++) {
      this.drawText(this[`text${this.textGroup}`][i], 210, 160 + (i * 40))
    }
  }

  flicker(offOpacity, onOpacity, toggleRate = 1) {
    const { context } = this.scene.mainCanvas

    if (Math.sin(new Date() / (100 * toggleRate)) > 0) {
      context.globalAlpha = offOpacity
    } else {
      context.globalAlpha = onOpacity
    }
  }

  update() {
    if (this.scene.titleScreen) return

    if (!this.playedSound) {
      this.playedSound = true

      sounds.exposition()
    }

    this.drawBackground()
    this.drawMayor()
  }
}

export default AmericaOfflineTitle
