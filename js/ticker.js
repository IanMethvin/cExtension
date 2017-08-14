Array.prototype.last = function(index) {
	return this[this.length - (index ? index : 1)];
}
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
function getLastPrice (prices) {
  	var lastPrice = prices.last();
	var index = 1;
	while (!lastPrice)
		lastPrice = prices.last(index++);

	return lastPrice;
}

$(document).on("click", "#editStocks", function() {
	chrome.runtime.sendMessage({type:'editStocks'});
});

function initTicker(symbols) {
	var yahooApiUrl = "https://partner-query.finance.yahoo.com/v7/finance/spark?symbols=" + symbols + "&range=1d&interval=1m&indicators=close&includeTimestamps=false&includePrePost=false&corsDomain=finance.yahoo.com";
	var dataString = "";
	jQuery.ajaxSetup({async:false});
	$.get(yahooApiUrl, function( data ) {
		data = data.spark.result;
	  	for (i = 0; i < data.length; i++) {
		  	var lastPrice = getLastPrice(data[i].response[0].indicators.quote[0].close);
		  	var prevClose = data[i].response[0].meta.previousClose;
		  	var priceDiff = round((lastPrice - prevClose), 2);
		  	var diffPercent = round((priceDiff/ prevClose)*100, 2);

		  	dataString += "@" + data[i].symbol + ": ";
		  	if (lastPrice > prevClose)
		  		dataString += "<div class='stockUp' style='display:inline-block;color:green;padding-right: 5em;'> &#9650; " + lastPrice;
		  	else
		  		dataString += "<div class='stockDown' style='display:inline-block;color:red;padding-right: 5em;'> &#9660; " + lastPrice;
		  	dataString +=  " (" + priceDiff + ", " + diffPercent + "%)</div>";
	  	}
	});

	//trying to get this to work with facebook
	// if (document.elementFromPoint(0, 0).style.top == "" || document.elementFromPoint(0, 0).style.top == "0px")
	// 	document.elementFromPoint(0, 0).style.top = "24px";
	// else
		$("body").children()[0].style.marginTop = "24px"
	$("body").prepend('<div id="slider"><div class="ticker" id="editStocks"><a href="#"">Customize</a></div><div id="tickerMarquee"><marquee>' + dataString + '</marquee></div></div>');
}

function hideTicker() {
	$("#slider").remove();
	$("body").children()[0].style.marginTop = "0px"
}

//curerently not working
chrome.runtime.onMessage.addListener(function(request) {
    if (request.type === 'reinit') {
    	var symbols = request.values;
    	initTicker(symbols);
    }
});

(function() {
//debugger;
	if ($("#slider").length == 0) {
		chrome.storage.local.get('tickerList', function(result){
        	var symbols = result.tickerList;
        	initTicker(symbols);
    	});
		
	}
	else {
		hideTicker()
	}
})();
