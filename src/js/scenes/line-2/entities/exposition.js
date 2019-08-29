import * as sounds from '../sounds'
import Pulser from './pulser'

class Exposition {
  constructor(scene, endTitle = false) {
    const { mainCanvas } = scene

    this.width = mainCanvas.width
    this.height = mainCanvas.height

    this.x = 0
    this.y = 0

    this.color = '#000000'

    this.z = 4

    this.opacity = 1

    this.scene = scene

    this.endTitle = endTitle

    this.textGroup = (endTitle) ?
      5 :
      1

    this.init()
  }

  init() {
    const { storage } = this.scene

    const mX = (this.endTitle) ? 250 : 130

    if (this.endTitle) {
      this.totalStarsEarned = Object.values(storage.state.levels).reduce((starScore, level) => (
        starScore + level.starScore
      ), 0)

      if (this.totalStarsEarned < 1) {
        this.endingRating = 'WORST OF ALL'
      } else if (this.totalStarsEarned >= 1 && this.totalStarsEarned < 11) {
        this.endingRating = 'TERRIBLE'
      } else if (this.totalStarsEarned >= 11 && this.totalStarsEarned < 22) {
        this.endingRating = 'DECENT'
      } else if (this.totalStarsEarned >= 22 && this.totalStarsEarned < 29) {
        this.endingRating = 'GOOD'
      } else if (this.totalStarsEarned >= 29 && this.totalStarsEarned < 33) {
        this.endingRating = 'AWESOME'
      } else {
        this.endingRating = 'ULTIMATE'
      }
    }

    this.mayor = {
      x: mX,
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

    // this.textGroup = 1

    /* eslint-disable max-len */
    this.text1 = [
      'Hello, fellow citizens. As you all know, we are facing a serious crisis.',
      'As your duly, and entirely legitimately, elected mayor,',
      "I'd like to reassure you all and put your minds at ease...",
      "So... we have a plan, and I think it's a pretty good one.",
    ]

    this.text2 = [
      "A young, lady scientist... sorry, a 'just scientist', has come up with a device.",
      'The device should let us, gently, deal with this fowl invasion.',
      "Naturally, we'll stay carefully within our beloved...",
      "...and strictly enforced, animals' rights laws.",
    ]

    this.text3 = [
      "Without going too deep into detail, here's the plan:",
      "We've put together a top notch team.",
      "They'll use the device to 'tickle' the birds,",
      'off of the lines leading to a local radio tower,',
      'which will allow us to broadcast a powerful,',
      "but also gentle, 'tickle' over a wide area.",
      "The 'Mass Tickle' will, ideally, restore our beloved internet",
      'and reconnect us with the outside world.',
    ]

    this.text5 = [
      `Congratulations! You got the ${this.endingRating} ending.`,
      'Things might be OK now?',
      'Jordan J Watkins created this game for js13k 2018.',
      "I think it's pretty good.",
      'Fin',
    ]
  }

  destroy() {
    this.detachEvents()

    this.expositionCanceler()

    this.scene.exposition = null

    this.scene.entities = this.scene.entities.filter(entity => entity !== this)
  }

  attachEvents() {
    const { canvas } = this.scene.mainCanvas

    this.eventsAttached = true

    canvas.addEventListener('click', this.onClick)
  }

  detachEvents() {
    const { canvas } = this.scene.mainCanvas

    canvas.removeEventListener('click', this.onClick)
  }

  onClick = () => {
    if (!this.scene.titleScreen) {
      this.destroy()
    }
  }

  drawText(text, x, y) {
    const { mainCanvas } = this.scene
    const { context } = mainCanvas

    context.save()

    context.textAlign = 'left'
    context.fillStyle = '#ffffff'
    context.font = '18px monospace'

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
        } else if (!this.endTitle) {
          this.textLines = 1
          this.textGroup += 1
        }

        clearTimeout(this.textTimeout)
        this.textTimeout = null
      }, 2000)
    }

    if (this.textGroup === 2) {
      if (!this.drawPulser) {
        setTimeout(() => {
          this.drawPulser = true
        }, 1200)
      }

      if (this.drawPulser) {
        this.pulser = this.pulser || new Pulser({ x: 825, y: 200, chargeCount: 0, chargeSpeed: 1 })

        this.pulser.update(this.scene)
      }
    }

    if (this.textGroup === 3) {
      // squad
      if (!this.drawSquad) {
        setTimeout(() => {
          this.drawSquad = true
        }, 2600)
      }

      if (!this.drawTower) {
        setTimeout(() => {
          this.drawTower = true
        }, 6600)
      }

      if (this.drawSquad) {
        this.scene.mainCanvas.drawThing({
          x: 820, y: 200, width: 48 * 4, height: 20 * 4, frameWidth: 24, frameHeight: 10, frame: 0, frameOffset: 1, spriteName: 'spritesheet',
        })
      }

      // tower
      if (this.drawTower) {
        this.scene.mainCanvas.drawThing({
          x: 865, y: 380, width: 13 * 11, height: 18 * 11, frameWidth: 13, frameHeight: 18, frame: 0, frameOffset: 36, spriteName: 'spritesheet',
        })
      }
    }

    const tX = (this.endTitle) ? 350 : 210

    for (let i = 0; i < this.textLines; i++) {
      this.drawText(this[`text${this.textGroup}`][i], tX, 160 + (i * 40))
    }
  }

  drawTotalStarScore() {
    const { mainCanvas, levels } = this.scene

    const levelCount = Object.keys(levels).length

    mainCanvas.context.fillStyle = '#fff'
    mainCanvas.context.textAlign = 'left'
    mainCanvas.context.font = '20px monospace'

    mainCanvas.context.fillText(`${this.totalStarsEarned} / ${levelCount * 3}`, mainCanvas.width / 2 - 30, 70)

    mainCanvas.drawStar(mainCanvas.width / 2 - 55, 65, '#fff', 8)
  }

  update() {
    if (this.scene.titleScreen) return

    if (!this.eventsAttached) this.attachEvents()

    if (!this.playedSound) {
      this.playedSound = true

      this.expositionCanceler = sounds.exposition(this.endTitle)
    }

    this.drawBackground()
    this.drawMayor()

    if (this.endTitle) {
      this.drawTotalStarScore()
    }
  }
}

export default Exposition
