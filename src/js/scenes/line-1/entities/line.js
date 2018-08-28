class Line {
  constructor({ x = 0, y = 0, width = 5, height = 10 }) {
    this.x = x
    this.y = y
    this.z = 3

    this.width = width
    this.height = height

    this.speed = {
      x: 0,
      y: 0,
    }

    this.color = 'black'
  }

  update({ mainCanvas }) {
    mainCanvas.drawRect(this)
  }
}

export default Line
