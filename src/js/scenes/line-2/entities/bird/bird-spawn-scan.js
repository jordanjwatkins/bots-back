export default {
  spawnScan() {
    if (this.bad) this.offset = this.height + 5

    if (this.offset > this.height + 4) return

    this.offset = this.offset || 1
    this.frameCount = this.frameCount || 1

    if (this.frameCount < 2) {
      this.frameCount += 1
    } else {
      this.frameCount = 1
      this.offset += 1
    }

    const x1 = this.x
    const y1 = this.y + this.offset

    const x2 = this.x + this.width
    const y2 = this.y + this.offset

    const x3 = 930
    const y3 = 480 - this.pulser.eyeOffset

    // this.mainCanvas.drawTriangleFromPoints([{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }], 1)

    this.mainCanvas.lateRenders.push(() => this.mainCanvas.drawTriangleFromPoints([{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }], 1))
  },
}
