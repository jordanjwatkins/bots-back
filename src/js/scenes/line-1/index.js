import dom from '../../libs/dom'
import GameLoop from '../../libs/GameLoop'
import MainCanvas from './Canvas'
import update from './update'

import Cloud from './entities/cloud'
import Ground from './entities/ground'
import Pulser from './entities/pulser'
import WinSplash from './entities/win-splash'

import levels from './entities/levels'
import Storage from './storage'
import AmericaOfflineTitle from './entities/america-offline-title'

import * as sounds from './sounds'
import LevelSelect from './entities/level-select'

class Line1Scene {
  constructor() {
    this.debug = false

    this.mainCanvas = new MainCanvas({ width: 1000, height: 600 })

    this.storage = new Storage('OfflineDevLine1')

    this.levels = levels(this)

    //this.showedTitle = true

    this.initializeDom()

    // load/save current level
    this.currentLevel = this.currentLevel

    this.freshStart()

    this.attachEvents()

    // start game loop last
    this.gameLoop = new GameLoop((delta) => {
      update(this, delta)
    })
  }

  get currentLevel() {
    return this.storage.state.currentLevel
  }

  set currentLevel(currentLevel) {
    this.storage.state.currentLevel = currentLevel
    this.storage.state.levels[currentLevel] = this.storage.state.levels[currentLevel] || {}
    this.storage.save()

    this.findNextLevel()
  }

  get bestScoreForLevel() {
    return this.getBestScoreForLevel(this.currentLevel)
  }

  set bestScoreForLevel(bestScore) {
    this.storage.state.levels[this.currentLevel].bestScore = bestScore
    this.storage.save()
  }

  get starScore() {
    const starThresholds = (this.currentLevel.indexOf('Absorber') > -1) ?
      this.level.absorberStarThresholds :
      this.level.starThresholds

    return starThresholds.filter(threshold => (this.pulser.pulsesFiredCount <= threshold)).length
  }

  getBestScoreForLevel(levelName) {
    const level = (levelName) ?
      this.storage.state.levels[levelName] :
      this.storage.state.levels[this.currentLevel]

    return level.bestScore || 0
  }

  findNextLevel() {
    const levelKeys = Object.keys(this.levels)

    levelKeys.some((levelName, index) => {
      if (this.currentLevel === levelName) {
        this.nextLevel = (index + 1 >= this.levels.length - 1) ?
          levelKeys[0] :
          levelKeys[index + 1]

        return true
      }

      return false
    })
  }

  attachEvents() {
    this.mainCanvas.canvas.addEventListener('click', this.onClick)
  }

  removeEvents() {
    this.mainCanvas.canvas.removeEventListener('click', this.onClick)
  }

  initLevel() {
    const savedLevel = this.currentLevel

    this.cleanupEntities()

    if (savedLevel && this.levels[savedLevel]) {
      this.level = this.levels[savedLevel]()

      console.log('Current level: ', savedLevel) // eslint-disable-line no-console
      console.log('Personal best: ', this.bestScoreForLevel) // eslint-disable-line no-console

      const optimalScore = (savedLevel.indexOf('Absorber') > -1) ?
        this.level.absorberOptimalPulseCount :
        this.level.optimalPulseCount

      console.log('Best possible score for level: ', optimalScore) // eslint-disable-line no-console
    } else {
      console.log(`Failed to load level "${savedLevel}`) // eslint-disable-line no-console
    }
  }

  cleanupEntities() {
    if (this.entities) {
      this.entities.forEach((entity) => {
        if (entity.destroy) entity.destroy(this)
      })
    }
  }

  onClick = (event) => {
    if (this.debug) console.log('canvas click', this.mainCanvas.clickCoords(event)) // eslint-disable-line no-console

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
        this.currentLevel = levelName

        this.freshStart()
      })
    })

    this.initSoundSelect()
  }

  initSoundSelect() {
    this.soundSelectContainer = dom.make('<div class="sound-select-container"></div>')
    this.sceneContainer.appendChild(this.soundSelectContainer)

    Object.keys(sounds).forEach((soundName) => {
      const soundSelectButton = dom.make(`<button class="level-select-button">${soundName}</button>`)

      this.soundSelectContainer.appendChild(soundSelectButton)

      soundSelectButton.addEventListener('click', () => {
        sounds[soundName]()
      })
    })
  }

  initEntities() {
    this.entities = this.level.entities
    this.birdCount = this.level.birdCount

    let cloudSize = 50 + 60 * Math.random()

    this.level.entities.unshift(new Cloud({
      x: Math.round(-100 + ((this.mainCanvas.width / 3) * Math.random())),
      y: Math.round(150 + (200 * Math.random())),
      width: cloudSize,
      height: cloudSize * 0.3,
    }))

    cloudSize = 50 + 60 * Math.random()

    this.level.entities.unshift(new Cloud({
      x: Math.round(400 + ((this.mainCanvas.width / 2) * Math.random())),
      y: Math.round(350 + (150 * Math.random())),
      width: cloudSize,
      height: cloudSize * 0.3,
      speedX: 0.5 - 0.2 * Math.random(),
    }))

    this.level.entities.unshift(new Ground({
      width: this.mainCanvas.width,
      height: 50,
      y: this.mainCanvas.height - 50,
      speedX: 0.5 - 0.2 * Math.random(),
    }))

    this.pulser = new Pulser({ x: 100, y: 500 })
    this.level.entities.unshift(this.pulser)

    this.lines = this.lines || this.entities.filter(entity => entity.constructor.name === 'Line')

    if (!this.titleScreen && !this.showedTitle) {
      this.showedTitle = true
      this.titleScreen = new AmericaOfflineTitle(this)
      this.level.entities.push(this.titleScreen)
    }

    this.levelSelect = new LevelSelect(this)
    this.level.entities.push(this.levelSelect)
  }

  freshStart() {
    this.mainCanvas.context.globalAlpha = 1.0

    this.initLevel()
    this.initEntities()

    this.allFlying = false
    this.gameOver = false
    this.fadingOut = false
  }

  startNextLevel() {
    this.currentLevel = this.nextLevel

    this.freshStart()
  }

  winSplash() {
    this.entities.push(new WinSplash(this))
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
