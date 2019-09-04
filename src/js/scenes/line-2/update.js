import * as sounds from './sounds'

function update(scene, delta, extras) {
  const { mainCanvas, entities } = scene

  scene.level.update()

  mainCanvas.lateRenders = []

  mainCanvas.clearCanvas()

  // background z of 1
  updateEntities(entities, scene, 1, delta)

  // midground z of 2
  updateEntities(entities, scene, 2, delta)

  // draw foreground at z of 3
  updateEntities(entities, scene, 3, delta)

  // draw foreground 2 at z of 4
  updateEntities(entities, scene, 4, delta)

  // draw foreground 3 at z of 5
  updateEntities(entities, scene, 5, delta)

  // draw overlay at z of 6
  updateEntities(entities, scene, 6, delta)

  mainCanvas.lateRenders.forEach(drawFn => drawFn())

  if (mainCanvas.selected && mainCanvas.selected.selected) mainCanvas.drawSelectedRect(mainCanvas.selected, 10)

  if (extras) extras()

  // mainCanvas.drawRollingLine()
  mainCanvas.drawRollingLineReversed()
  // mainCanvas.drawRollingLine2()

  mainCanvas.drawScanlines()

  mainCanvas.drawNoise()

  mainCanvas.drawVignette()

  //mainCanvas.drawTriangle2(200, 200, 3, true)

  //mainCanvas.drawTriangleFromPoints([{ x: 200, y: 200 }, { x: 220, y: 220 }, { x: 240, y: 140 }], 3)

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
