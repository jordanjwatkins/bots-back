class Ground {
  constructor(props = {}) {
    const defaults = {
      x: 0,
      y: 0,
      z: 3,
      width: 20,
      height: 20,
      color: '#8A6F30',
    }

    Object.assign(this, defaults, props)

    this.spotSize = this.height / 5
  }

  update({ mainCanvas }) {
    mainCanvas.drawRect(this)

    mainCanvas.drawRect({
      width: this.spotSize,
      height: this.spotSize,
      x: 280,
      y: this.y + this.spotSize * 1.2,
      color: '#663931',
    })

    mainCanvas.drawRect({
      width: this.spotSize,
      height: this.spotSize,
      x: 780,
      y: this.y + this.spotSize * 0.9,
      color: '#8F563B',
    })
  }
}

export default Ground
