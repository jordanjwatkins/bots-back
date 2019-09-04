import BirdMenu from './bird-menu'

export default {
  attachEvents(mainCanvas) {
    this.eventsAttached = true

    const { canvas } = mainCanvas

    //canvas.addEventListener('click', this.onClick)

    this.menu = new BirdMenu(this)
  },

  detachEvents(mainCanvas) {
    const { canvas } = mainCanvas

    this.eventsAttached = false

    canvas.removeEventListener('click', this.onClick)
  },

  onClickFn(event) {
    if (this.dead) return

    if (this.isBirdClick(event, this.mainCanvas)) {
      this.absorbed += 1

      if (this.absorbed > 3) this.absorbed = 0

      this.selected = !this.selected

      if (this.selected) {
        this.menu.openMenu()

        console.log('selected:', this)
      }
    }

    this.onAnyClick(event)
  },

  onAnyClick(event) {
    const isBirdClick = this.isBirdClick(event, this.mainCanvas)
    const isMenuClick = this.menu.isMenuClick(event)

    if (!isMenuClick && !isBirdClick) {
      this.selected = false

      this.menu.closeMenu()
    }

    if (this.selected) {
      this.mainCanvas.selected = this

      if (this.z === 3) this.z = 4
    } else {
      this.menu.closeMenu()

      if (this.z === 4) this.z = 3
    }
  },

  isBirdClick(event, mainCanvas) {
    const scale = mainCanvas.scaleInDom

    const clickRect = {
      y: this.y * scale,
      x: this.x * scale,
      height: this.height * scale,
      width: this.width * scale,
    }

    return mainCanvas.isClickHit(event, clickRect)
  }
}
