//debugger;

document.forms[0].onsubmit = function(e) {
    e.preventDefault(); // Prevent submission
    var ticker = $('#tickerToAdd').val();
    chrome.runtime.getBackgroundPage(function(bgWindow) {
        var tickerList = bgWindow.addTicker(ticker);
    });
};

chrome.runtime.onMessage.addListener(function(request) {
    if (request.type === 'tickerList') {
        var tickers = request.value;
        var curTickers = "";
        for (i = 0; i < tickers.length; i++) {
            curTickers += (i != 0 ? "," : "") + "<a href='#' class='customTicker'>" + tickers[i] + "</a>";
        }

        $('#currentTickers').html(curTickers);
    }
});

$(document).ready(function() {
    chrome.runtime.getBackgroundPage(function(bgWindow) {
        bgWindow.getSymbols();
    });
})

$(document).on("click", ".customTicker", function() {
    var ticker = this.innerText;
    chrome.runtime.getBackgroundPage(function(bgWindow) {
        bgWindow.removeTicker(ticker);
    });
});