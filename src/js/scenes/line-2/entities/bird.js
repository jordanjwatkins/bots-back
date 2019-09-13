import birdBacks from './bird/bird-backs'
import birdEvents from './bird/bird-events'
import birdJumpParticles from './bird/bird-jump-particles'
import birdPlatforms from './bird/bird-platforms'
import birdUpdate from './bird/bird-update'
import birdDraw from './bird/bird-draw'
import birdSpawnScan from './bird/bird-spawn-scan'

class Bird {
  constructor(props) {
    const defaults = {
      x: 0,
      y: 0,
      z: 3,
      width: 30,
      height: 30,
      color: '#2472ff',
      speed: {
        x: 0,
        y: 0,
      },
      maxSpeed: {
        x: 0,
        y: 4,
      },
      flying: false,
      direction: 0,
      absorber: false,
      absorbed: 0,
      type: 'bird',
      directionX: (props.bad) ? 1 : -1,
      hp: 100,
      maxHp: 100,
      damage: 1,
    }

    Object.assign(this, defaults, props)

    this.initialY = this.y

    if (this.bad) {
      this.damage = 2
      this.hp = 150
      this.color = '#000'
    }
  }

  onClick = event => this.onClickFn(event)

  destroy() {
    if (this.menu) this.menu.destroy()
    if (this.eventsAttached) this.detachEvents(this.mainCanvas)
  }
}

Object.assign(
  Bird.prototype,
  birdUpdate,
  birdDraw,
  birdEvents,
  birdBacks,
  birdJumpParticles,
  birdPlatforms,
  birdSpawnScan,
)

export default Bird
