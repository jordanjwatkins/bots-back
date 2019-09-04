export default {
  closeMountableAllies() {
    if (this.movingToBack || this.movingToGround || this.backOccupied) return

    return this.allies.filter((ally) => {
      if (
        !ally.movingToBack &&
        !ally.movingToGround &&
        !ally.backOccupied &&
        !ally.dead &&

        ally.x < this.x &&
        this.x - ally.x < 80 &&
        (this.y + this.height) - ally.y < 30
      ) {
        return ally
      }
    })
  },

  updateOnOffBack(stopGo) {
    if (stopGo.value === 'go') {
      if (this.onBack) {
        console.log('moving to ground')

        this.movingToBack = false
        this.onBack = false
        this.movingToGround = true
        this.flying = true

        this.target = { x: this.x - 40, y: this.level.groundY, width: 1, height: 1 }
      }

      const filterAllies = this.closeMountableAllies()

      if (
        filterAllies &&
        filterAllies[0]
      ) {
        console.log('moving to back')

        this.host = filterAllies[0]

        this.movingToBack = true

        this.jumpParticlesOn = true
        this.jumpParticles = null
      }
    }

    if (this.movingToBack && this.host.dead) {
      this.movingToBack = false
      this.movingToGround = true
      this.host = null
    }

    if (this.onBack) {
      if (this.host) {
        if (this.host.hp <= 0) {
          this.speed.x = 0
          this.y += this.host.height

          this.host = null
          this.onBack = false
        } else {
          this.speed.x = this.host.speed.x
          this.y = this.host.y - this.height
          this.x = this.host.x + this.host.width / 2 - this.width / 2
        }
      }
    } else if (!this.movingToPlatform && !this.onPlatform && !this.movingOffPlatform && !this.movingToBack && !this.movingToGround && this.y + this.height < this.level.groundY) {
      //this.y = this.level.groundY - this.height
    }

    if (this.movingToBack) {
      let target = this.host

      while (target.backOccupier) {
        target = target.backOccupier
      }

      stopGo.disabled = true

      let dx = (target.x + target.width / 2 - this.x - (this.width / 2)) / 10
      let dy = (target.y - (this.y + this.height)) / 10

      dx = Math.floor(dx)
      dy = Math.floor(dy)

      //if (dx === 0 && dy === 0) {
      if (Math.abs(dx * 10) < 15 && Math.abs(dy * 10) < 15) {
        console.log('back land')

        this.movingToBack = false
        this.flying = false

        this.onBack = true
        this.host = target
        target.backOccupied = true
        target.backOccupier = this

        stopGo.disabled = false
        stopGo.value = 'stop'

        dx = 0
        dy = 0
        this.x = target.x + target.width / 2 - this.width / 2
        this.y = target.y - this.height
      } else {
        dx += this.directionX
        dy -= 1
      }

      this.speed.x = dx
      this.speed.y = dy

      this.z = 5
    }

    if (this.movingToGround) {
      this.flying = true

      if (!this.target) {
        this.target = { x: this.x, y: this.level.groundY }
      }

      let dx = (this.target.x - this.x - (this.width / 2)) / 30
      const dy = (this.target.y - (this.y + this.height))

      dx = Math.floor(dx)

      if (dx === 0 && dy === 0) {
        console.log('ground landed')

        this.movingToGround = false
        this.flying = false
        this.speed.x = 0
        this.speed.y = 0
        stopGo.value = 'stop'

        this.jumpParticles = null

        if (this.host) this.host.backOccupied = false
      }

      if (this.flying) {
        this.speed.x = dx
        this.speed.y = Math.ceil(dy / 30)
      }
    }
  }
}
