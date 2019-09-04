export default {
  closeMountablePlatforms() {
    if (this.movingToBack || this.movingToGround || this.backOccupied) return []

    return this.level.groups.platforms.filter((platform) => {
      if (
        !(this.platform && platform === this.platform) &&
        !platform.entry.occupied &&
        platform.entry.x < this.x &&
        platform.entry.y < this.y &&
        Math.abs(platform.entry.y - this.y) < 50 && Math.abs(platform.entry.x - this.x) < 10
      ) {
        return platform
      }

      return false
    })
  },

  closePlatformExit() {
    if (this.movingToBack || this.movingToGround || this.backOccupied) return []

    if (
      this.platform.exit.x > this.x + this.width / 2 &&
      // this.platform.exit.y < this.y &&
      Math.abs(this.platform.exit.y - this.y - 20) < 20 && Math.abs(this.platform.exit.x - this.x) < 30
    ) {
      return true
    }

    return false
  },

  updatePlatforms() {
    const closePlatforms = this.closeMountablePlatforms()

    if (!this.bad && !this.backOccupied && closePlatforms.length > 0) {
      console.log('platform!!!', closePlatforms[0])

      this.host = null
      this.onBack = false

      this.movingToPlatform = true

      this.jumpParticlesOn = true
      this.jumpParticles = null

      if (!this.platform) {
        console.log('new platform')

        this.platform = closePlatforms[0]

        this.target = closePlatforms[0].entry

        closePlatforms[0].entry.occupied = true
      }
    }

    if (this.movingToPlatform) {
      const target = this.target

      this.flying = true

      // if (!this.target) {
      //  this.target = closePlatforms[0].entry
      // }

      console.log('moving to platform', this.target.x, this.target.y, this.x, this.y)


      let dx = (this.target.x - this.x - (this.width / 2)) / 30
      const dy = (this.target.y - (this.y + this.height))

      dx = Math.floor(dx)


      console.log(dx, dy)


      //if (dx === 0 && dy === 0) {
      if (Math.abs(dx * 10) < 5) { //  && Math.abs(dy * 10) < 5
        console.log('platform landed', this.x, this.y)

        const stopGo = this.menu.getField('stop-go')

        this.movingToPlatform = false
        this.onPlatform = true
        this.flying = false
        this.speed.x = 0
        this.speed.y = 0
        stopGo.value = 'stop'

        this.jumpParticles = null

        // if (this.host) this.host.backOccupied = false

        // dx = 0
        // dy = 0
        this.x = target.x - this.width
        this.y = target.y - this.height

        console.log(this.x, this.y)
      }

      if (this.flying) {
        this.speed.x = dx - 1

        if (dy < -1) {
          this.speed.y = Math.ceil(dx) - 7
        } else {
          this.speed.y = 0
        }

        // this.speed.y = Math.ceil(dy / 40) - 1
      }
    }

    if (this.onPlatform && this.closePlatformExit() && !this.movingToBack) { // || (this.movingToPlatform && this.platform.entry.occupied)
      console.log('platform exit')

      this.onPlatform = true
      this.movingOffPlatform = true
      this.flying = true
      this.target = { x: this.x - 40, y: this.level.groundY, width: 1, height: 1 }
    }

    if (this.movingOffPlatform) {
      this.flying = true

      let dx = (this.target.x - this.x - (this.width / 2)) / 30
      const dy = (this.target.y - (this.y + this.height))

      dx = Math.floor(dx)

      if (Math.abs(dx * 10) < 15 && Math.abs(dy * 10) < 15) {
        const stopGo = this.menu.getField('stop-go')

        this.movingOffPlatform = false
        this.flying = false
        this.speed.x = 0
        this.speed.y = 0
        stopGo.value = 'stop'

        this.jumpParticles = null

        if (this.host) this.host.backOccupied = false
      }

      if (this.flying) {
        this.speed.x = dx - 1

        if (this.movingOffPlatform) this.speed.y = Math.ceil(dy / 40) + 1
      }
    }
  },
}
