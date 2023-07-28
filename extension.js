let enabled = false;
let refreshEnabled = false;
let delay = 1010;
let buydelay = 50; // tiempo auto en milisegundos
let refreshIntervalId;
let buyIntervalId;

function snipeitem() {
  const buyButton = document.querySelector('button.btn-growth-lg.btn-fixed-width-lg.PurchaseButton');
  const itemPrice = document.querySelector('div.item-price-value span.text');
  const getNowButton = document.querySelector('.modal-button'); // Get the "Get Now" button
  const quantityLeftMessage = document.querySelector('div.font-caption-body');

  if (enabled && buyButton && itemPrice && itemPrice.textContent === 'Free' && !quantityLeftMessage.textContent.includes('Quantity Left: 0/')) {
    buyButton.click();
    setTimeout(() => {
      getNowButton.click();
    }, 10);
  }
}


function refreshItems() {
  const refreshButton = document.querySelector('span#refresh-details-button');

  if (refreshButton && refreshEnabled) {
    refreshButton.click();
  }
}

function startBuyInterval() {
  if (!buyIntervalId) {
    buyIntervalId = setInterval(snipeitem, buydelay); //empezar a refrescar
  }
}

function stopBuyInterval() {
  if (buyIntervalId) {
    clearInterval(buyIntervalId); // Stop the refresh action
    buyIntervalId = null;
  }
}

chrome.storage.local.get(['deviceID'], function(result) {
  const deviceID = result.deviceID;

  if (deviceID) {
    // El ID del dispositivo existe, habilite la extensión
    enabled = true;
    startBuyInterval();

    chrome.runtime.sendMessage({ type: 'saveSettings', settings: { enabled: enabled } });
  }
});

chrome.runtime.onMessage.addListener(function(request) {
  if (request.enabled !== undefined) {
    enabled = request.enabled;
    if (!enabled) {
      stopBuyInterval(); // parar cuando se para
      refreshIntervalId = null;
    } else if (enabled && !buyIntervalId) {
      startBuyInterval(); // iniciar cuando se inicia
    }
    chrome.runtime.sendMessage({ type: 'saveSettings', settings: { enabled: enabled } });
  }
  if (request.buydelay !== undefined) {
    buydelay = request.buydelay;
    if (enabled && buyIntervalId) {
      clearInterval(buyIntervalId); // limpiar
      startBuyInterval(); // iniciar nuevo con el delay actualizado
    }
    chrome.runtime.sendMessage({ type: 'saveSettings', settings: { buydelay: buydelay } });
  }
  if (request.refreshEnabled !== undefined) {
    refreshEnabled = request.refreshEnabled;
    if (!refreshEnabled) {
      clearInterval(refreshIntervalId); // parar de refrescar
      refreshIntervalId = null;
    } else if (refreshEnabled && !refreshIntervalId) {
      refreshIntervalId = setInterval(refreshItems, delay);
    }
    chrome.runtime.sendMessage({ type: 'saveSettings', settings: { refreshEnabled: refreshEnabled } });
  }
  if (request.delay !== undefined) {
    delay = request.delay;
    if (refreshEnabled && refreshIntervalId) {
      clearInterval(refreshIntervalId); 
      refreshIntervalId = setInterval(refreshItems, delay); 
    }
    chrome.runtime.sendMessage({ type: 'saveSettings', settings: { delay: delay } });
  }
});
