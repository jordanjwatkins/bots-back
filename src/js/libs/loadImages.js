function loadImages(imagesToLoad) {
  const images = {}

  Object.keys(imagesToLoad).forEach(name => loadImage(imagesToLoad[name], name, images))

  return images
}

function loadImage(url, name, images) {
  const img = new Image()

  img.src = url

  img.onload = () => {
    images[name] = img
  }
}

export default loadImages
