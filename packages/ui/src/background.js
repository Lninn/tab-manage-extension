console.log('background.js', chrome.tabs)

chrome.runtime.onInstalled.addListener(({reason}) => {
  if (reason === 'install') {
    createIndexPage();
  } else if (reason === 'update') {
    createIndexPage();
  }
});

chrome.action.onClicked.addListener(() => {
  createIndexPage();
})

function createIndexPage() {
  chrome.tabs.create({
    url: "index.html"
  });
}
