import { boxesCollide, collisions } from '../../../../libs/collisions'

export default {
  closeMountablePlatforms() {
    // if (this.movingToBack || this.movingToGround || this.backOccupied || this.bad) return []

    // console.log('plats allowed', this.target);


    return this.level.groups.platforms.filter((platform) => {
      //console.log(platform.type);

      if (platform.type === 'u') {
        //console.log('upgrade plat', platform.upgrade);

        if (platform.upgrade && Math.abs(platform.y + platform.height / 2 - this.y) < 25 && Math.abs(platform.x + platform.width / 2 - this.x) < 15) {
          console.log('upgrade touch')
          this.allies.forEach((ally) => {
            if (!ally.menu.menuItems.includes('dont-climb')) ally.menu.menuItems.push('dont-climb') && ally.menu.resetHeight()
          })

          let upgradeField

          if (platform.upgrade === 'thruster' && !this.scene.storage.state.thruster) {
            upgradeField = 'dont-climb'


            this.scene.storage.state.thruster = true

            this.allies.forEach((ally) => {
              if (!ally.menu.menuItems.includes('dont-climb')) ally.menu.menuItems.push('dont-climb') && ally.menu.resetHeight()
            })
          } else if (platform.upgrade === 'booster' && !this.scene.storage.state.booster) {
            upgradeField = 'slow-fast'


            this.scene.storage.state.booster = true

            this.allies.forEach((ally) => {
              if (!ally.menu.menuItems.includes('dont-climb')) ally.menu.menuItems.push('dont-climb') && ally.menu.resetHeight()
            })
          } else if (!this.scene[platform.upgrade]) {
            this.scene[platform.upgrade] = true
            this.reverseScan = true
          }

          if (upgradeField) this.menu.menuItems.push(upgradeField)

          this.menu.resetHeight()

          platform.upgrade = false
        }

        return false
      }

      if (this.movingToBack || this.movingToGround || this.backOccupied || this.bad) return false

      /* console.log(
        //(platform.type === 'u'),
        //this,
        (!(this.movingToBack || this.movingToGround || this.backOccupied || this.bad)),
        this.movingToBack , this.movingToGround , this.backOccupied , this.bad,
        platform.entry.x < this.x,
      ) */

      //! (this.platform && platform === this.platform) &&
      //! platform.entry.occupied &&

      // platform.entry.y < this.y &&

      /* Math.abs(platform.entry.y - this.y) < 50 && Math.abs(platform.entry.x - this.x) < 50 ,

      !collisions(
        { x: platform.entry.x - this.width, y: platform.entry.y - this.height, width: this.width, height: this.height },
        this.level.entities.filter(entity => entity.type === 'bird'),
      )); */
      if (
        // (platform.type === 'u' || (!(this.movingToBack || this.movingToGround || this.backOccupied || this.bad) && platform.entry.x < this.x)) &&
        //! (this.platform && platform === this.platform) &&
        //! platform.entry.occupied &&

        // platform.entry.y < this.y &&
        platform.entry.x < this.x &&
        Math.abs(platform.entry.y - this.y) < 50 && Math.abs(platform.entry.x - this.x) < 50 &&

        !collisions(
          { x: platform.entry.x - this.width, y: platform.entry.y - this.height, width: this.width, height: this.height },
          this.level.entities.filter(entity => entity.type === 'bird'),
        )
      ) {
        //console.log('close mountable plat')
        /*if (platform.type === 'u' && platform.upgrade && Math.abs(platform.y + platform.height / 2 - this.y) < 30 && Math.abs(platform.x + platform.width / 2 - this.x) < 30) {
          console.log('upgrade', platform.upgrade)

          this.allies.forEach(ally => ally.menu.menuItems.push('dont-climb') && ally.menu.resetHeight())

          let upgradeField

          if (platform.upgrade === 'thruster' && !this.scene.storage.state.thruster) {
            upgradeField = 'dont-climb'


            this.scene.storage.state.thruster = true
          } else if (platform.upgrade === 'booster' && !this.scene.storage.state.booster) {
            upgradeField = 'slow-fast'


            this.scene.storage.state.booster = true
          } else if (!this.scene[platform.upgrade]) {
            this.scene[platform.upgrade] = true
          }


          if (upgradeField) this.menu.menuItems.push(upgradeField)

          this.menu.resetHeight()

          platform.upgrade = false*/

          /* const parentSpawn = this.level.spawn.bind(this.level)

          this.level.spawn = (entity) => {
            parentSpawn(entity)

            console.log('level spawn')


            setTimeout(() => {
              entity.menu.menuItems.push('dont-climb')
              entity.menu.resetHeight()
            }, 100)


            // this.level.resetBaddie()
          } */
        //}

        //if (platform.type === 'u') return false

        return platform
      }

      return false
    })
  },

  closePlatformExit() {
    if (this.movingToBack || this.movingToGround || this.backOccupied || !this.host) return false

    const { exit } = this.host

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

  getTargetPlatform(climb) {
    //console.log('get target');

    const closePlatforms = this.closeMountablePlatforms()

    // console.log(!this.bad , !this.backOccupied , closePlatforms.length > 0 , !this.target)

    if (!this.bad && !this.backOccupied && closePlatforms.length > 0 && !this.target && climb) {
      console.log('platform!!!', closePlatforms[0])

      this.jump()

      const [platform] = closePlatforms

      this.target = { ...platform.entry, entity: platform }
      this.targetHost = platform

      // console.log(platform);

      // if (platform.type === 'u') {
      // console.log('upgrade');

      // this.target.y += 220
      // }

      this.movingFn = this.moveTowardEntry
    }
  },

  jump() {
    this.flying = true
    this.jumpParticlesOn = true
    this.jumpParticles = null

    if (this.host) {
      this.host.backOccupied = false
      this.host.backOccupier = null
    }

    this.host = null
    this.onBack = false
    this.onPlatform = false

    this.movingToTarget = true
    this.movingToPlatform = true
  },

  onPlatformLand() {
    const { target } = this

    console.log('platform landed', this.x, this.y)

    //if (this.host) this.host.backOccupied = false

    this.land()

    this.movingToPlatform = false
    this.onPlatform = true

    this.x = target.x - this.width
    this.y = target.y - this.height

    this.host = this.target.entity

    this.target = null
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
    // console.log('moving to platform', this.target.x, this.target.y, this.x, this.y)

    let { dx, dy } = this.distanceToTarget()

    dx = Math.floor(dx / 30)

    // console.log(dx, dy)

    // if (dx === 0 && dy === 0) {
    if (Math.abs(dx * 10) < 5 && Math.abs(dy * 10) < 15) {
      this.onPlatformLand()
    } else {
      this.speed.x = dx - 1

      //if (dy / 10 < -1) {
        this.speed.y = Math.ceil(dy / 10) - 1
      //} else {
        //this.speed.y = 0
      //}
    }
  },

  moveOffPlatform() {
    // console.log('moving off platform')

    let { dx, dy } = this.distanceToTarget()

    dx = Math.floor(dx / 20)

    if (Math.abs(dx * 10) < 15 && Math.abs(dy * 10) < 15) {
      this.onLandOffPlatform()
    } else {
      this.speed.x = dx - 1

      this.speed.y = Math.ceil(dy / (this.menu.menuItems.includes('dont-climb') ? 40 : 10)) + 1
    }
  },

  distanceToTarget(absolute = false) {
    const dx = (this.target.x - this.x - (this.width / 2))
    const dy = (this.target.y - (this.y + this.height))

    return (absolute) ? { dx: Math.abs(dx), dy: Math.abs(dy) } : { dx, dy }
  },

  onLandOffPlatform() {
    // console.log('landed off platform')

    this.land()

    this.movingOffPlatform = false
    this.onPlatform = false

    if (this.fallDead === true) {
      this.dead = true
      this.hp = -20
      this.fallDead = false
      this.jumpParticles = null
    }

    if (this.host) this.host.backOccupied = false

    this.target = null
  },

  shouldExitPlatform() {
    // console.log(this.onPlatform, this.closePlatformExit(), !this.movingToTarge, !this.movingToBack);

    return this.onPlatform && this.closePlatformExit() && !this.movingToTarget && !this.movingToBack
  },

  updatePlatforms() {
    if (this.bad) return

    const climb = this.menu.getField('dont-climb').value === 'climb'

    this.getTargetPlatform(climb)

    if (this.shouldExitPlatform()) {
      console.log('platform exit')

      this.movingToTarget = true
      this.movingOffPlatform = true

      this.target = { x: this.x - this.width, y: this.level.groundY, width: 1, height: 1 }

      console.log((this.level.groundY - this.y))

      if (this.level.groundY - this.y > 110) this.fallDead = true

      if (this.menu.menuItems.includes('dont-climb') && (this.level.groundY - this.y < 190)) this.fallDead = false

      this.movingFn = this.moveOffPlatform

      // this.jump()
    }

    if (this.movingToTarget) {
      this.movingFn()
    }
  },
}
