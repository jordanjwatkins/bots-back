const initialState = () => ({
  currentLevel: 'oneLineTwoSimple',
  levels: {
    oneLineTwoSimple: {},
  },
})

class Storage {
  constructor(namespace) {
    this.namespace = namespace

    // try to load saved state for namespace
    this.load()

    // else save initial state
    if (!this.state) {
      this.state = initialState()
      this.save()
    }
  }

  save() {
    localStorage.setItem(this.namespace, JSON.stringify(this.state))
  }

  load() {
    this.state = JSON.parse(localStorage.getItem(this.namespace))
  }
}

export default Storage
