chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.storage.local.remove('activeTickerTab');
	chrome.tabs.executeScript(null, {
	 	//code: ""
		file: 'js/ticker.js'
    });
    
    refreshSymbols(true);
});

chrome.runtime.onMessage.addListener(function(request) {
    switch (request.type) {
        case ('editStocks'): {
            chrome.tabs.create({
                url: chrome.extension.getURL('customize.html'),
                active: false
            }, function(tab) {
                // After the tab has been created, open a window to inject the tab
                chrome.windows.create({
                    tabId: tab.id,
                    type: 'popup',
                    height: 250,
                    width: 500,
                    focused: true
                    // incognito, top, left, ...
                });
            });

            break;
        }
        default: 
            break;
    }
});

function refreshSymbols(updateContentScripts) {
	var tickerList = "";
    chrome.storage.local.get('tickerList', function(result){
        tickerList = result.tickerList;

        if (!tickerList) {
	    	chrome.storage.local.get('defaultSymbols', function(result){
                var defaultSymbolsList =  (result.defaultSymbols ? result.defaultSymbols : setDefaultSymbols());
                tickerList = defaultSymbolsList;
                            
	    	    chrome.storage.local.set({'tickerList': tickerList});
	    	});
	    }

        //chrome.runtime.sendMessage({type:'refreshTickerList', value: tickerList});

        if (updateContentScripts) {
            getActiveTickerTab(function (activeTickerTab){
                chrome.tabs.sendMessage(activeTickerTab.id, {type:'refreshTickerList', value: tickerList});
            });
        }
    });
}

function addTicker(ticker) {
    chrome.storage.local.get('tickerList', function(result){
        var tickerList = (!result.tickerList ? [] : result.tickerList);

        if (tickerList.indexOf(ticker) == -1) {

        	var isValidTicker = validateTicker(ticker);
		    if (isValidTicker) {
		    	tickerList.push(ticker);
    			chrome.storage.local.set({'tickerList': tickerList});
		    }
		    else
		    {
		    	alert ("Invalid ticker");
		    	return;
		    }
			

	        chrome.runtime.sendMessage({type:'refreshTickerList', value: tickerList});
	        var activeTickerTab = getActiveTickerTab(function (activeTickerTab) {
	            chrome.tabs.sendMessage(activeTickerTab.id, {type:'refreshTickerList', value: tickerList});
	        });
	    }
    });
}

function removeTicker(ticker) {
    chrome.storage.local.get('tickerList', function(result){
        var tickerList = result.tickerList;

        var tickerIndex = parseInt(tickerList.indexOf(ticker));
        if (tickerIndex > -1) {
            tickerList.splice(tickerIndex, 1);
                    
	    	chrome.storage.local.set({'tickerList': tickerList});
	   		chrome.runtime.sendMessage({type:'refreshTickerList', value: tickerList});

            var activeTickerTab = getActiveTickerTab(function (activeTickerTab){
                chrome.tabs.sendMessage(activeTickerTab.id, {type:'refreshTickerList', value: tickerList});
            });
	    }
    });
}

function getActiveTickerTab(cf) {
    chrome.storage.local.get('activeTickerTab', function(result) {
        if (!result || !result.activeTickerTab) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ 
                if (tabs.length > 0) {
                    var activeTickerTab = tabs[0];
                    chrome.storage.local.set({'activeTickerTab': activeTickerTab});

                    cf(activeTickerTab);
                }
            });
        }
        else {
            cf(result.activeTickerTab);
        }
    });
}

function setDefaultSymbols() {
    var ds = {'defaultSymbols': ['amd', 'msft', 'voo']};
    
    chrome.storage.local.set(ds);
    return ds.defaultSymbols;
}

function validateTicker(ticker) {
	var valid = true;
	var yahooApiUrl = "https://partner-query.finance.yahoo.com/v7/finance/spark?symbols=" + ticker + "&range=1d&interval=1m&indicators=close&includeTimestamps=false&includePrePost=false&corsDomain=finance.yahoo.com";
	$.ajax({
   		url: yahooApiUrl, 
	    type: 'GET',
	    async: false,
	    error: function(XMLHttpRequest, textStatus, errorThrown) {
	        valid = false;
	    }
	});
	return valid;
}