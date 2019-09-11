class Cloud {
  constructor() {
    this.x = -100 + Math.random() * 1100
    this.y = Math.random() * 600
    this.z = 1

    this.width = Math.random() * 1100
    this.height = 30 + Math.random() * 100

    this.color = '#111'

    this.speed = {
      x: 11 + Math.random() * 10
    }
  }

  destroy(scene) {
    scene.entities = scene.entities.filter(entity => entity !== this)
  }

  update(scene, delta) {
    const { mainCanvas } = scene

    if (this.x > mainCanvas.width) {
      this.x = -(this.width * 2) - (this.width * Math.random())
    }

    //if (this.moving) {
      this.x += (this.speed.x / 16) * delta
     // this.y += (this.speed.y / 16) * delta
   // }

    mainCanvas.drawRect(this)

    /*mainCanvas.drawRect({
      x: this.x + this.width / 2 - this.width / 3.4,
      y: this.y - (this.height - (this.height / 3)),
      height: this.height - (this.height / 3),
      width: this.width * 0.7,
      color: this.color,
    })

    mainCanvas.drawRect({
      x: this.x + this.width / 2 - this.width / 3.4 + this.width / 4,
      y: this.y - (this.height - (this.height / 3)) + this.height / 2,
      height: this.height - (this.height / 3),
      width: this.width * 0.7,
      color: this.color,
    })*/
  }
}

export default Cloud
