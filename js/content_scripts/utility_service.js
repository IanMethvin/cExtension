// Return the last element in an array.
Array.prototype.last = function(index) {
    return this[this.length - (index ? index : 1)];
}

// Round a number up to specific decimal places.
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

// Retrieve the last item in an array.
function getLastItem (items) {
    var lastItem = items.last();
    var index = 1;
    while (!lastItem)
        lastItem = items.last(index++);

    return lastItem;
}