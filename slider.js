// $(document).ready(function(){
// 	$("#checkPage").click(function() {	
// 		alert("Fuck bud I did something");
// 	});
// });


(function() {

debugger;
	//document.body.style.backgroundColor="red"

	// var parent = document.getElementsByTagName("body")[0];
	// var child = document.createElement("div");
	// child.setAttribute("id", "slider");
	// //child.style.cssText = 'width:100%;height:24px;background-color:black;color:white;font-size:1.3em;padding-top:2px;clear:both;position:fixed;top:0;z-index:2147483647;';
	// child.innerHTML = '<marquee>heeeeeeeeeeeeellllllllloooooooooooooooooo</marquee>';//<div id="fb-root" style="width:100%;background-color:red">YABOOBAY</div>'
	
	// parent.children[0].style.marginTop = "24px";
	// // parent.appendChild(child);
	// parent.insertBefore(child, parent.children[0]);

	//$("body").children[0].css("marginTop", "24px");
	$("body").prepend('<div id="slider"><marquee>heeeeeeeeeeeeellllllllloooooooooooooooooo</marquee></div>');
})();