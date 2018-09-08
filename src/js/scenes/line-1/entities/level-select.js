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
    console.log('level select click')

    Object.keys(this.clickBoxes).forEach((levelName) => {
      if (this.scene.mainCanvas.isClickHit(event, this.clickBoxes[levelName])) {
        console.log(levelName)

        this.scene.currentLevel = levelName

        this.scene.freshStart()
      }
    })
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
    const scene = this.scene

    this.clouds = this.clouds || [

      new Cloud({
        x: Math.round(700 + ((this.width / 5) * Math.random())),
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
    this.scene.mainCanvas.drawRect({
      x: 4,
      y: roadY - 35,
      width: 20,
      height: 40,
      color: '#444',
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

    // level markers
    Object.keys(this.levels).reverse().forEach((level, index) => {
      this.clickBoxes[level] = this.clickBoxes[level] || {
        x: x + (this.width / this.levelCount) * index,
        y: roadY - 55,
        height: 70,
        width: 70,
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

      // small squad
      this.scene.mainCanvas.drawThing({
        x: x + (this.width / this.levelCount) * index + 36, y: 43, width: 48, height: 20, frameWidth: 24, frameHeight: 10, frame: 0, spriteName: 'squad',
      })
    })
  }

  drawStar(context, x, y) {
    context.save()

    const length = 4

    context.translate(x, y)

    // initial offset rotation so our star is straight
    context.rotate((Math.PI * 1 / 10))

    context.beginPath()

    // make a point, 5 times
    for (let i = 5; i--;) {
      // draw line up
      context.lineTo(0, length)
      // move origin to current same location as pen
      context.translate(0, length)
      // rotate the drawing board
      context.rotate((Math.PI * 2 / 10))
      // draw line down
      context.lineTo(0, -length)
      // again, move origin to pen...
      context.translate(0, -length)
      // ...and rotate, ready for next arm
      context.rotate(-(Math.PI * 6 / 10))
    }

    // last line to connect things up
    context.lineTo(0, length)
    context.closePath()

    context.fillStyle = 'yellow'

    // stroke the path, you could also .fill()
    // context.stroke()
    context.fill()

    context.restore()
  }

  drawStars(xIn, levelName) {
    const { mainCanvas, getBestStarScoreForLevel } = this.scene
    const { context } = mainCanvas

    if (!this.scene.getBestScoreForLevel(levelName)) {
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

    this.drawStar(context, x, y)

    context.globalAlpha = (starScore > 1 && this.starDelay < -20) ?
      alpha :
      fadedAlpha

    x += 10

    this.drawStar(context, x, y)

    context.globalAlpha = (starScore > 2 && this.starDelay < -40) ?
      alpha :
      fadedAlpha

    x += 10

    this.drawStar(context, x, y)

    context.restore()
  }

  update(scene, delta) {
    this.drawBackground()

    this.drawGround()
    this.drawClouds(delta)
    this.drawRoad()

    // big squad
    this.scene.mainCanvas.drawThing({
      x: 325, y: 513, width: 48 * 4, height: 20 * 4, frameWidth: 24, frameHeight: 10, frame: 0, spriteName: 'squad',
    })
  }
}

export default LevelSelect
