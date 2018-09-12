//import dom from '../../libs/dom'
//import * as sounds from './sounds'
import Bird from './entities/bird'
import knote from '../../libs/knote'

class Dev {
  constructor(scene) {
    this.scene = scene
  }

  /*levelSelect() {
    const { scene } = this

    const levelSelectContainer = dom.make('<div class="level-select-container"></div>')

    Object.keys(scene.levels).forEach((levelName) => {
      const friendlyLevelName = levelName.split('').map((c, i) => {
        if (i === 0) c = c.toUpperCase()

        return (c.match(/[A-Z]/)) ? ` ${c}` : c
      }).join('')

      const levelSelectButton = dom.make(`<button class="level-select-button">${friendlyLevelName}</button>`)

      levelSelectContainer.appendChild(levelSelectButton)

      levelSelectButton.addEventListener('click', () => {
        scene.currentLevel = levelName

        scene.freshStart()
      })
    })

    scene.sceneContainer.appendChild(levelSelectContainer)

    this.soundSelect()
  }

  soundSelect() {
    const { scene } = this

    const soundSelectContainer = dom.make('<div class="sound-select-container"></div>')

    Object.keys(sounds).forEach((soundName) => {
      const soundSelectButton = dom.make(`<button class="level-select-button">${soundName}</button>`)

      soundSelectContainer.appendChild(soundSelectButton)

      soundSelectButton.addEventListener('click', () => {
        sounds[soundName]()
      })
    })

    scene.sceneContainer.appendChild(soundSelectContainer)
  }*/

  birdParticles() {
    this.bird = this.bird || new Bird({ flying: true })

    if (!this.birds) {
      this.birds = Array(100).fill(0).map(() => ({
        x: -1000 * Math.random(),
        y: 1700 - 1700 * Math.random(),
        vX: 2 + 5 * Math.random(),
        vY: -.1 * Math.random(),
      }))
    }

    this.scene.mainCanvas.context.save()

    //this.scene.mainCanvas.context.scale(0.5, 0.5)

    this.birds.forEach((bird) => {
      bird.x += bird.vX
      bird.y += bird.vY

      this.bird.x = bird.x
      this.bird.y = bird.y

      this.bird.draw(this.scene.mainCanvas)
    })

    this.scene.mainCanvas.context.restore()
  }

  portholeWipe() {
    this.birdIn = this.birdIn || new Bird({ x: 415 - 250, y: 415 + 70, speed: { x: 5, y: 2 }, flying: true })

    if (!this.note) {
      this.note = knote.makeNote('A5')

      this.oscillator = knote.playNote(this.note, { duration: 1 })
    }
    this.note = this.note || knote.makeNote('A5')

    if (!this.holeCanvas) {
      this.holeCanvas = document.createElement('canvas')

      this.holeCanvas.context = this.holeCanvas.getContext('2d')

      this.holeCanvas.width = this.scene.mainCanvas.width
      this.holeCanvas.height = this.scene.mainCanvas.height
    }

    const canvas = this.holeCanvas
    const { context } = this.holeCanvas

    if (this.radius === undefined) {
      this.radius = 780
    }

    if (this.radius - 14 >= 0) {
      this.radius -= 14
      this.oscillator.frequency.value -= 10
    } else {
      this.radius = 0
    }


    context.save()

    context.fillRect(0, 0, canvas.width, canvas.height)

    context.globalCompositeOperation = 'destination-out'

    context.beginPath()
    context.arc(415, 415, this.radius, 0, 2 * Math.PI)
    context.fill()

    context.restore()

    this.scene.mainCanvas.context.drawImage(canvas, 0, 0)

    this.updateBird = true

    if (this.updateBird) {
      this.birdIn.x += this.birdIn.speed.x
      this.birdIn.y -= this.birdIn.speed.y

      this.birdIn.draw(this.scene.mainCanvas)
    }
  }
}

export default Dev
