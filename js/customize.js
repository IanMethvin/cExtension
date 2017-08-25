(function (window) {
    var bgPage = {};

    // Creates ticker html based on provided list of tickers.
    function generateTickerListHtml(tickers) {
        var tickerHtml = "";
        
        // Iterate through each ticker
        _.each(tickers, function (tickerSymbol, i) {
            // Constructs html for each ticker symbol.
            tickerHtml += (i != 0 ? ", " : "") + tickerSymbol.toUpperCase() 
                + "<div class='customTicker' id='" + tickerSymbol + "' style='color:red;display:inline-block;cursor:pointer;'>[x]</div>";
        });

        $('#customizeCurrentTickers').html(tickerHtml);

        // Register click listener on individual tickers to trigger the remove action.
        $('.customTicker').on('click', function () {
            var ticker = this.id.toLowerCase();
            bgPage.removeTicker(ticker);
        });
    }

    // Initializes current page listeners and events.
    function initializeCustomizePage () {

        // Set background page variables for repeated use.
        chrome.runtime.getBackgroundPage(function(bgWindow) {
            bgPage = bgWindow;

            // Retrieve current list of tickers.
            bgPage.retrieveTickerList(false, function (tickerList) {
                // Generate HTML for each ticker in the list.
                generateTickerListHtml(tickerList);
            });
        });

        // Register background message listener -- handles specific message events.
        chrome.runtime.onMessage.addListener(function(request) {
            if (request.type === 'refreshTickerList') {
                // Refresh ticker display by re-generating the ticker html.
                generateTickerListHtml(request.value);
            }
        });
        
        // Register input listener for handling user input.
        $('#tickerToAdd').on('input', _.debounce(function() {
            // Enable / Disable add ticker button based on current value of the input.
            $('#addTickerButton').prop('disabled', ($(this).val().trim() === '' ? true : false));
        }, 500));
        
        // Register submit listener on form element to trigger submission of a new ticker.
        $('#customizeTickerForm').on('submit', function(e) {
            // Prevent submission
            e.preventDefault(); 

            // Retrieve the new ticker value and add it to the main ticker list in local storage.
            var tickerValue = $('#tickerToAdd').val().toLowerCase();
            var tickerList = bgPage.addTicker(tickerValue);

            // Clear ticker input field.
            $('#tickerToAdd').val("");
        });
    }

    // Initialize customize page when dom is ready.
    $(document).ready(function() {
        initializeCustomizePage();
    });

})(this);