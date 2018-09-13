import Line1 from './scenes/line-1'
import knote from './libs/knote'

const scenes = {
  Line1,
}

init()

function init() {
  setTimeout(() => {
    scenes.activeScene = new Line1(scenes)
    console.log(scenes.activeScene);

    console.log([
      ...Object.getOwnPropertyNames(Object.getPrototypeOf(knote)),
      ...Object.getOwnPropertyNames(scenes.activeScene)
    ])

  }, 0)
}

if (module.hot) {
  module.hot.accept('./scenes/line-1', () => {
    document.body.innerHTML = ''

    scenes.activeScene = new Line1(scenes)
  })
}

