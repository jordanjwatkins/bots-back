const skipAllIntro = false
let showTitle = true

let zoom = 3

if (!showTitle) {
  zoom = 1
}

let zoomingOut = false

setTimeout(() => {
  zoomingOut = true
}, (showTitle) ? 8000 : 2000)

let titleCanvas

let fontSize = 69

let scaleTitle = false
let skipped = false

setTimeout(() => {
  scaleTitle = true
}, 3000)

function update(scene, delta) {
  const { mainCanvas, entities, level } = scene
  const { groups } = level

  if (scaleTitle && zoom > 1) {
    mainCanvas.imageFx.static(-0.01)
  }

  if (showTitle) {
    titleCanvas = titleCanvas || mainCanvas.imageFx.initOffCanvas({ key: 'title', width: mainCanvas.canvas.width, height: mainCanvas.canvas.height, bgColor: '#000' })

    titleCanvas.context.font = `${fontSize}px monospace`

    if (!scaleTitle) titleCanvas.context.fillStyle = '#000'
    if (!scaleTitle) titleCanvas.clear()
    if (!scaleTitle) titleCanvas.drawRect({ x: 0, y: 0, width: titleCanvas.canvas.width, height: titleCanvas.canvas.height })
    if (scaleTitle) fontSize += 11

    if (scaleTitle) titleCanvas.context.globalCompositeOperation = 'destination-out'

    titleCanvas.context.fillStyle = '#FFF'

    titleCanvas.context.fillText('Bot\'s', 110 - fontSize / 3, fontSize / 3 + 100)
    titleCanvas.context.fillText('Back', 110 - fontSize / 3, fontSize / 3 + 200)
  }

  mainCanvas.lateRenders = []

  if (level.update) scene.level.update()

  // background colors
  mainCanvas.drawRect({ x: 0, y: 0, width: mainCanvas.canvas.width, height: mainCanvas.canvas.height, color: '#1d0b15' })
  mainCanvas.drawRect({ x: 0, y: 200, width: mainCanvas.canvas.width, height: mainCanvas.canvas.height, color: '#1d122b' })
  mainCanvas.drawRect({ x: 0, y: 400, width: mainCanvas.canvas.width, height: mainCanvas.canvas.height, color: '#34085d' })

  // background z of 1
  updateEntities(entities, scene, 1, delta)

  // midground z of 2
  updateEntities(entities, scene, 2, delta)

  if (groups) groups.platforms.forEach(entity => entity.update(scene, delta))

  if (groups) groups.platforms[0].drawAll()



  // draw foreground at z of 3
  updateEntities(entities, scene, 3, delta)

  // draw foreground 2 at z of 4
  updateEntities(entities, scene, 4, delta)

  // draw foreground 3 at z of 5
  updateEntities(entities, scene, 5, delta)

  mainCanvas.lateRenders.forEach(drawFn => drawFn())

  if (groups) groups.platforms[0].drawLate()

  // draw overlay at z of 6
  updateEntities(entities, scene, 6, delta)

  if (mainCanvas.selected && mainCanvas.selected.selected && !mainCanvas.selected.bad) mainCanvas.drawSelectedRect(mainCanvas.selected, 10, 2, '#fff')

  if (level.gameWon) {
    mainCanvas.drawRect({ x: 0, y: 0, width: mainCanvas.width, height: mainCanvas.width, color: '#FFF' })

    mainCanvas.context.fillStyle = '#000'
    mainCanvas.context.textAlign = 'left'
    if (level.winText) mainCanvas.context.fillText('Bot\'s Back', 80, 90)
    if (level.winText) mainCanvas.context.fillText('Jordan J Watkins - JS13K 2019', 80, 120)
  }

  zoomOut(mainCanvas)

  mainCanvas.drawNoise()

  if (showTitle) mainCanvas.context.drawImage(titleCanvas.canvas, 0, 0, mainCanvas.canvas.width, mainCanvas.canvas.height)

  mainCanvas.drawRollingLineReversed()

  mainCanvas.drawScanlines()

  mainCanvas.drawVignette()
  if ((scene.currentLevel !== 'basics' || skipAllIntro) && !skipped) {
    skipped = true
    zoom = 1
    showTitle = false
    scene.pulser.eyeOffset = 100
    scene.mainCanvas.imageFx.static(-1)
  }
}

function zoomOut(mainCanvas) {
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
    if (entity.z === z) entity.update(scene, delta)

    if (entity.type === 'bird' && entity.flying) {
      scene.flyingBirdCount += 1
    }
  })
}

export default update
