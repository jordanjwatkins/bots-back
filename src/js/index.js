import Line1Scene from './scenes/line-1'

const scenes = {
  Line1: Line1Scene,
}

init()

function init() {
  setTimeout(() => {
    scenes.activeScene = new Line1Scene(scenes)
  }, 0)
}

if (module.hot) {
  module.hot.accept('./scenes/line-1', () => {
    document.body.innerHTML = ''

    scenes.activeScene = new Line1Scene(scenes)
  })
}

