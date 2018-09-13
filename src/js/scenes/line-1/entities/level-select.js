import Ground from './ground'
import Cloud from './cloud'

const colorBackground = '#639bff'

class LevelSelect {
  constructor(scene) {
    const { mainCanvas } = scene

    this.width = mainCanvas.width
    this.height = mainCanvas.height / 8

    this.x = 0
    this.y = 0

    this.color = colorBackground

    this.z = 3

    this.opacity = 1

    this.scene = scene

    this.levels = this.scene.levels

    this.levelCount = Object.keys(this.levels).length + 0.5

    this.type = 'levelSelect'

    this.attachEvents()
  }

  destroy() {
    this.detachEvents()

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

  onClick = (event) => {
    Object.keys(this.clickBoxes).forEach((levelName) => {
      if (this.scene.mainCanvas.isClickHit(event, this.clickBoxes[levelName])) {
        const { scene } = this
        const levelState = scene.storage.state.levels[levelName]

        if (
          scene.currentLevel === levelName ||
          levelState
        ) {
          scene.currentLevel = levelName

          this.updateSquadNextX(levelName)

          scene.freshStart()
        }
      }
    })
  }

  updateSquadNextX(levelName) {
    const levelIndex = this.getLevelIndexByName(levelName)

    this.squadNextX = Math.round(25 + (this.width / this.levelCount) * levelIndex + 36)
  }

  getLevelIndexByName(name) {
    return Object.keys(this.levels).reverse().reduce((acc, levelName, index) => {
      if (levelName === name) return index

      return acc
    }, 0)
  }

  drawBackground() {
    const { mainCanvas } = this.scene
    const { context } = mainCanvas

    context.save()

    mainCanvas.drawRect(this)

    context.restore()
  }

  drawGround() {
    const groundHeight = this.height / 3

    this.ground = this.ground || new Ground({
      width: this.width,
      height: groundHeight,
      y: this.y + this.height - groundHeight,
    })

    this.ground.update(this.scene)
  }

  drawClouds(delta) {
    this.clouds = this.clouds || [

      new Cloud({
        x: Math.round(600 + ((this.width / 5) * Math.random())),
        y: Math.round(5 + (20 * Math.random())),
        width: 20,
        height: 5,
        speedX: 0.1 - 0.05 * Math.random(),
      }),

      new Cloud({
        x: Math.round(-100 + ((this.width / 5) * Math.random())),
        y: Math.round(5 + (20 * Math.random())),
        width: 20,
        height: 5,
        speedX: 0.1 - 0.05 * Math.random(),
      }),

      new Cloud({
        x: Math.round(400 + ((this.width / 5) * Math.random())),
        y: Math.round(5 + (25 * Math.random())),
        width: 20,
        height: 5,
        speedX: 0.1 - 0.05 * Math.random(),
      }),
    ]

    this.clouds.forEach(cloud => cloud.update(this.scene, delta))
  }

  drawRoad() {
    const roadWidth = 6
    const roadY = this.y + this.height - 24 - (roadWidth / 2)
    const x = 25

    // transmitter
    this.scene.mainCanvas.drawThing({
      x: 15,
      y: roadY - 20,
      width: 13 * 2,
      height: 18 * 2.8,
      frameWidth: 13,
      frameHeight: 18,
      frame: 0,
      frameOffset: 36,
      spriteName: 'spritesheet',
    })

    let blinkerColor = '#650000'

    if (this.scene.gameWon) {
      blinkerColor = (Math.sin(new Date() / 100)) > 0 ? '#650000' : 'red'
    }

    // red light
    this.scene.mainCanvas.drawRect({
      x: 14,
      y: roadY - 42,
      width: 2,
      height: 6,
      color: blinkerColor,
    })

    // road
    this.scene.mainCanvas.drawRect({
      x: x + 2,
      y: roadY,
      width: this.width - 15,
      height: roadWidth,
      color: '#EEC39A',
    })

    this.clickBoxes = this.clickBoxes || {}

    const scale = this.scene.mainCanvas.scaleInDom

    // level markers
    Object.keys(this.levels).reverse().forEach((level, index) => {
      this.clickBoxes[level] = this.clickBoxes[level] || {
        x: x * scale + (this.width * scale / this.levelCount) * index - 10 * scale,
        y: roadY * scale - 55 * scale,
        height: 80 * scale,
        width: 70 * scale,
      }

      this.scene.mainCanvas.drawRect({
        x: x + (this.width / this.levelCount) * index,
        y: roadY - 2,
        width: 10,
        height: roadWidth + 4,
        color: '#EEC39A',
      })

      // poles
      this.scene.mainCanvas.drawRect({
        x: x + (this.width / this.levelCount) * index + 2,
        y: roadY - 22,
        width: 4,
        height: 22,
        color: 'brown',
      })

      // transformers
      this.scene.mainCanvas.drawRect({
        x: x + (this.width / this.levelCount) * index + 5,
        y: roadY - 21,
        width: 4,
        height: 6,
        color: '#ddd',
      })

      // line
      this.scene.mainCanvas.drawRect({
        x: x + 2,
        y: roadY - 20,
        width: this.width,
        height: 2,
        color: '#000000',
      })

      // stars
      this.drawStars((this.width / this.levelCount) * index, level)

      if (level !== this.scene.currentLevel) return

      if (this.squadX && this.squadNextX) {
        if (this.squadNextX < this.squadX - 1) {
          this.squadX -= 2
        } else if (this.squadNextX > this.squadX + 1) {
          this.squadX += 2
        }
      } else {
        this.squadX = Math.round(x + (this.width / this.levelCount) * index + 36)
      }

      // small squad
      this.scene.mainCanvas.drawThing({
        x: this.squadX,
        y: 43,
        width: 48,
        height: 20,
        frameWidth: 24,
        frameHeight: 10,
        frame: 0,
        frameOffset: 1,
        spriteName: 'spritesheet',
      })
    })
  }

  drawStars(xIn, levelName) {
    const { mainCanvas, getBestStarScoreForLevel, getBestScoreForLevel } = this.scene
    const { context } = mainCanvas

    if (getBestStarScoreForLevel(levelName) < 0 && getBestScoreForLevel(levelName) < 0) {
      return
    }

    const starScore = getBestStarScoreForLevel(levelName)

    context.save()

    let x = xIn + 40
    const y = 15

    const fadedAlpha = (this.opacity - 0.6 > 0) ? this.opacity - 0.6 : 0
    const alpha = (this.opacity - 0.1 > 0) ? this.opacity : 0

    this.starDelay = -100

    context.globalAlpha = (starScore > 0 && this.starDelay < 0) ?
      alpha :
      fadedAlpha

    mainCanvas.drawStar(x, y, 'yellow', 4)

    context.globalAlpha = (starScore > 1 && this.starDelay < -20) ?
      alpha :
      fadedAlpha

    x += 15

    mainCanvas.drawStar(x, y, 'yellow', 4)

    context.globalAlpha = (starScore > 2 && this.starDelay < -40) ?
      alpha :
      fadedAlpha

    x += 15

    mainCanvas.drawStar(x, y, 'yellow', 4)

    context.restore()
  }

  update(scene, delta) {
    this.drawBackground()

    this.drawGround()
    this.drawClouds(delta)
    this.drawRoad()

    // big squad
    this.scene.mainCanvas.drawThing({
      x: 325,
      y: 513,
      width: 48 * 4,
      height: 20 * 4,
      frameWidth: 24,
      frameHeight: 10,
      frame: 0,
      frameOffset: 1,
      spriteName: 'spritesheet',
    })
  }
}

export default LevelSelect
