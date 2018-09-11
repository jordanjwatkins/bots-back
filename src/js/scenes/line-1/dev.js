import dom from '../../libs/dom'
import * as sounds from './sounds'
import Bird from './entities/bird'

class Dev {
  constructor(scene) {
    this.scene = scene
  }

  levelSelect() {
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
  }

  birdParticles() {
    this.bird = this.bird || new Bird({ flying: true })

    if (!this.birds) {
      this.birds = Array(300).fill(0).map(() => ({
        x: -1000 * Math.random(),
        y: 1700 - 1700 * Math.random(),
        vX: 3 * Math.random(),
        vY: -1 * Math.random(),
      }))
    }

    this.scene.mainCanvas.context.save()

    this.scene.mainCanvas.context.scale(0.5, 0.5)

    this.birds.forEach((bird) => {
      bird.x += bird.vX
      bird.y += bird.vY

      this.bird.x = bird.x
      this.bird.y = bird.y

      this.bird.draw(this.scene.mainCanvas)
    })

    this.scene.mainCanvas.context.restore()
  }
}

export default Dev
