/* 暂不用 Load js file */
function loadScript(file, callback) {   
    var head = document.getElementsByTagName('head')[0];   
    var js = document.createElement('script');
    
    js.setAttribute('type', 'text/javascript');   
    js.setAttribute('src', file);   
    head.appendChild(js);
       
    js.onload = js.onreadystatechange = function() {   
        if (js.readyState && js.readyState != 'loaded' && js.readyState != 'complete') return;   
        js.onreadystatechange = js.onload = null;   
        if (callback){
        	callback();
        }   
    }   
    return false;   
}  

var loadjs = function(){
	loadScript("../../js/Gwalldate.js");
	loadScript("../../js/Gwallwin.js");
	//loadScript("../../js/Gwallregion.js");
	loadScript("../../js/test.js");
};



/*
var loadscript = 
{
	$$:function(id){return document.getElementById(id)},
	tag:function(element){return document.getElementsByTagName(element)},
	ce:function(element){return document.createElement(element)},
	js:function (url){
		var req = this.createXmlHttp();
		req.open('GET',url, false);
		req.send(null);
		try{
			if (req.status == 200 || req.status == 0){
				window.eval(req.responseText);
			}
		}catch(e){}
	},
	createXmlHttp: function (){
		var xmlHttp;
		if (window.ActiveXObject) {
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}else if (window.XMLHttpRequest){
			xmlHttp = new XMLHttpRequest();
		}
		return xmlHttp;
	}
}
*/