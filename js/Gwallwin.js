var WIN = function (clientid) {
		this.gmask = document.getElementById("gmask");
		this.gwindow = document.getElementById("gwindow");
		this.gwinhead = document.getElementById("gwinhead");
		this.gwinclient = document.getElementById("gwinclient");
		this.gclient = document.getElementById(clientid);
		this.gcache = document.getElementById("gcache");
		return this;
};

var Gwallwin = new function () {
	this.is_IE = (navigator.appName == "Microsoft Internet Explorer");
	this.bMove = false;
	this.winObj = null;
	this.winArray = new Array(8);
	this.pX = 0;
	this.pY = 0;
	this.maskW = 0;
	this.maskH = 0;
	this.WinW = 0;
	this.WinH = 0;
	document.write("<div id='gmask' class='gmask'></div>");
	document.write("<div id='gcache' style='display:none'></div>");
	document.write("<div id='gwindow' class='gwindow'>");
	document.write("\t<div id='gwinhead' class='gheader' onMouseDown='Gwallwin.MouseDown();' onMouseMove='Gwallwin.MouseMove();' onMouseUp='Gwallwin.MouseUp();'>");
	document.write("\t</div>");
	document.write("\t<div id='gwinclient' style = 'background:#FFFFFF'></div>");
	document.write("</div>");
	
	this.addHead = function (title, isup) {
		var str = "<div style='display: inline; width: 150px; position: absolute;cursor:default' onselectstart = 'return false'>" + title + "</div>";
		str += "<span id='gcloseico' class = 'gcloseico' onClick='Gwallwin.winClose();'>" + "</span>";
		str += "<span id='updown' class = 'gwinup' onClick='Gwallwin.changeList();'>" + "</span>";
		this.winObj.gwinhead.innerHTML = str;
	};
	this.updown = 0;
	this.toggler = null;
	this.tid = null;
	this.changeList = function () {
		if(this.tid==null){
			this.tid = "_" + Math.random() * 100;
		}
		var gwindow = document.getElementById("gwindow");
		if(this.toggler==null){
			this.toggler = {};
			this.toggler[this.tid] = {
				obj:gwindow,
				maxHeight:document.getElementById("gwindow").offsetHeight,
     			minHeight:document.getElementById("gwinhead").offsetHeight+4,
     			timer:null
			};
		}
		gwindow.style.height = gwindow.offsetHeight + 'px';
		if (this.toggler[this.tid].timer){
		    clearTimeout(this.toggler[this.tid].timer);
		}
		var obj = document.getElementById("updown");
		if (obj) {
			var gwinclient = document.getElementById("gwinclient");
			if (this.updown == 0) {
				obj.className = "gwindown";
				this.updown = 1;
				this.toggler.timer = setTimeout("Gwallwin.toggle('up','"+this.tid+"')", this.ms);
				//gwinclient.style.display = "none";
			} else {
				obj.className = "gwinup";
				this.updown = 0;
				this.toggler.timer = setTimeout("Gwallwin.toggle('down','"+this.tid+"')", this.ms);
				//gwinclient.style.display = "";
			}
		}
	};
	
	this.step = 20;		//每次变化的px量
	this.ms = 10;		//每隔多久循环一次
	
	this.toggle = function(type,tid) {
  		var o = this.toggler[tid].obj;
		if (type == "up") {
			if (o.offsetHeight <= this.toggler[tid].minHeight){
				o.style.height = this.toggler[tid].minHeight;
				clearTimeout(this.toggler[tid].timer);
				return;
		    }
		    o.style.height = (parseInt(o.style.height, 10) - this.step) + "px";
			this.toggler[tid].timer = setTimeout("Gwallwin.toggle('up','"+tid+"')", this.ms);
		} else {
			if (o.offsetHeight >= this.toggler[tid].maxHeight){
				o.style.height = this.toggler[tid].maxHeight;
				clearTimeout(this.toggler[tid].timer);
				return;
		    }
		    o.style.height = (parseInt(o.style.height, 10) + this.step) + "px";
			this.toggler[tid].timer =setTimeout("Gwallwin.toggle('down','"+tid+"')", this.ms);
		}
	}
	
	this.addClient = function (winid) {
		var child = document.getElementById(winid);
		child.style.display = "block";

//		//-- 有FORM时，要把标题栏放到FORM内，不然会有空行。
//
//		var formnode = child.firstChild;
//		if ( formnode.tagName == 'FORM' ){
//			var firstnode = formnode.firstChild;
//			formnode.insertBefore(this.winObj.gwinhead,firstnode);
//		}
//		//--
		this.winObj.gclient = child;
		this.winObj.gwinclient.appendChild(child);
	};
	this.MouseUp = function () {
		if (this.bMove) {
			if(this.winObj.gwinhead.releaseCapture){
				this.winObj.gwinhead.releaseCapture();
			}else{
				document.removeEventListener("mouseup", this.MouseUp, true);
				document.removeEventListener("mousemove", this.MouseMove, true);
				var e = window.event || arguments.callee.caller.arguments[0];
				e.preventDefault();
			}
			this.bMove = false;
		}
	};
	this.MouseMove = function () {
		var height = document.body.clientHeight;
		var width = document.body.clientWidth;
		var mx, my;
		if (this.bMove) {
			var e = window.event || arguments.callee.caller.arguments[0];
			var movx = e.x || e.pageX;
			var movy = e.y || e.pageY;
			//this.winObj.gwinhead.innerHTML = "test:" + movx + "--width:" + width + "--maskW:" + this.maskW + "--" ;
			//窗体 X 可移动的范围
			if (movx > 0 && movx < width) {		//&& (movx - this.pX + this.WinW) < this.maskW 控制啥的？
				this.winObj.gwindow.style.left = movx - this.pX;
			}
			//窗体 Y 可移动的范围
			if (movy > 0 && movy < height) {		//&& (movy - this.pY + this.WinH) < this.maskH 
				this.winObj.gwindow.style.top = movy - this.pY;
			}
		}
	};
	this.MouseDown = function () {
		var e = window.event || arguments.callee.caller.arguments[0];
		if (this.is_IE) {
			this.winObj.gwinhead.setCapture();
		} else {
			e.preventDefault();
			document.addEventListener("mouseup", this.MouseUp, true);
			document.addEventListener("mousemove", this.MouseMove, true);
		}
		this.bMove = true;
		var _x = e.x || e.pageX;
		var _y = e.y || e.pageY;
		this.pX = _x - parseFloat(this.winObj.gwindow.style.pixelLeft || this.winObj.gwindow.style.left);
		this.pY = _y - parseFloat(this.winObj.gwindow.style.pixelTop || this.winObj.gwindow.style.top);
		this.WinW = this.winObj.gwindow.clientWidth;
		this.WinH = this.winObj.gwindow.clientHeight;
	};
	
	
	this.winClose = function () {
		this.winObj.gcache.appendChild(this.winObj.gclient);
		this.winObj.gmask.style.display = "none";
		this.winObj.gwindow.style.display = "none";
		this.winObj.gclient.style.dispaly = "none";
		this.updown = 0;
		var gwindow = document.getElementById("gwindow");
		if(gwindow.style.height && this.tid!=null){
			gwindow.style.height = this.toggler[this.tid].maxHeight;
		}
		/*
		var gwinclient = document.getElementById("gwinclient");
		if (gwinclient) {
			gwinclient.style.display = "";
		}
		*/
	};
	this.winShow = function (winid, title, wWidth, wHeight, xLeft, yTop) {
		this.winObj = WIN(winid);
		var scroll, client;
		scroll = document.body.scrollWidth;
		client = document.body.clientWidth;
		this.maskW = scroll > client ? scroll : client;
		scroll = document.body.scrollHeight;
		client = document.body.clientHeight;
		this.maskH = scroll > client ? scroll : client;

		//set window width
		if (wWidth == null) {
			wWidth = 480;
		}
		this.winObj.gwindow.style.width = wWidth;

		//set window height
		if (wHeight != null) {
			this.winObj.gwindow.style.height = wHeight;
		}// no else 

		if (xLeft != null) {
			this.winObj.gwindow.style.left = xLeft;
		}
		else{
			this.winObj.gwindow.style.left =(document.body .clientWidth-500)/2;
		}
		
		if (yTop != null) {
			this.winObj.gwindow.style.top = yTop;
		}
		else{
			this.winObj.gwindow.style.top =(document.body.clientHeight-400)/ 2;
		}
		/*
		//set window left
		if (wWidth > this.maskW){
			this.winObj.gwindow.style.left = 10;
		} else { 
			this.winObj.gwindow.style.left = (this.maskW - wWidth) / 2;
		}
		//set window top 
		if (wHeight > this.maskH){
			this.winObj.gwindow.style.top = 10;
		} else {
			var t = Math.round((this.maskH - this.winObj.gwindow.style.height) / 2);
			this.winObj.gwindow.style.top = t;
		}
*/
		this.winObj.gmask.style.width = this.maskW;
		this.winObj.gmask.style.height = this.maskH;
		this.winObj.gmask.style.display = "block";
		this.winObj.gwindow.style.display = "block";
		this.addHead(title);
		this.addClient(winid);
		this.winObj.gwindow.focus();
	};
	this.winShowmask = function (bSHOW) {
		var scroll, client;
		var gprogress = document.getElementById("gprogress");
//event.srcElement.id
		if (gprogress == null) {
			gprogress = document.createElement("DIV");
			gprogress.id = "gprogress";
			gprogress.className = "gmask";
			document.body.appendChild(gprogress);
		}
		var progressimg = document.getElementById("progress_image");
		if (progressimg == null) {
			progressimg = document.createElement("div");
			progressimg.id = "progress_image";
//progressimg.style.top = (tTop + maindiv.offsetHeight) * 0.7;
			progressimg.innerHTML = "<center><br ><img src=\"../../images/progress.gif\"/></center>";
		}
		gprogress.appendChild(progressimg);
		if (bSHOW == "TRUE") {
			scroll = document.body.scrollWidth;
			client = document.body.clientWidth;
			this.maskW = scroll > client ? scroll : client;
			scroll = document.body.scrollHeight;
			client = document.body.clientHeight;
			this.maskH = scroll > client ? scroll : client;
			gprogress.style.width = this.maskW;
			gprogress.style.height = this.maskH;
			gprogress.style.display = "block";
			gprogress.focus();
			gprogress.style.cursor = "wait";
		} else {
			gprogress.style.display = "none";
			gprogress.style.cursor = "default";
		}
	};
};

