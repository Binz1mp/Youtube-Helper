chrome.runtime.onInstalled.addListener(function () {
  var lang = "undefined";
  if(navigator.language !=null) {
    lang = navigator.language;
  }
  lang = lang.toLocaleLowerCase().substring(0.2);
  if (lang == "ko") {
    chrome.tabs.create({
      url: chrome.runtime.getURL("changelog/update_ko.html"),
    });
  } else {
    chrome.tabs.create({
      url: chrome.runtime.getURL("changelog/update_en.html"),
    });
  }
});