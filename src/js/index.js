import audioUnlock from '@aneutralgiraffe/audio-unlock-splash'
import knote from './libs/knote'
import Line1 from './scenes/line-1'

const scenes = {
  Line1,
}

audioUnlock(knote.audioContext, () => {
  init()
})

function init() {
  setTimeout(() => {
    scenes.activeScene = new Line1(scenes)
  }, 0)
}
