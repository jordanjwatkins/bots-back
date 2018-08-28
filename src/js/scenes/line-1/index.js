import dom from '../../libs/dom'
import GameLoop from '../../libs/GameLoop'
import MainCanvas from './Canvas'
import update from './update'

import Cloud from './entities/cloud'
import Ground from './entities/ground'
import Pulser from './entities/pulser'

import levels from './entities/levels'

class Line1Scene {
  constructor() {
    this.mainCanvas = new MainCanvas({ width: 1000, height: 600 })

    this.levels = levels(this)

    this.initializeDom()

    this.initLevel()

    this.freshStart()

    this.attachEvents()

    //jump1()

    // start game loop last
    this.gameLoop = new GameLoop((delta) => {
      update(this, delta)
    })
  }

  attachEvents() {
    this.onClick = this.onClick.bind(this)

    this.mainCanvas.canvas.addEventListener('click', this.onClick)
  }

  removeEvents() {
    this.mainCanvas.canvas.removeEventListener('click', this.onClick)
  }

  initLevel() {
    const savedLevel = localStorage.getItem('currentLevel')

    if (savedLevel && this.levels[savedLevel]) {
      this.level = this.levels[savedLevel]()
    } else {
      this.level = this.levels.oneLineTwoSimple()
    }
  }

  onClick(event) {
    this.entities.forEach((entity) => {
      if (this.isLineClick(event, entity)) {
        this.pulser.firePulse(this, entity)
      }
    })
  }

  isLineClick(event, entity) {
    return (
      entity.constructor.name === 'Line' &&
      event.pageY < entity.y + 50 + entity.height &&
      event.pageY > entity.y - 50
    )
  }

  initializeDom() {
    this.canvasContainer = dom.make('<div class="canvas-container"></div>')
    this.canvasContainer.appendChild(this.mainCanvas.canvas)

    this.sceneContainer = dom.make('<div class="scene-container"></div>')
    this.sceneContainer.appendChild(this.canvasContainer)

    this.initLevelSelect()

    document.body.appendChild(this.sceneContainer)

    setTimeout(() => {
      document.body.classList.add('show-scene')
    }, 300)
  }

  initLevelSelect() {
    this.levelSelectContainer = dom.make('<div class="level-select-container"></div>')
    this.sceneContainer.appendChild(this.levelSelectContainer)

    Object.keys(this.levels).forEach((levelName) => {
      const friendlyLevelName = levelName.split('').map((c, i) => {
        if (i === 0) c = c.toUpperCase()

        return (c.match(/[A-Z]/)) ? ` ${c}` : c
      }).join('')

      const levelSelectButton = dom.make(`<button class="level-select-button">${friendlyLevelName}</button>`)

      this.levelSelectContainer.appendChild(levelSelectButton)

      levelSelectButton.addEventListener('click', () => {
        this.level = this.levels[levelName]()

        localStorage.setItem('currentLevel', levelName)

        this.freshStart()
      })
    })
  }

  initEntities() {
    this.entities = this.level.entities
    this.birdCount = this.level.birdCount

    this.level.entities.unshift(new Cloud({ x: Math.round(100 + (this.mainCanvas.width / 2 - 100) * Math.random()),  y: Math.round(50 + 200 * Math.random()) }))
    this.level.entities.unshift(new Cloud({ x: Math.round(400 + (this.mainCanvas.width - 400) * Math.random()),  y: Math.round(150 + 300 * Math.random()) }))

    this.level.entities.unshift(new Ground({ width: this.mainCanvas.width, height: 50, y: this.mainCanvas.height - 50 }))

    this.pulser = new Pulser({ x: 100, y: 500 })
    this.level.entities.unshift(this.pulser)

    this.lines = this.lines || this.entities.filter(entity => entity.constructor.name === 'Line')
  }

  freshStart() {
    this.initEntities()

    this.allFlying = false
    this.gameOver = false
    this.fadingOut = false
  }

  end() {
    this.gameLoop.stop()

    document.body.classList.remove('show-scene')

    setTimeout(() => {
      document.body.classList.add('end-title')
    }, 1200)
  }
}

export default Line1Scene
