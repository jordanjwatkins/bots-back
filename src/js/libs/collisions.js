export function boxesCollide(box1, box2, offset = { x: 0, y: 0 }) {
  if (box1 === box2) return false

  return (
    box1.x + offset.x < box2.x + box2.width &&
    box1.x + offset.x + box1.width > box2.x &&
    box1.y + offset.y < box2.y + box2.height &&
    box1.height + box1.y + offset.y > box2.y
  )
}

export function getCollisionInfo(box1, box2, offset) {
  if (!boxesCollide(box1, box2, offset)) return false

  return {
    box1,
    box2,
  }
}

export function collisions(inBox, boxes, offset) {
  const collisions = []

  boxes.forEach((box) => {
    const collision = getCollisionInfo(inBox, box, offset)

    if (collision) collisions.push(collision)
  })

  return (collisions.length > 0) ? collisions : false
}
