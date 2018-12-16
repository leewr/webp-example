$(function(){
	$('[data-url]').each(function(item, index){
		var ext = window.webpAvaile ? '.webp' : ''
		$(this).attr('src', $(this).attr('data-url') + ext)
	})	
})

//去掉alert网址
window.alert = function(name){  
    var iframe = document.createElement("IFRAME");  
    iframe.style.display="none";  
    iframe.setAttribute("src", 'data:text/plain,');  
    document.documentElement.appendChild(iframe);  
    window.frames[0].window.alert(name);  
    iframe.parentNode.removeChild(iframe);  
}