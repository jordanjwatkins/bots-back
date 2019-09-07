import dom from '../../libs/dom'
import GameLoop from '../../libs/GameLoop'

import MainCanvas from './Canvas'
import update from './update'
import Storage from './storage'

import Cloud from './entities/cloud'
import Ground from './entities/ground'
import Pulser from './entities/pulser'
import LevelSelect from './entities/level-select'
import levels from './entities/levels'

// import Dev from './dev'

const levelSelect = true

class Line2 {
  constructor() {
    // this.dev = new Dev(this)

    this.skipFrames = 1

    this.debug = false

    this.gameDimensions = { width: 1000, height: 600 }

    this.mainCanvas = new MainCanvas(this.gameDimensions)

    this.mainCanvas.debug = this.debug

    this.levels = levels(this)

    this.storage = new Storage('OfflineDevLine7')

    this.showedTitle = true
    this.showedExposition = true

    this.mainCanvas.canvas.style.letterSpacing = '-1px'

    this.fitViewport()

    this.initializeDom()

    // load/save current level
    this.currentLevel = this.currentLevel

    this.freshStart()

    this.attachEvents()

    // start game loop last
    this.gameLoop = new GameLoop((delta) => {
      update(this, delta, () => {

      })
    })
  }

  fitViewport() {
    const aspectRatio = this.gameDimensions.width / this.gameDimensions.height

    if (document.body.clientWidth < document.body.clientHeight * aspectRatio) {
      this.mainCanvas.canvas.style.width = '100%'
      this.mainCanvas.canvas.style.height = 'auto'
    } else {
      this.mainCanvas.canvas.style.height = '100%'
      this.mainCanvas.canvas.style.width = 'auto'
    }
  }

  get currentLevel() {
    return this.storage.state.currentLevel || Object.values(this.levels)[0]
  }

  set currentLevel(newLevel) {
    this.storage.state.currentLevel = newLevel
    this.storage.save()

    this.findNextLevel()
  }

  onFirstLevel() {
    return Object.keys(this.levels)[0] === this.currentLevel
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

    window.addEventListener('resize', () => {
      this.fitViewport()

      setTimeout(() => {
        this.fitViewport()
      }, 300)
    })
  }

  removeEvents() {
    this.mainCanvas.canvas.removeEventListener('click', this.onClick)

    if (this.entities) {
      this.entities.forEach((entity) => {
        if (entity.removeEvents) entity.destroy()

      })
    }
  }

  initLevel() {
    const savedLevel = this.currentLevel

    this.cleanupEntities()

    if (savedLevel && this.levels[savedLevel]) {
      this.level = this.levels[savedLevel]()
    } else {
      console.log(`Failed to load level "${savedLevel}`) // eslint-disable-line no-console

      this.level = Object.values(this.levels)[0]()
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

    if (this.isPulserClick(event)) {
      console.log('pulser');
      if (!this.pulser.menu.isMenuOpen) {
        console.log('open');

        this.mainCanvas.selected = this.pulser
        this.pulser.menu.openMenu()
      }

    }

    if (this.pulser && this.pulser.menu && this.pulser.menu.isMenuClick(event)) {
      console.log('menus click')

    }

    this.entities.forEach((entity) => {
      if (entity.type === 'bird' && !entity.bad) {
        if (entity.isBirdClick(event, this.mainCanvas)) {
          console.log('bird click');
          entity.onClick(event)
        } else {
          entity.onAnyClick(event)
        }
      }

    })
  }

  isPulserClick(event) {
    const scale = this.mainCanvas.scaleInDom
    const entity = this.pulser

    return (
      this.mainCanvas.isClickHit(event, {
        x: entity.x * scale,
        y: entity.y * scale,
        height: entity.height * scale,
        width: entity.width * scale,
      })
    )
  }

  initializeDom() {
    this.canvasContainer = dom.make('<div class="canvas-container"></div>')
    this.canvasContainer.appendChild(this.mainCanvas.canvas)

    this.sceneContainer = dom.make('<div class="scene-container"><div></div></div>')
    this.sceneContainer.appendChild(this.canvasContainer)

    //if (this.dev && this.dev.levelSelect) this.dev.levelSelect()

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
      y: Math.round(50 + (150 * Math.random())),
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

    this.level.entities.unshift(new Cloud({
      x: Math.round(-500 + ((this.mainCanvas.width / 2) * Math.random())),
      y: Math.round(50 + (120 * Math.random())),
      width: cloudSize,
      height: cloudSize * 0.3,
      speedX: 0.5 - 0.2 * Math.random(),
    }))

    this.level.entities.unshift(new Cloud({
      x: Math.round(-400 + ((this.mainCanvas.width / 2) * Math.random())),
      y: Math.round(50 + (20 * Math.random())),
      width: cloudSize,
      height: cloudSize * 0.3,
      speedX: 0.5 - 0.2 * Math.random(),
    }))

    this.pulser = this.level.pulser || new Pulser({ x: 880, y: 500 })
    this.level.entities.unshift(this.pulser)

    this.lines = this.entities.filter(entity => entity.type === 'line')

    if (levelSelect) {
      this.levelSelect = this.levelSelect || new LevelSelect(this)
      this.level.entities.push(this.levelSelect)
    }
  }

  freshStart() {
    this.removeEvents()

    this.mainCanvas.context.globalAlpha = 1.0
    this.mainCanvas.selected = null

    this.initLevel()
    this.initEntities()

    this.allFlying = false
    this.gameOver = false
    this.fadingOut = false

    this.attachEvents()
  }

  startNextLevel() {
    this.currentLevel = this.nextLevel

    if (this.levelSelect) this.levelSelect.updateSquadNextX(this.currentLevel)

    this.freshStart()
  }
}

export default Line2
