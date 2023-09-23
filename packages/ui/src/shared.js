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

const list = []

function run() {
  for (const fn of list) {
    fn()
  }
}

function setup() {
  if (import.meta.env.DEV) return

  chrome.tabs.onCreated.addListener(run)
  chrome.tabs.onRemoved.addListener(run)
  chrome.tabs.onUpdated.addListener(run)
}

setup()

export function dispatch(fn) {
  list.push(fn)
}
