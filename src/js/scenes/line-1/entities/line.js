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
  }

  update({ mainCanvas }) {
    mainCanvas.drawRect(this)
  }
}

export default Line
