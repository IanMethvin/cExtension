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

var sliderShadowRoot = undefined;

function initTicker(symbols) {
	var yahooApiUrl = "https://partner-query.finance.yahoo.com/v7/finance/spark?symbols=" + symbols.join(',') + "&range=1d&interval=1m&indicators=close&includeTimestamps=false&includePrePost=false&corsDomain=finance.yahoo.com";
	var dataString = "";
	jQuery.ajaxSetup({async:false});
	$.get(yahooApiUrl, function( data ) {
		data = data.spark.result;
	  	for (i = 0; i < data.length; i++) {
		  	var lastPrice = (data[i].response[0].indicators.quote[0].close != undefined ? getLastPrice(data[i].response[0].indicators.quote[0].close) : 0);
		  	var prevClose = (data[i].response[0].meta.previousClose != undefined ? data[i].response[0].meta.previousClose : 0);
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

	var sliderHtml = '<div class="ticker" id="editStocks" style="display: inline-block;"><a href="#"" style="color: goldenrod; font-size: 0.8em; font-family: subwayFont">Customize</a></div>'
	+ '<div id="tickerMarquee" style="width: 95%; float: right;"><marquee>' + dataString + '</marquee></div>';

	if (sliderShadowRoot === undefined) {
		$("body").children()[0].style.marginTop = "24px"
		var sliderParent = $('<div/>').attr('id', 'slider');
		var shadowRoot = sliderParent[0].attachShadow({mode: 'open'});
		shadowRoot.innerHTML = sliderHtml;
		$("body").prepend(sliderParent);

		sliderShadowRoot = shadowRoot;
	}
	else {
		sliderShadowRoot.innerHTML = sliderHtml;
	}

	// Bind click event to shadow root element
	$(sliderShadowRoot).find('#editStocks').on('click', function () {
		chrome.runtime.sendMessage({type:'editStocks'});
	});
}

function hideTicker() {
	$("#slider").remove();
	$("body").children()[0].style.marginTop = "0px"
}

//curerently not working
chrome.runtime.onMessage.addListener(function(message) {
    switch (message.type) {
		case 'refreshTickerList': {
        	var symbols = message.value;
        	initTicker(symbols);
		}
    }
});

(function() {
	if ($("#slider").length > 0) {
		hideTicker()
	}
})();

