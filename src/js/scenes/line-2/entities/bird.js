import birdBacks from './bird/bird-backs'
import birdEvents from './bird/bird-events'
import birdJumpParticles from './bird/bird-jump-particles'
import birdPlatforms from './bird/bird-platforms'
import birdUpdate from './bird/bird-update'
import birdDraw from './bird/bird-draw'

class Bird {
  constructor(props) {
    const defaults = {
      x: 0,
      y: 0,
      z: 3,
      width: 20,
      height: 20,
      color: '#AC3232',
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
  }

  onClick = event => this.onClickFn(event)

  destroy() {
    this.menu.destroy()
    if (this.eventsAttached) this.detachEvents(this.mainCanvas)
  }
}

Object.assign(Bird.prototype, birdUpdate, birdDraw, birdEvents, birdBacks, birdJumpParticles, birdPlatforms)

export default Bird
