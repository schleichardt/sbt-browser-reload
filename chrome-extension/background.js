var tabs = [];


chrome.tabs.onUpdated.addListener(tab_updated);
function tab_updated(tabId, changeInfo, tab) {
    chrome.extension.getBackgroundPage().console.log("called5");
    if(pluginIsActive(tab)) {
        activate(tab);
    } else {
        deactivate(tab);
    }
};


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
    chrome.browserAction.setBadgeText({text: "", tabId: tab.id});
    chrome.browserAction.setTitle({title: "Activated: on source code change this page will reload.", tabId: tab.id});


    var req = new XMLHttpRequest();
    req.open("GET", "http://localhost:5555/poll", true);
    req.onload = function(){
        if(pluginIsActive(tab)) {
            chrome.tabs.reload(tab.id, {bypassCache: true});
            activate(tab);
        }
    };
    req.onerror = function() {
        chrome.browserAction.setBadgeText({text: "err", tabId: tab.id});
        chrome.browserAction.setTitle({title: "Can't connect to SBT application. Have you started it with 'sbt ~run'?", tabId: tab.id});
        deactivate(tab);
    }
    req.send();
}

var deactivate = function(tab) {
    tabs[tab.id] = false;
    chrome.browserAction.setIcon({path:"icons/iconOff.png", tabId:tab.id});
}
