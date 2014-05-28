var Gwallvoucher = new function() {
	this.voucherid = "";
	this.isNEW = false;
	
	this.test = function(){
		if ( urlparm.pid == "undefined" || urlparm.pid == ""){
			alert("新单");
		} else {
			this.voucherid = urlparm.pid;
			this.isNEW = false;
			//alert(urlparm.pid);
		}
	}
}

/* --- 获取URL传递过来的参数 --- */
var urlparm = new function(){
	var url = decodeURI(window.location.href);
	var allargs = url.split("?")[1];
	var args = allargs.split("&");
	for(var i = 0; i<args.length; i++){
		var arg = args[i].split("=");
		eval('this.'+arg[0]+'="'+arg[1]+'";');
	}
} 

