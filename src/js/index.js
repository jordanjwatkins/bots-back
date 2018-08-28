import Line1Scene from './scenes/line-1'

init()

function init() {
  const scenes = {
    Line1: Line1Scene,
  }

  document.body.classList.add('title-screen')

  setTimeout(() => {
    document.body.classList.remove('title-screen')
  }, 2500)

  setTimeout(() => {
    scenes.activeScene = new Line1Scene(scenes)
  }, 0)
}

