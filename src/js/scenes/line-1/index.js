import dom from '../../libs/dom'
import GameLoop from '../../libs/GameLoop'

import MainCanvas from './Canvas'
import update from './update'
import Storage from './storage'

import Cloud from './entities/cloud'
import Ground from './entities/ground'
import Pulser from './entities/pulser'
import WinSplash from './entities/win-splash'
import LevelSelect from './entities/level-select'
import AmericaOfflineTitle from './entities/america-offline-title'
import Exposition from './entities/exposition'
import levels from './entities/levels'

import Dev from './dev'

class Line1Scene {
  constructor() {
    this.dev = new Dev(this)

    this.debug = false

    this.mainCanvas = new MainCanvas({ width: 1000, height: 600 })

    this.levels = levels(this)

    this.storage = new Storage('OfflineDevLine5')

    this.showedTitle = true
    this.showedExposition = false

    this.mainCanvas.canvas.style.letterSpacing = '-1px'

    this.initializeDom()

    // load/save current level
    this.currentLevel = this.currentLevel

    this.freshStart()

    this.attachEvents()

    // start game loop last
    this.gameLoop = new GameLoop((delta) => {
      update(this, delta, () => {
        if (this.gameWon) {
          if (!this.ended) {
            this.ended = true

            setTimeout(() => {
              this.wipe = true
            }, 2000)

            setTimeout(() => {
              this.wipe = false
              this.exposition = new Exposition(this, true)
            }, 5000)
          }

          this.dev.birdParticles()

          if (this.wipe) {
            this.dev.portholeWipe()
          }

          if (this.ended && this.exposition) this.exposition.update(this.mainCanvas)
        }
      })
    })
  }

  get currentLevel() {
    return this.storage.state.currentLevel
  }

  set currentLevel(newLevel) {
    this.storage.state.currentLevel = newLevel
    this.storage.state.levels[newLevel] = this.storage.state.levels[newLevel] || {}
    this.storage.state.levels[newLevel].starScore = this.storage.state.levels[newLevel].starScore || -1
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

    const score = starThresholds.filter(threshold => this.pulser.pulsesFiredCount <= threshold).length

    const currentStarScore = this.storage.state.levels[this.currentLevel].starScore

    if (!currentStarScore || currentStarScore < score) {
      this.storage.state.levels[this.currentLevel].starScore = score
      this.storage.save()
    }

    return score
  }

  getBestScoreForLevel = (levelName) => {
    const level = (levelName) ?
      this.storage.state.levels[levelName] :
      this.storage.state.levels[this.currentLevel]

    return (level && level.bestScore) ?
      level.bestScore :
      -1
  }

  getBestStarScoreForLevel = (levelName) => {
    const level = (levelName) ?
      this.storage.state.levels[levelName] :
      this.storage.state.levels[this.currentLevel]

    return (level && level.starScore) ?
      level.starScore :
      -1
  }

  findNextLevel() {
    const levelKeys = Object.keys(this.levels)

    levelKeys.some((levelName, index) => {
      if (this.currentLevel === levelName) {
        const isLastLevel = (index + 1 > levelKeys.length - 1)

        this.isLastLevel = isLastLevel

        this.nextLevel = isLastLevel ?
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
        if (entity.destroy && entity.type !== 'levelSelect') entity.destroy(this)
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
      entity.type === 'line' &&
      event.pageY < entity.y + 50 + entity.height &&
      event.pageY > entity.y - 50
    )
  }

  initializeDom() {
    this.canvasContainer = dom.make('<div class="canvas-container"></div>')
    this.canvasContainer.appendChild(this.mainCanvas.canvas)

    this.sceneContainer = dom.make('<div class="scene-container"></div>')
    this.sceneContainer.appendChild(this.canvasContainer)

    if (this.dev.levelSelect) this.dev.levelSelect()

    document.body.appendChild(this.sceneContainer)
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

    this.lines = this.entities.filter(entity => entity.type === 'line')

    if (!this.titleScreen && !this.showedTitle) {
      this.showedTitle = true
      this.titleScreen = new AmericaOfflineTitle(this)
      this.level.entities.push(this.titleScreen)
    }

    if (!this.exposition && !this.showedExposition) {
      this.showedExposition = true
      this.exposition = new Exposition(this)
      this.level.entities.push(this.exposition)
    }

    this.levelSelect = this.levelSelect || new LevelSelect(this)
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
    if (this.isLastLevel) {
      this.gameWon = true
      console.log('win game')

      this.winSplash.destroy()

      return
    }

    this.currentLevel = this.nextLevel

    this.levelSelect.updateSquadNextX(this.currentLevel)

    this.freshStart()
  }

  openWinSplash() {
    this.winSplash = new WinSplash(this)

    this.entities.push(this.winSplash)
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
