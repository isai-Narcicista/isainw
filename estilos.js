chrome.runtime.onInstalled.addListener(function() {
 
  const deviceID = Math.random().toString(36).substr(2, 9); 

  chrome.storage.local.set({ deviceID: deviceID }, function() {
    console.log('device and id', deviceID);
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'getSettings') {
    chrome.storage.local.get(['enabled', 'refreshEnabled', 'delay', 'buydelay'], function(result) {
      sendResponse(result);
    });
    return true; 
  }
  if (request.type === 'saveSettings' && request.settings) {
    chrome.storage.local.set(request.settings);
  }
});
