//debugger;
var bgPage = {};

document.forms[0].onsubmit = function(e) {
    e.preventDefault(); // Prevent submission
    var ticker = $('#tickerToAdd').val();
    var tickerList = bgPage.addTicker(ticker);
};

chrome.runtime.onMessage.addListener(function(request) {
    if (request.type === 'refreshTickerList') {
        var tickers = request.value;
        var curTickers = "";
        for (i = 0; i < tickers.length; i++) {
            curTickers += (i != 0 ? "," : "") + "<a href='#' class='customTicker'>" + tickers[i] + "</a>";
        }

        $('#currentTickers').html(curTickers);
    }
});

$('#tickerToAdd').on('input', _.debounce(function() {
    $('#addTickerButton').prop('disabled', ($(this).val().trim() === '' ? true : false));
}, 500));

$(document).ready(function() {
    chrome.runtime.getBackgroundPage(function(bgWindow) {
        bgPage = bgWindow;
        bgPage.refreshSymbols(false);
    });
})

$(document).on("click", ".customTicker", function() {
    var ticker = this.innerText;
    bgPage.removeTicker(ticker);
});