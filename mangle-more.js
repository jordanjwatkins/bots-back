const fs = require('fs')

const path = 'build/app-1.min.js'

/*
  Example of logging out possible properties to try mangling for a given object

  console.log([
    ...Object.getOwnPropertyNames(Object.getPrototypeOf(someObject)),
    ...Object.getOwnPropertyNames(someObject)
  ])

  Update or remove property from mangle list if it is part of other property names (ex. init, update, draw)
  or conflicts with built-ins (width, height), etc.
*/
const line1 = ['findNextLevel', 'attachEvents', 'removeEvents', 'initLevel', 'cleanupEntities', 'isLineClick', 'initializeDom', 'initEntities', 'freshStart', 'startNextLevel', 'openWinSplash', 'birdParticles', 'portholeWipe', 'bestScoreForLevel', 'starScore', 'getBestScoreForLevel', 'getBestStarScoreForLevel', 'onClick', 'debug', 'mainCanvas', 'storage', 'showedTitle', 'showedExposition', 'canvasContainer', 'sceneContainer', 'isLastLevel', 'nextLevel', 'birdCount', 'pulser', 'lines', 'exposition', 'levelSelect', 'allFlying', 'gameOver', 'fadingOut', 'flyingBirdCount', 'gameLoop']
const mainCanvas = ['constructor', 'clickCoords', 'canvas', 'context', 'scanlines', 'clearCanvas', 'testRect', 'transform', 'flipX', 'rotateThing', 'drawRect', 'drawThing', 'isClickHit', 'clickAreaDebug', 'makeScanlines', 'drawScanlines', 'boundingRect', 'opacity']
const exposition = ['constructor', 'destroy', 'attachEvents', 'detachEvents', 'drawText', 'drawBackground', 'drawMayor', 'flicker']
const expositionKeys = ['onClick', 'color', 'opacity', 'scene', 'endTitle', 'textGroup', 'mayor', 'playedSound', 'textLines', 'textTimeout']
const level = ['starThresholds', 'absorberStarThresholds', 'optimalPulseCount', 'absorberOptimalPulseCount', 'birdCount', 'entities']
const pulser = ['constructor', 'destroy', 'canPulse', 'firePulse', 'updateChargeProgress', 'drawChargeProgress', 'drawCharges', 'moving', 'color', 'speed', 'chargeProgress', 'chargeSpeed', 'maxChargeCount', 'chargeCount', 'pulsesFiredCount']
const levelSelect = ['attachEvents', 'detachEvents', 'updateSquadNextX', 'getLevelIndexByName', 'drawBackground', 'drawGround', 'drawClouds', 'drawRoad', 'drawStars', 'drawStar', 'levelCount', 'type', 'ground', 'clouds', 'clickBoxes', 'starDelay', 'squadX']
const bird = ['pulseHit', 'swapLines', 'moveToNextLine', 'isOnLowestLine', 'isOnHighestLine', 'color', 'speed', 'maxSpeed', 'flying', 'direction', 'absorber', 'absorbed', 'type', 'verticalSwapper', 'startLine', 'initialY', 'lines', 'currentLine', 'currentLineIndex']
const gameLoop = ['updateLoop', 'pause', 'lastTimestamp', 'delta', 'updateFn', 'updateLoop', 'deltaSeconds', 'requestId']
const knote = ['audioContext', 'playNote', 'makeNote', 'playSequenceNote', 'songNote', 'songNoise']

let src = fs.readFileSync(path, 'UTF-8')

const namesToReplace = Array.from(new Set([
  ...line1,
  ...mainCanvas,
  ...exposition,
  ...expositionKeys,
  ...level,
  ...pulser,
  ...levelSelect,
  ...bird,
  ...gameLoop,
  ...knote,
]))

namesToReplace.forEach((name, index) => {
  const regex = new RegExp(`(key:")${name}(")`, 'g')
  const regex2 = new RegExp(`(\\.)${name}`, 'g')
  const regex3 = new RegExp(`${name}(:)`, 'g')

  src = src.replace(regex, replacer)
  src = src.replace(regex2, replacer2)
  src = src.replace(regex3, replacer3)

  function replacer(match, p1, p2) {
    return `${p1}z${index}${p2}`
  }

  function replacer2(match, p1) {
    return `${p1}z${index}`
  }

  function replacer3(match, p1) {
    return `z${index}${p1}`
  }
})

fs.writeFileSync('build/app-1.min.js', src, 'UTF-8')
