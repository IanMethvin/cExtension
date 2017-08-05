chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('Turning ' + tab.url + ' red!');
  // chrome.tabs.executeScript({
  //   code: 'document.body.style.backgroundColor="red"'
  // });
  
  	 chrome.tabs.executeScript(null, {
		 file: 'slider.js'
		//code: "addSlider()";
	 });
	 

});




