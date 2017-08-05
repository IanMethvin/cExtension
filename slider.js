(function() {

debugger;

	if ($("#slider").length == 0) {
		$("body").children()[0].style.marginTop = "24px"
		$("body").prepend('<div id="slider"><marquee>heeeeeeeeeeeeellllllllloooooooooooooooooo</marquee></div>');
	}
	else {
		$("#slider").remove();
		$("body").children()[0].style.marginTop = "0px"
	}
})();