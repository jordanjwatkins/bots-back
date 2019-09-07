import { boxesCollide, collisions } from '../../../../libs/collisions'

export default {
  closeMountablePlatforms() {
    if (this.movingToBack || this.movingToGround || this.backOccupied) return []

    return this.level.groups.platforms.filter((platform) => {
      if (
        //!(this.platform && platform === this.platform) &&
        //!platform.entry.occupied &&
        platform.entry.x < this.x &&
        platform.entry.y < this.y &&

        Math.abs(platform.entry.y - this.y) < 50 && Math.abs(platform.entry.x - this.x) < 10 &&

        !collisions(
          { x: platform.entry.x - this.width, y: platform.entry.y - this.height, width: this.width, height: this.height },
          this.level.entities.filter(entity => entity.type === 'bird'),
        )

      ) {
        console.log('close mountable');

        return platform
      }

      return false
    })
  },

  closePlatformExit() {
    if (this.movingToBack || this.movingToGround || this.backOccupied || !this.target || !this.target.entity) return false

    const { exit } = this.target.entity

    if (
      exit.x > this.x + this.width / 2 &&
      // this.platform.exit.y < this.y &&
      Math.abs(exit.y - this.y - this.height) < 20 &&
      Math.abs(exit.x - this.x) < this.width
    ) {
      return true
    }

    return false
  },

  getTargetPlatform() {
    const closePlatforms = this.closeMountablePlatforms()

    if (!this.bad && !this.backOccupied && closePlatforms.length > 0 && !this.target) {
      console.log('platform!!!', closePlatforms[0])

      this.jump()

      const [platform] = closePlatforms

      this.target = { ...platform.entry, entity: platform }
      this.targetHost = platform

      this.movingFn = this.moveTowardEntry
    }
  },

  jump() {
    this.flying = true
    this.jumpParticlesOn = true
    this.jumpParticles = null

    this.host = null
    this.onBack = false
    this.onPlatform = false

    this.movingToTarget = true
    this.movingToPlatform = true
  },

  onPlatformLand() {
    const { target } = this

    console.log('platform landed', this.x, this.y)

    this.land()

    this.movingToPlatform = false
    this.onPlatform = true

    this.x = target.x - this.width
    this.y = target.y - this.height

    this.host = this.target.entity
  },

  land() {
    const stopGo = this.menu.getField('stop-go')

    stopGo.value = 'stop'

    this.movingToTarget = false

    this.flying = false
    this.speed.x = 0
    this.speed.y = 0

    this.jumpParticles = null
  },

  moveTowardEntry() {
    console.log('moving to platform', this.target.x, this.target.y, this.x, this.y)

    let { dx, dy } = this.distanceToTarget()

    dx = Math.floor(dx / 30)

    console.log(dx, dy)

    // if (dx === 0 && dy === 0) {
    if (Math.abs(dx * 10) < 5) { //  && Math.abs(dy * 10) < 5
      this.onPlatformLand()
    } else {
      this.speed.x = dx - 1

      if (dy < -1) {
        this.speed.y = Math.ceil(dx) - 7
      } else {
        this.speed.y = 0
      }
    }
  },

  moveOffPlatform() {
    console.log('moving off platform')

    let { dx, dy } = this.distanceToTarget()

    dx = Math.floor(dx / 20)

    if (Math.abs(dx * 10) < 15 && Math.abs(dy * 10) < 15) {
      this.onLandOffPlatform()
    } else {
      this.speed.x = dx - 1

      this.speed.y = Math.ceil(dy / 40) + 1
    }
  },

  distanceToTarget(absolute = false) {
    const dx = (this.target.x - this.x - (this.width / 2))
    const dy = (this.target.y - (this.y + this.height))

    return (absolute) ? { dx: Math.abs(dx), dy: Math.abs(dy) } : { dx, dy }
  },

  onLandOffPlatform() {
    console.log('landed off platform')

    this.land()

    this.movingOffPlatform = false
    this.onPlatform = false

    if (this.host) this.host.backOccupied = false
  },

  shouldExitPlatform() {
    return this.onPlatform && this.closePlatformExit() && !this.movingToTarget && !this.movingToBack
  },

  updatePlatforms() {
    if (this.bad) return

    const climb = this.menu.getField('dont-climb').value === 'climb'

    if (climb) this.getTargetPlatform()

    if (this.shouldExitPlatform()) {
      console.log('platform exit')

      this.movingToTarget = true
      this.movingOffPlatform = true

      this.target = { x: this.x - 40, y: this.level.groundY, width: 1, height: 1 }

      this.movingFn = this.moveOffPlatform
    }

    if (this.movingToTarget) {
      this.movingFn()
    }
  },
}
