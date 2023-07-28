document.addEventListener('DOMContentLoaded', function() {
  var scriptCheckbox = document.getElementById('scriptCheckbox');
  var refreshCheckbox = document.getElementById('refreshCheckbox');
  var delayInput = document.getElementById('delayInput');
  var buydelayInput = document.getElementById('buydelayInput');

  scriptCheckbox.addEventListener('change', function() {
    var enabled = scriptCheckbox.checked;
    sendMessageToActiveTab({ enabled: enabled });
  });

  refreshCheckbox.addEventListener('change', function() {
    var enabled = refreshCheckbox.checked;
    sendMessageToActiveTab({ refreshEnabled: enabled });
  });

  delayInput.addEventListener('change', function() {
    var delay = parseInt(delayInput.value, 10);
    sendMessageToActiveTab({ delay: delay });
  });

  buydelayInput.addEventListener('change', function() {
    var buydelay = parseInt(buydelayInput.value, 10);
    sendMessageToActiveTab({ buydelay: buydelay });
  });

  document.getElementById('discordButton').addEventListener('click', function() {
    window.open('https://discord.gg/isaisniper');
  });
  
  function sendMessageToActiveTab(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message);
    });
  }

  chrome.storage.local.get(['enabled', 'refreshEnabled', 'delay', 'buydelay'], function(result) {
    scriptCheckbox.checked = result.enabled || false;
    refreshCheckbox.checked = result.refreshEnabled || false;
    delayInput.value = result.delay || 1010;
    buydelayInput.value = result.buydelay || 50;
  });
});
