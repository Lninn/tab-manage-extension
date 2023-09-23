console.log('background.js', chrome.tabs)

chrome.runtime.onInstalled.addListener(({reason}) => {
  console.log('reason ', reason)
  if (reason === 'install') {
    chrome.tabs.create({
      url: "index.html"
    });
  } else if (reason === 'update') {
    chrome.tabs.create({
      url: "index.html"
    });
  }
});
