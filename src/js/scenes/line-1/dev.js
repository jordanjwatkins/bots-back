//import dom from '../../libs/dom'
//import * as sounds from './sounds'

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
}

export default Dev
