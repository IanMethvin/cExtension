localStorageKey_TickerList = "tickerList";
localStorageKey_DefaultSymbols = "defaultSymbols";
localStorageKey_ActiveTickerTab = "activeTickerTab";

// Yahoo Api Url for querying tickers.
yahooApiUrl = "https://partner-query.finance.yahoo.com/v7/finance/spark?symbols={tickers}"
+ "&range=1d&interval=1m&indicators=close&includeTimestamps=false&includePrePost=false&corsDomain=finance.yahoo.com";

// Default list of ticker symbols, if no list is initially provided.
var ds = {[localStorageKey_DefaultSymbols]: ['amd', 'msft', 'voo']};

var extensionInitialized = false;

// Register browser action -- initial click of extension icon.
chrome.browserAction.onClicked.addListener(function(tab) {
    if (!extensionInitialized) {
        // Reset local storage value for the current active tab.
        chrome.storage.local.remove(localStorageKey_ActiveTickerTab);

        // Initialize storage of default symbols and set default ticker tab.
        retrieveTickerList(true);
        extensionInitialized = true;
    }
    else {
        chrome.runtime.sendMessage({type:'clearSlider'});
        extensionInitialized = false;
    }
});

// Set and return the local storage value for default symbols.
function setDefaultSymbols() {
    chrome.storage.local.set(ds);
    return ds.defaultSymbols;
}

// If exists, return the currently active ticker tab.
// Otherwise, query the active tab and save the value to local storage.
function getActiveTickerTab(callBack) {
    chrome.storage.local.get(localStorageKey_ActiveTickerTab, function(result) {
        // If there is no saved active tab
        if (!result || !result.activeTickerTab) {
            // Query for the tab that is active and belongs to the current focused window.
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ 
                if (tabs.length > 0) {
                    var activeTickerTab = tabs[0];
                    chrome.storage.local.set({[localStorageKey_ActiveTickerTab]: activeTickerTab});

                    if (callBack) {
                        // Trigger callback function with current active tab value.
                        callBack(activeTickerTab);
                    }
                }
            });
        }
        else {
            if (callBack) {
                // Trigger callback function with current active tab value.
                callBack(result.activeTickerTab);
            }
        }
    });
}

// Trigger refresh actions to update on the new ticker list.
function refreshTickerList(newTickerList, updateContentScripts) {
    // Trigger refresh action through runtime message to update all background script listeners.
    chrome.runtime.sendMessage({type:'refreshTickerList', value: newTickerList});
    
    // Trigger refresh action through runtime message to update all content script listeners.
    if (updateContentScripts) {
        getActiveTickerTab(function (activeTickerTab){
            chrome.tabs.sendMessage(activeTickerTab.id, {type:'refreshTickerList', value: newTickerList});
        });
    }
}

// Returns the currently saved ticker list.
function retrieveTickerList(triggerRefresh, callBack) {
    chrome.storage.local.get(localStorageKey_TickerList, function(result){
        var tickerList = result.tickerList;

        // If no ticker list exists, initialize the ticker list with the default symbols list.
        if (!tickerList) {
            chrome.storage.local.get(localStorageKey_DefaultSymbols, function(result){
                var defaultSymbolsList =  (result.defaultSymbols ? result.defaultSymbols : setDefaultSymbols());
                tickerList = defaultSymbolsList;
                            
                chrome.storage.local.set({[localStorageKey_TickerList]: tickerList});
            });
        }

        // Propagate this ticker list to all background and content script listeners if triggerRefresh is true.
        if (triggerRefresh) {
            refreshTickerList(tickerList, true);
        }

        if (callBack) {
            callBack(tickerList);
        }
    });
}

// Saves the provided ticker list parameter to local storage.
function updateTickerList(newTickerList) {
    chrome.storage.local.set({[localStorageKey_TickerList]: newTickerList});

    // Refresh listeners after saving new list to local storage.
    refreshTickerList(newTickerList, true);
}

// Adds a ticker to the saved ticker list in local storage.
function addTicker(newTicker) {
    // Get current ticker list.
    retrieveTickerList(false, function (tickerList) {

        // Cross check new ticker with existing tickers and perform add if ticker doesn't exist.
        if (!_.contains(tickerList, newTicker)) {
            // Check if ticker is valid.
            var isValidTicker = validateTicker(newTicker);
            if (!isValidTicker) {
                alert ("Invalid ticker");
                return;
            }
            
            // Add the ticker to the list and trigger update if it is valid.
            tickerList.push(newTicker);
            updateTickerList(tickerList);
        }
    });
}

// Removes a ticker from the saved list in local storage.
function removeTicker(existingTicker) {
    // Get current ticker list.
    retrieveTickerList(false, function (tickerList) {
    
        // Check if list contains the ticker.
        if (_.contains(tickerList, existingTicker)) {
            // Remove the ticker from the list.
            tickerList = _.reject(tickerList, function (tickerObj) {
                return tickerObj === existingTicker;
            });

            // Trigger update on newly returned list.
            updateTickerList(tickerList)
        }
    });
}

// Uses the yahoo stock API to verify if a ticker is valid.
// Errors are returned for invalid tickers.
function validateTicker(ticker) {
    var isTickerValid = true;
    var yahooTickerAPI = yahooApiUrl.replace("{tickers}", ticker);

    // Perform AJAX on ticker api to retrieve market data.
    // 404 returns errors for invalid tickers, which is resolved by the error handler.
    $.ajax({
        url: yahooTickerAPI, 
        type: 'GET',
        async: false,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            isTickerValid = false;
        }
    });
    
    return isTickerValid;
}