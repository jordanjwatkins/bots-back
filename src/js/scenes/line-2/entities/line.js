class Line {
  constructor({ x = 0, y = 0, width = 5, height = 5, z = 3 }) {
    this.x = x
    this.y = y
    this.z = z

    this.width = width
    this.height = height

    this.speed = {
      x: 0,
      y: 0,
    }

    this.color = 'black'
    this.type = 'line'
  }

  update(scene) {
    const { mainCanvas, showedTitle, showedExposition, exposition } = scene

    mainCanvas.drawRect(this)

    if ((!showedTitle || !showedExposition) || exposition) return

    mainCanvas.drawRect({
      x: 20,
      y: this.y,
      height: mainCanvas.height - (this.y) - 50,
      width: 3,
    })

    mainCanvas.drawRect({
      x: 20,
      y: this.y + mainCanvas.height - (this.y) - 50,
      height: 3,
      width: 140,
    })

    mainCanvas.drawRect({
      x: 160,
      y: this.y + mainCanvas.height - (this.y) - 50 - 20,
      height: 23,
      width: 3,
    })

    mainCanvas.drawRect({
      x: 150,
      y: this.y + mainCanvas.height - (this.y) - 50 - 20,
      height: 23,
      width: 3,
    })
  }
}

export default Line
