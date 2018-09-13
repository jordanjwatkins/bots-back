import dom from '../../libs/dom'
import GameLoop from '../../libs/GameLoop'

import MainCanvas from './Canvas'
import update from './update'
import Storage from './storage'

import Cloud from './entities/cloud'
import Ground from './entities/ground'
import Pulser from './entities/pulser'
import Bird from './entities/bird'
import knote from '../../libs/knote'
import WinSplash from './entities/win-splash'
import LevelSelect from './entities/level-select'
import AmericaOfflineTitle from './entities/america-offline-title'
import Exposition from './entities/exposition'
import levels from './entities/levels'

// import Dev from './dev'

class Line1 {
  constructor() {
    // this.dev = new Dev(this)

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

          this.birdParticles()

          if (this.wipe) {
            this.portholeWipe()
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
    // if (this.debug) console.log('canvas click', this.mainCanvas.clickCoords(event)) // eslint-disable-line no-console

    this.entities.forEach((entity) => {
      if (this.isLineClick(event, entity)) {
        this.pulser.firePulse(this, entity)
      }
    })
  }

  isLineClick(event, entity) {
    return (
      entity.type === 'line' &&
      this.mainCanvas.isClickHit(event, {
        x: 0,
        y: entity.y - 50,
        height: entity.height + 100,
        width: this.mainCanvas.width,
      })
    )
  }

  initializeDom() {
    this.canvasContainer = dom.make('<div class="canvas-container"></div>')
    this.canvasContainer.appendChild(this.mainCanvas.canvas)

    this.sceneContainer = dom.make('<div class="scene-container"><div></div></div>')
    this.sceneContainer.appendChild(this.canvasContainer)

    if (this.dev && this.dev.levelSelect) this.dev.levelSelect()

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

  birdParticles() {
    this.bird = this.bird || new Bird({ flying: true })

    if (!this.birds) {
      this.birds = Array(100).fill(0).map(() => ({
        x: -1000 * Math.random(),
        y: 1700 - 1700 * Math.random(),
        vX: 2 + 5 * Math.random(),
        vY: -0.1 * Math.random(),
      }))
    }

    this.scene.mainCanvas.context.save()

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

export default Line1
