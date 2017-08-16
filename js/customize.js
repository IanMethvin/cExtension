//debugger;
var bgPage = {};

document.forms[0].onsubmit = function(e) {
    e.preventDefault(); // Prevent submission
    var ticker = $('#tickerToAdd').val();
    var tickerList = bgPage.addTicker(ticker);
    $('#tickerToAdd').val("");
};

function generateCurTickerHtml(tickers) {
    var curTickers = "";
    for (i = 0; i < tickers.length; i++) {
        // curTickers += (i != 0 ? ", " : "") + "<a href='#' class='customTicker'>" + tickers[i] + "</a>";
        curTickers += (i != 0 ? ", " : "") + tickers[i].toUpperCase() 
            + "<div class='customTicker' id='" + tickers[i] + "' style='color:red;display:inline-block;cursor:pointer;'>[x]</div>";
    }
    return curTickers;
}

chrome.runtime.onMessage.addListener(function(request) {
    if (request.type === 'refreshTickerList') {
        var curTickers = generateCurTickerHtml(request.value);
        $('#currentTickers').html(curTickers);
    }
});

$('#tickerToAdd').on('input', _.debounce(function() {
    $('#addTickerButton').prop('disabled', ($(this).val().trim() === '' ? true : false));
}, 1));

$(document).ready(function() {
    chrome.runtime.getBackgroundPage(function(bgWindow) {
        bgPage = bgWindow;

        chrome.storage.local.get('tickerList', function(result){
            var curTickers = generateCurTickerHtml(result.tickerList);
            $('#currentTickers').html(curTickers);
        });

        //why do this on load? symbols are already loaded?
        //bgPage.refreshSymbols(false);
    });
})

$(document).on("click", ".customTicker", function() {
    var ticker = this.id;
    bgPage.removeTicker(ticker);
});