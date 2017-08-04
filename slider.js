// $(document).ready(function(){
// 	$("#checkPage").click(function() {	
// 		alert("Fuck bud I did something");
// 	});
// });


(function() {

debugger;
	//document.body.style.backgroundColor="red"

	var parent = document.getElementsByTagName("body")[0];
	var child = document.createElement("div");
	child.style.cssText = 'width:100%;height:200px;background-color:black;color:white;clear:both;position:absolute;';
	child.innerHTML = 'heeeeeeeeeeeeellllllllloooooooooooooooooo';//<div id="fb-root" style="width:100%;background-color:red">YABOOBAY</div>'
	
	parent.children[0].style.marginTop = "200px"
	parent.appendChild(child);

	// $('body').prepend('<div id="fb-root" style="width:100%;background-color:red">YABOOBAY</div>');
})();