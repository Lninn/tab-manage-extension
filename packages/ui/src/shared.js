export async function getPages() {
  if (import.meta.env.DEV) return []

  const tabs = await chrome.tabs.query({})
  return tabs.map(tab => {
    const { title, url, id, favIconUrl } = tab

    const page = {
      id,
      title,
      url,
      favIconUrl,
    }

    return page
  })
}

export async function closePage(id) {
  await chrome.tabs.remove(id)
}

class TabEvt {
  constructor() {
    this.evts = []
    this.run = this.run.bind(this)

    this.setup()
  }

  setup() {
    if (import.meta.env.DEV) return

    chrome.tabs.onCreated.addListener(this.run)
    chrome.tabs.onRemoved.addListener(this.run)
    chrome.tabs.onUpdated.addListener(this.run)
  }

  register(fn) {
    this.evts.push(fn)
  }

  run() {
    for (const fn of this.evts) {
      fn()
    }
  }
}

export const tabEvt = new TabEvt()
