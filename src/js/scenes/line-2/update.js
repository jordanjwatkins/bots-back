//import * as sounds from './sounds'
//import knote from '../../libs/knote'

let showTitle = true

let zoom = 5.8
//zoom = 1

let zoomingOut = false

setTimeout(() => {
  zoomingOut = true
}, (showTitle) ? 14000 : 7000)

/*let slow = false
setTimeout(() => {
  slow = true

  setTimeout(() => {
    slow = false
  }, 2000)
}, 8000)*/

//let skipFrames = 6
//let skippedFrames = 0

let titleCanvas

let fontSize = 39
let scaleTitle = false
setTimeout(() => {
  scaleTitle = true
}, 3000);



function update(scene, delta, extras) {
  /*if (slow) {
    const val = Math.sin(Date.now() / 1)

    if (val < 0) {
      //return
    }

    scene.skipFrames = 6

    if (skippedFrames < scene.skipFrames) {
      skippedFrames += 1
      return
    } else {
      skippedFrames = 1
    }
  } else {
    scene.skipFrames = 1
  }*/


  const { mainCanvas, entities, level } = scene
  const { groups } = level

  if (showTitle) {
    titleCanvas = titleCanvas || mainCanvas.imageFx.initOffCanvas({ key: 'title', width: mainCanvas.canvas.width, height: mainCanvas.canvas.height, bgColor: '#000' })

    titleCanvas.context.font = `${fontSize}px monospace`

    if (!scaleTitle) titleCanvas.context.fillStyle = '#000'
    if (!scaleTitle) titleCanvas.clear()
    if (!scaleTitle) titleCanvas.drawRect({ x: 0, y: 0, width: titleCanvas.canvas.width, height: titleCanvas.canvas.height })
    if (scaleTitle) fontSize += 11

    if (scaleTitle) titleCanvas.context.globalCompositeOperation = 'destination-out'

    titleCanvas.context.fillStyle = '#FFF'

    titleCanvas.context.fillText(`Bot's`, 110 - fontSize / 3, fontSize / 3 + 100)
    titleCanvas.context.fillText(`Back`, 110 - fontSize / 3, fontSize / 3 + 200)
  }

  if (level.update) scene.level.update()

  mainCanvas.lateRenders = []

  //mainCanvas.clearCanvas()

  // draw background color so zoom works

  mainCanvas.drawRect({ x: 0, y: 0, width: mainCanvas.canvas.width, height: mainCanvas.canvas.height, color: '#1d0b15' })
  mainCanvas.drawRect({ x: 0, y: 200, width: mainCanvas.canvas.width, height: mainCanvas.canvas.height, color: '#1d122b' })
  mainCanvas.drawRect({ x: 0, y: 400, width: mainCanvas.canvas.width, height: mainCanvas.canvas.height, color: '#34085d' })

  // background z of 1
  updateEntities(entities, scene, 1, delta)

  // midground z of 2
  updateEntities(entities, scene, 2, delta)

  if (groups) groups.platforms.forEach(entity => entity.update(scene, delta))

  if (groups) groups.platforms[0].drawAll()
  if (groups) groups.platforms[0].drawLate()

  // draw foreground at z of 3
  updateEntities(entities, scene, 3, delta)

  // draw foreground 2 at z of 4
  updateEntities(entities, scene, 4, delta)

  // draw foreground 3 at z of 5
  updateEntities(entities, scene, 5, delta)

  // draw overlay at z of 6
  updateEntities(entities, scene, 6, delta)


  mainCanvas.lateRenders.forEach(drawFn => drawFn())


  if (mainCanvas.selected && mainCanvas.selected.selected && !mainCanvas.selected.bad) mainCanvas.drawSelectedRect(mainCanvas.selected, 10, 2, '#111')

  if (extras) extras()


  zoomOut(mainCanvas)

  // mainCanvas.drawRollingLine()
  mainCanvas.drawRollingLineReversed()
  // mainCanvas.drawRollingLine2()

  mainCanvas.drawScanlines()

  mainCanvas.drawNoise()

  mainCanvas.drawVignette()

  // mainCanvas.drawTriangle2(200, 200, 3, true)

  // mainCanvas.drawTriangleFromPoints([{ x: 200, y: 200 }, { x: 220, y: 220 }, { x: 240, y: 140 }], 3)

  // win scene
  /*if (scene.flyingBirdCount === scene.birdCount) {
    if (scene.allFlying) return

    const fired = scene.pulser.pulsesFiredCount

    if (scene.bestScoreForLevel < 1 || fired < scene.bestScoreForLevel) scene.bestScoreForLevel = fired

    scene.openWinSplash()

    scene.allFlying = true

    setTimeout(() => {
      sounds.quickEnd()
    }, 500)
  }*/

  if (showTitle) mainCanvas.context.drawImage(titleCanvas.canvas, 0, 0, mainCanvas.canvas.width, mainCanvas.canvas.height)
}

function zoomOut(mainCanvas) {
  // basic zoom out
  if (zoom > 0 && zoomingOut) {
    zoom -= 0.05
  }

  if (zoom < 1) zoom = 1

  mainCanvas.context.drawImage(
    mainCanvas.canvas,
    -((mainCanvas.canvas.width * zoom) / 2) - (zoom - 2) * 500,
    -((mainCanvas.canvas.height * zoom) / 2) - (zoom - 2) * 300 + (32 * (zoom - 1)),
    mainCanvas.canvas.width * zoom,
    mainCanvas.canvas.height * zoom,
  )
}

function updateEntities(entities, scene, z, delta) {
  if (!entities) return

  scene.flyingBirdCount = 0

  entities.forEach((entity) => {
    //if (entity.isFrozen) slow = true
    if (entity.z === z) entity.update(scene, delta)

    if (entity.type === 'bird' && entity.flying) {
      scene.flyingBirdCount += 1
    }
  })
}

export default update
