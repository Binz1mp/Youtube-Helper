chrome.runtime.onInstalled.addListener(function (details) {
  var lang = "undefined";
  if(navigator.language !=null) {
    lang = navigator.language;
  }
  lang = lang.toLocaleLowerCase().substring(0,2);
  const reason = details.reason;
  switch(reason) {
    // case 'install': {  }
    case 'install':
      if (lang == "ko") {
        chrome.tabs.create({
          url: chrome.runtime.getURL("changelog/update_ko.html"),
        });
      } else {
        chrome.tabs.create({
          url: chrome.runtime.getURL("changelog/update_en.html"),
        });
      }
      break;
    case 'update':
      if (lang == "ko") {
        chrome.tabs.create({
          url: chrome.runtime.getURL("changelog/update_ko.html"),
        });
      } else {
        chrome.tabs.create({
          url: chrome.runtime.getURL("changelog/update_en.html"),
        });
      }
      break;
    case 'chrome_update': break;
    case 'shared_module_update': break;
  }
});