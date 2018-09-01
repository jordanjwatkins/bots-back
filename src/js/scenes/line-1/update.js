import { jump4 } from './sound'

function update(scene) {
  const { mainCanvas, entities } = scene

  mainCanvas.clear()

  // background z of 1
  updateEntities(entities, scene, 1)

  // draw foreground at z of 3
  //updateEntities(entities, scene, 3)

  // draw overlay at z of 4
  //updateEntities(entities, scene, 4)

  mainCanvas.drawScanlines()

  // win scene
  if (scene.flyingBirdCount === scene.birdCount) {
    if (scene.allFlying) return

    const fired = scene.pulser.pulsesFiredCount

    if (scene.bestScoreForLevel === 0 || fired < scene.bestScoreForLevel) scene.bestScoreForLevel = fired

    console.log('WWWIIIINNNN!!!!!', fired)

    scene.winSplash();

    scene.allFlying = true

    jump4()
  }
}

function updateEntities(entities, scene, z) {
  if (!entities) return

  scene.flyingBirdCount = 0

  entities.forEach((entity) => {
    if (entity.z === z) entity.update(scene)

    if (entity.constructor.name === 'Bird' && entity.flying) {
      scene.flyingBirdCount += 1
    }
  })
}

export default update
