import audioUnlock from '@aneutralgiraffe/audio-unlock-splash'
import knote from './libs/knote'
import Line2 from './scenes/line-2'

const scenes = {
  Line2,
}

audioUnlock(knote.audioContext, () => {
  init()
})

function init() {
  setTimeout(() => {
    scenes.activeScene = new Line2(scenes)
  }, 0)
}
