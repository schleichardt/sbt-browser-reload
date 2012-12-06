var tabs = [];

chrome.browserAction.onClicked.addListener(function(tab) {
  
 
  

  if(pluginIsActive(tab)) {
    deactivate(tab);
  } else {
    activate(tab);
  } 
  
});

var pluginIsActive = function(tab) {
  return tabs[tab.id] === true;
}

var activate = function(tab) {
  tabs[tab.id] = true;
  chrome.browserAction.setIcon({path:"icons/iconOn.png", tabId:tab.id});
  
  
  var req = new XMLHttpRequest();
  req.open("GET", "http://localhost:5555/poll", true);
  req.onload = function(){
      chrome.extension.getBackgroundPage().console.log("called3");

      chrome.tabs.reload(tab.id, {bypassCache: true});
      activate(tab);
  };
  req.send(null);
}

var deactivate = function(tab) {
  tabs[tab.id] = false;
  chrome.browserAction.setIcon({path:"icons/iconOff.png", tabId:tab.id});
}
