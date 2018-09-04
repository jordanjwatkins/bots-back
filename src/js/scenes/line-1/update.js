import * as sounds from './sounds'

function update(scene, delta) {
  const { mainCanvas, entities } = scene

  mainCanvas.clear()

  // background z of 1
  updateEntities(entities, scene, 1, delta)

  // draw foreground at z of 3
  updateEntities(entities, scene, 3, delta)

  // draw overlay at z of 4
  updateEntities(entities, scene, 4, delta)

  mainCanvas.drawScanlines()

  // win scene
  if (scene.flyingBirdCount === scene.birdCount) {
    if (scene.allFlying) return

    const fired = scene.pulser.pulsesFiredCount

    if (scene.bestScoreForLevel === 0 || fired < scene.bestScoreForLevel) scene.bestScoreForLevel = fired

    scene.winSplash()

    scene.allFlying = true

    setTimeout(() => {
      sounds.quickEnd()
    }, 500)
  }
}

function updateEntities(entities, scene, z, delta) {
  if (!entities) return

  scene.flyingBirdCount = 0

  entities.forEach((entity) => {
    if (entity.z === z) entity.update(scene, delta)

    if (entity.constructor.name === 'Bird' && entity.flying) {
      scene.flyingBirdCount += 1
    }
  })
}

export default update
