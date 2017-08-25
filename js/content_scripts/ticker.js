(function (window) {
	
	// Yahoo Api Url for querying tickers.
    yahooApiUrl = "https://partner-query.finance.yahoo.com/v7/finance/spark?symbols={tickers}"
	+ "&range=1d&interval=1m&indicators=close&includeTimestamps=false&includePrePost=false&corsDomain=finance.yahoo.com";
	
	// Shadow root variable to contain ticker html to prevent collisions with current content page styles.
	var sliderShadowRoot = undefined;

	// Constructs the full ticker HTML based on the provided symbols list.
	function initTicker(symbols) {
		var dataString = "";
		var yahooTickerAPI = yahooApiUrl.replace("{tickers}", symbols);
		
		jQuery.ajaxSetup({async:false});
		$.get(yahooTickerAPI, function( data ) {
			data = data.spark.result;

			// Parse API data
			for (var i = 0; i < data.length; i++) {
				var lastPrice = (data[i].response[0].indicators.quote[0].close != undefined ? getLastItem(data[i].response[0].indicators.quote[0].close) : 0);
				var prevClose = (data[i].response[0].meta.previousClose != undefined ? data[i].response[0].meta.previousClose : 0);
				var priceDiff = round((lastPrice - prevClose), 2);
				var diffPercent = round((priceDiff/ prevClose)*100, 2);

				// Create HTML display based on returned data.
				dataString += "@" + data[i].symbol + ": ";
				if (lastPrice > prevClose)
					dataString += "<div class='stockUp' style='display:inline-block;color:green;padding-right: 3em;'> &#9650; " + lastPrice;
				else
					dataString += "<div class='stockDown' style='display:inline-block;color:red;padding-right: 3em;'> &#9660; " + lastPrice;
				
				if (diffPercent == -100)
					dataString +=  " (data error)</div>";
				else
					dataString +=  " (" + priceDiff + ", " + diffPercent + "%)</div>";
			}
		});

		// Append data string to full ticker container HTML.
		var sliderHtml = '<div class="ticker" id="editStocks" style="display: inline-block; height:24px;"><a href="#"" style="color: goldenrod; font-size: 0.8em; font-family: subwayFont">Customize</a></div>'
		+ '<div id="tickerMarquee" style="width: calc(100% - 82px); float: right; height: 24px;"><marquee style="height:24px;">' + dataString + '</marquee></div>';

		// Initialize the shadow root if it is undefined with the new slider HTML.
		if (sliderShadowRoot === undefined) {
			$("body").children()[0].style.marginTop = "24px"
			var sliderParent = $('<div/>').attr('id', 'slider');
			var shadowRoot = sliderParent[0].attachShadow({mode: 'open'});
			shadowRoot.innerHTML = sliderHtml;
			$("body").prepend(sliderParent);

			sliderShadowRoot = shadowRoot;
		}

		// Otherwise, simply replace the inner HTML of the shadow root.
		else {
			sliderShadowRoot.innerHTML = sliderHtml;
		}

		// Bind click event to shadow root element
		$(sliderShadowRoot).find('#editStocks').on('click', function () {
			chrome.runtime.sendMessage({type:'editStocks'});
		});
	}

	// Removes ticker slider completely.
	function clearTickerDOM() {
		$("#slider").remove();
		$("body").children()[0].style.marginTop = "0px";

		sliderShadowRoot = undefined;
	}

	// Register background message listener -- handles specific message events.
	chrome.runtime.onMessage.addListener(function(message) {
		switch (message.type) {
			case 'refreshTickerList': {
				clearTickerDOM();
				
				// Show ticker if it does not exist or a refresh is requried.
				var symbols = message.value;
				initTicker(symbols);
				break;
			}
			case 'clearSlider': {
				clearTickerDOM();
				break;
			}
			default:
				break;
		}
	});

})(this);
