export default {
  spawnScan() {
    if (this.reverseScan) return
    if (this.bad || this.preSpawned) this.spawnScanOffset = this.height + 4

    if (this.spawnScanOffset >= this.height + 4) return //this.reverseScan = true

    this.spawnScanOffset = this.spawnScanOffset || 1
    this.frameCount = this.frameCount || 1

    if (this.frameCount < 2) {
      this.frameCount += 1
    } else {
      this.frameCount = 1
      this.spawnScanOffset += 1
    }

    const x1 = this.x
    const y1 = this.y + this.spawnScanOffset

    const x2 = this.x + this.width
    const y2 = this.y + this.spawnScanOffset

    const x3 = 930
    const y3 = this.pulser.y - 18 - this.pulser.eyeOffset

    // this.mainCanvas.drawTriangleFromPoints([{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }], 1)

    this.mainCanvas.lateRenders.push(() => this.mainCanvas.drawTriangleFromPoints([{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }], 1))
  },
}
