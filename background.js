chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript(null, {
	 	//code: ""
		file: 'slider.js'
	});
});




