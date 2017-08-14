chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript(null, {
	 	//code: ""
		file: 'js/ticker.js'
	});
});

chrome.runtime.onMessage.addListener(function(request) {
    if (request.type === 'editStocks') {
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
    }
});


function setDefaultSymbols() {
	chrome.storage.local.set({'defaultSymbols': "amd,voo,msft"});
}

function addTicker(ticker) {
    chrome.storage.local.get('tickerList', function(result){
        var tickerList = (!result.tickerList ? [] : result.tickerList);

        if (tickerList.indexOf(ticker) == -1) {
	    	//tickerList = tickerList.length == 0 ? ticker : tickerList + "," + ticker;
	    	tickerList.push(ticker);
	    	chrome.storage.local.set({'tickerList': tickerList});
	    }

	    chrome.runtime.sendMessage({type:'reinit', value: tickerList});//this one isnt working
	    chrome.runtime.sendMessage({type:'tickerList', value: tickerList});
    });
}

function removeTicker(ticker) {
    chrome.storage.local.get('tickerList', function(result){
        var tickerList = result.tickerList;

        var tickerIndex = parseInt(tickerList.indexOf(ticker));
        if (tickerIndex > -1) {
	    	tickerList.splice(tickerIndex, 1);
	    	chrome.storage.local.set({'tickerList': tickerList});

	    	chrome.runtime.sendMessage({type:'reinit', value: tickerList});//this one isnt working
	   		chrome.runtime.sendMessage({type:'tickerList', value: tickerList});
	    }
    });
}

function getSymbols() {
	var tickerList = "";
    chrome.storage.local.get('tickerList', function(result){
        tickerList = result.tickerList;

        if (!tickerList) {
	    	chrome.storage.local.get('defaultSymbols', function(result){
	        	tickerList = result.tickerList;
	    	});
	    }

	    chrome.runtime.sendMessage({type:'tickerList', value: tickerList});
    });
}