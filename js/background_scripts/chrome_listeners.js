(function(window) { 

    // Register browser action -- initial click of extension icon.
    chrome.browserAction.onClicked.addListener(function(tab) {

        if (!extensionInitialized) {
            // Trigger execution of ticker related javascript.
            chrome.tabs.executeScript(null, {
                //code: ""
                file: 'js/content_scripts/ticker.js'
            });
        }
    });

    // Register background message listener -- handles specific message events.
    chrome.runtime.onMessage.addListener(function(request) {
        switch (request.type) {
            // User Action: Choosing to customize the ticker list.
            case ('editStocks'): {
                
                // Create a tab for the customize window.
                chrome.tabs.create({
                    url: chrome.extension.getURL('html/customize.html'),
                    active: false
                }, function(tab) {
                    // Inject the tab into a newly created window.
                    chrome.windows.create({
                        tabId: tab.id,
                        type: 'popup',
                        height: 250,
                        width: 500,
                        focused: true
                    });
                });

                break;
            }
            default: 
                break;
        }
    });

})(this);