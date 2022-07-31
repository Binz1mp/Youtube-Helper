chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.create({
    url: chrome.runtime.getURL("changelog/update.html"),
  });
});