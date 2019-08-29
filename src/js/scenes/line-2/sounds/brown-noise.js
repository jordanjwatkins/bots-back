import knote from '../../../libs/knote'

const brownNoiseNode = (() => {
  const bufferSize = 4096

  let lastOut = 0.0
  const node = knote.audioContext.createScriptProcessor(bufferSize, 1, 1)

  node.onaudioprocess = (e) => {
    const output = e.outputBuffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1

      output[i] = (lastOut + (0.02 * white)) / 1.02
      lastOut = output[i]
      output[i] *= 3.5 // (roughly) compensate for gain
    }
  }

  return node
})()

export default function brownNoise(duration) {
  brownNoiseNode.connect(knote.audioContext.destination)

  setTimeout(() => {
    brownNoiseNode.disconnect()
  }, duration)
}
