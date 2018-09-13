import Line1 from './scenes/line-1'

const scenes = {
  Line1,
}

init()

function init() {
  setTimeout(() => {
    scenes.activeScene = new Line1(scenes)
  }, 0)
}
