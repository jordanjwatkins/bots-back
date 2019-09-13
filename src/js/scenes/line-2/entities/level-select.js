class LevelSelect {
  constructor(scene) {
    const { mainCanvas } = scene

    this.debug = true

    this.width = mainCanvas.width
    this.height = mainCanvas.height / 10

    this.x = 0
    this.y = 0

    this.color = '#000'

    this.z = 3

    // this.opacity = 1

    this.scene = scene

    this.levels = this.scene.levels

    this.levelCount = Object.keys(this.levels).length + 0.5

    this.type = 'levelSelect'

    // this.attachEvents()
    this.scene.mainCanvas.canvas.addEventListener('click', this.onClick)
  }

  /*destroy() {
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
  } */

  onClick = (event) => {
    Object.keys(this.clickBoxes).forEach((levelName) => {
      if (this.scene.mainCanvas.isClickHit(event, this.clickBoxes[levelName])) {
        this.switchToLevel(levelName)
      }
    })
  }

  switchToLevel(levelName) {
    const { scene } = this

    console.log('static')

    scene.skipped = true

    scene.mainCanvas.imageFx.static(0.9)

    setTimeout(() => {
      scene.mainCanvas.imageFx.static(-0.09)
    }, 100)

    console.log(levelName)

    if (
      scene.currentLevel === levelName ||
      scene.storage.state.levels[levelName] ||
      this.debug
    ) {
      console.log(levelName, this.clickBoxes)

      scene.currentLevel = levelName

      scene.freshStart()
    }
  }

  getLevelIndexByName(name) {
    return Object.keys(this.levels).reverse().reduce((acc, levelName, index) => {
      if (levelName === name) return index

      return acc
    }, 0)
  }

  drawBackground() {
    this.scene.mainCanvas.drawRect(this)
  }

  drawRoad() {
    const roadWidth = 6
    const roadY = 34
    const x = 25

    this.scene.mainCanvas.context.filter = 'none'

    // road
    this.scene.mainCanvas.drawRect({
      x: x + 2,
      y: roadY,
      width: this.width - 15,
      height: roadWidth,
      color: '#2472ff',
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
        color: '#FFF',
      })

      if (level === this.scene.currentLevel) {
        this.scene.mainCanvas.drawRect({
          x: x + (this.width / this.levelCount) * index + 1,
          y: roadY - 22,
          width: 8,
          height: roadWidth + 4,
          color: (Math.sin(new Date() / 200)) > 0 ? 'yellow' : '#000',
        })
      }
    })

    this.scene.mainCanvas.context.filter = 'none'
  }

  update(scene, delta) {
    this.drawBackground()
    this.drawRoad()


    // context.fillStyle = (field.disabled) ? '#999' : '#FFF'
    // context.strokeStyle = (field.disabled) ? '#999' : '#FFF'
    // context.font = `${fontSize}px monospace`
    // context.globalAlpha = 0.1

    this.scene.mainCanvas.context.font = '14px monospace'

    this.scene.mainCanvas.context.fillStyle = '#FFF'
    this.scene.mainCanvas.context.textAlign = 'right'
    this.scene.mainCanvas.context.fillText('Zone Select', 990, 25)
  }
}

export default LevelSelect
