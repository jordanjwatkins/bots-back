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
  }

  update({ mainCanvas }) {
    mainCanvas.drawRect(this)

    mainCanvas.drawRect({
      width: 15,
      height: 15,
      x: 280,
      y: this.y + 18,
      color: '#663931',
    })

    mainCanvas.drawRect({
      width: 15,
      height: 15,
      x: 780,
      y: this.y + 10,
      color: '#8F563B',
    })
  }
}

export default Ground
