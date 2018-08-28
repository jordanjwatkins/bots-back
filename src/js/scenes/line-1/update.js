import { jump4 } from './sound'

function update(scene) {
  const { mainCanvas, entities } = scene

  mainCanvas.clear()

  // background z of 1
  updateEntities(entities, scene, 1)

  // draw foreground at z of 3
  updateEntities(entities, scene, 3)

  // win scene
  if (scene.win && !scene.gameOver) {
    scene.gameOver = true

    setTimeout(() => {
      scene.fadingOut = true
    }, 1000)

    setTimeout(() => {
      scene.freshStart()
    }, 2000)
  }
}

function updateEntities(entities, scene, z) {
  if (!entities) return

  let flyingBirdCount = 0

  entities.forEach((entity) => {
    if (entity.z === z) entity.update(scene)

    if (entity.constructor.name === 'Bird' && entity.flying) {
      flyingBirdCount += 1
    }
  })

  scene.mainCanvas.drawScanlines()

  if (flyingBirdCount === scene.birdCount) {
    if (scene.allFlying) return

    console.log('WWWIIIINNNN!!!!!')

    scene.allFlying = true

    jump4()
  }
}

export default update
