import * as sounds from './sounds'

function update(scene, delta, extras) {
  const { mainCanvas, entities } = scene

  mainCanvas.clearCanvas()

  // background z of 1
  updateEntities(entities, scene, 1, delta)

  // midground z of 2
  updateEntities(entities, scene, 2, delta)

  // draw foreground at z of 3
  updateEntities(entities, scene, 3, delta)

  // draw overlay at z of 4
  updateEntities(entities, scene, 4, delta)

  if (extras) extras()

  mainCanvas.drawScanlines()

  // win scene
  if (scene.flyingBirdCount === scene.birdCount) {
    if (scene.allFlying) return

    const fired = scene.pulser.pulsesFiredCount

    if (scene.bestScoreForLevel < 1 || fired < scene.bestScoreForLevel) scene.bestScoreForLevel = fired

    scene.openWinSplash()

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

    if (entity.type === 'bird' && entity.flying) {
      scene.flyingBirdCount += 1
    }
  })
}

export default update
