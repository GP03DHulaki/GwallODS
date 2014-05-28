
function $() {
	var elements = [];
	for (var i = 0; i < arguments.length; i++) {
		var element = arguments[i];
		if (typeof element == "string") {
			if (document.getElementById) {
				element = document.getElementById(element);
			} else {
				if (document.all) {
					element = document.all[element];
				}
			}
		}
		if (arguments.length == 1) {
			return element;
		}
		elements.push(element);
	}
	return elements;
}
function GaddEvent(elm, evType, fn, Capture) {
	if (elm.addEventListener) {
		elm.addEventListener(evType, fn, Capture);
		return true;
	} else {
		if (elm.attachEvent) {
			var r = elm.attachEvent("on" + evType, fn);
			return r;
		} else {
			elm["on" + evType] = fn;
		}
	}
}
String.prototype.Trim = function () {
	return this.replace(/(^\s*)|(\s*$)/g, "");
};
String.prototype.GTrim = function () {
	var str = this, whitespace = " \n\r\t\f\v\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
	for (var i = 0, len = str.length; i < len; i++) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(i);
			break;
		}
	}
	for (i = str.length - 1; i >= 0; i--) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return whitespace.indexOf(str.charAt(0)) === -1 ? str : "";
};
function existzh_CN(str) {
	var pattern = /[\u4e00-\u9fa5]/g;
	if (pattern.test(str)) {
		return true;
	} else {
		return false;
	}
}
Request = {QueryString:function (item) {
	var svalue = location.search.match(new RegExp("[?&]" + item + "=([^&]*)(&?)", "i"));
	return svalue ? svalue[1] : svalue;
}};
function textClear(formId, elements, isFocus) {
	var element = elements.split(",");
	for (var i = 0; i < element.length; i++) {
		var elementId = formId + ":" + element[i];
		if ($(elementId) != null) {
			$(elementId).value = "";
		}
	}
	if (isFocus != "N") {
		if ($(formId + ":" + element[0]) != null) {
			$(formId + ":" + element[0]).focus();
		}
	}
}
function textClearOrCheck(formId, elements, values, type, focusId) {
	var ele = elements.split(",");
	var val = values.split(",");
	if (ele.length == val.length) {
		for (var i = 0; i < ele.length; i++) {
			var eleId = formId + ":" + ele[i];
			if (type == "Y") {
				if ($(eleId) != null) {
					$(eleId).value = val[i];
					if (focusId != null) {
						$(formId + ":" + focusId).focus();
					}
				}
			}
			if (type == "N") {
				if ($(eleId).value.Trim().length <= 0) {
					alert(val[i] + "\u4e0d\u80fd\u4e3a\u7a7a!");
					if ($(eleId).disabled == false) {
						$(eleId).focus();
					}
					return false;
				}
			}
		}
		return true;
	} else {
		alert("js\u95ee\u9898\n\u521d\u59cb\u5316\u65f6\n\u5143\u7d20\u4e0e\u503c\u7684\u6570\u91cf\u4e0d\u76f8\u540c\uff01");
	}
}
function showModal(url, width, height) {
	var patrn = /[?]/;
	if (patrn.exec(url)) {
		url += "&time=" + new Date().getTime();
	} else {
		url += "?time=" + new Date().getTime();
	}
	window.showModalDialog(url, window, "dialogHeight:" + height + "px;dialogWidth:" + width + "px;status:no;resizable:no;");
}
function data_validator_52(obj, isFocus) {
	var result = false;
	if (isNaN(obj.value.Trim())) {
		result = false;
	} else {
		if (obj.value.indexOf(".") != -1) {
			if (obj.value.split(".")[1].length >= 3) {
				result = false;
			} else {
				result = true;
			}
		} else {
			result = true;
		}
	}
	if (isFocus == "Y" && result == false) {
		obj.focus();
	}
	return result;
}
function int_validator(obj, isFocus) {
	var result = false;
	var reg = /^[0-9]*[1-9][0-9]*$/;
	if (reg.test(obj.value.Trim()) > 0) {
		result = true;
	} else {
		result = false;
	}
	if (isFocus == "Y" && result == false) {
		obj.focus();
	}
	return result;
}
function int_validator_z(obj, isFocus) {
	var result = false;
	var reg = /^[0-9]*[0-9]*$/;
	if (reg.test(obj.value.Trim()) > 0) {
		result = true;
	} else {
		result = false;
	}
	if (isFocus == "Y" && result == false) {
		obj.focus();
	}
	return result;
}
function data_validator1_52(obj) {
	var result = false;
	if (isNaN(obj.Trim())) {
		result = false;
	} else {
		if (obj.indexOf(".") != -1) {
			if (obj.split(".")[1].length >= 3) {
				result = false;
			} else {
				result = true;
			}
		} else {
			result = true;
		}
	}
	return result;
}
function formatNumber(number, pattern) {
	var str = number.toString();
	var strInt;
	var strFloat;
	var formatInt;
	var formatFloat;
	if (/\./g.test(pattern)) {
		formatInt = pattern.split(".")[0];
		formatFloat = pattern.split(".")[1];
	} else {
		formatInt = pattern;
		formatFloat = null;
	}
	if (/\./g.test(str)) {
		if (formatFloat != null) {
			var tempFloat = Math.round(parseFloat("0." + str.split(".")[1]) * Math.pow(10, formatFloat.length)) / Math.pow(10, formatFloat.length);
			strInt = (Math.floor(number) + Math.floor(tempFloat)).toString();
			strFloat = /\./g.test(tempFloat.toString()) ? tempFloat.toString().split(".")[1] : "0";
		} else {
			strInt = Math.round(number).toString();
			strFloat = "0";
		}
	} else {
		strInt = str;
		strFloat = "0";
	}
	if (formatInt != null) {
		var outputInt = "";
		var zero = formatInt.match(/0*$/)[0].length;
		var comma = null;
		if (/,/g.test(formatInt)) {
			comma = formatInt.match(/,[^,]*/)[0].length - 1;
		}
		var newReg = new RegExp("(\\d{" + comma + "})", "g");
		if (strInt.length < zero) {
			outputInt = new Array(zero + 1).join("0") + strInt;
			outputInt = outputInt.substr(outputInt.length - zero, zero);
		} else {
			outputInt = strInt;
		}
		var outputInt = outputInt.substr(0, outputInt.length % comma) + outputInt.substring(outputInt.length % comma).replace(newReg, (comma != null ? "," : "") + "$1");
		outputInt = outputInt.replace(/^,/, "");
		strInt = outputInt;
	}
	if (formatFloat != null) {
		var outputFloat = "";
		var zero = formatFloat.match(/^0*/)[0].length;
		if (strFloat.length < zero) {
			outputFloat = strFloat + new Array(zero + 1).join("0");
			var outputFloat1 = outputFloat.substring(0, zero);
			var outputFloat2 = outputFloat.substring(zero, formatFloat.length);
			outputFloat = outputFloat1 + outputFloat2.replace(/0*$/, "");
		} else {
			outputFloat = strFloat.substring(0, formatFloat.length);
		}
		strFloat = outputFloat;
	} else {
		if (pattern != "" || (pattern == "" && strFloat == "0")) {
			strFloat = "";
		}
	}
	return strInt + (strFloat == "" ? "" : "." + strFloat);
}
function isEnter(e) {
	var key = (e.keyCode || e.which);
	return key == 13;
}
function isInteger(e) {
	var key = (e.keyCode || e.which);
	return ((key >= 48 && key <= 57) || (key == 8 || key == 13));
}
function textChange(obj) {
	if (obj.value.search(/[^0-9]/g) != -1) {
		obj.value = obj.defaultValue || 0;
	}
}
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
	var WIN = function (clientid) {
		var gmask = document.getElementById("gmask");
		var gwindow = document.getElementById("gwindow");
		var gwinhead = document.getElementById("gwinhead");
		var gwinclient = document.getElementById("gwinclient");
		var gclient = document.getElementById(clientid);
		var gcache = document.getElementById("gcache");
		return this;
	};
	this.addHead = function (title, isup) {
		var str = "<div style='display: inline; width: 150px; position: absolute;cursor:default' onselectstart = 'return false'>" + title + "</div>";
		str += "<span class = 'gcloseico' onClick='Gwallwin.winClose();'>" + "</span>";
		str += "<span id='updown' class = 'gwinup' onClick='Gwallwin.changeList();'>" + "</span>";
		this.winObj.gwinhead.innerHTML = str;
	};
	this.updown = 0;
	this.toggler = null;
	this.tid = null;
	this.changeList = function () {
		if (this.tid == null) {
			this.tid = "_" + Math.random() * 100;
		}
		var gwindow = document.getElementById("gwindow");
		if (this.toggler == null) {
			this.toggler = {};
			this.toggler[this.tid] = {obj:gwindow, maxHeight:document.getElementById("gwindow").offsetHeight, minHeight:document.getElementById("gwinhead").offsetHeight + 4, timer:null};
		}
		gwindow.style.height = gwindow.offsetHeight + "px";
		if (this.toggler[this.tid].timer) {
			clearTimeout(this.toggler[this.tid].timer);
		}
		var obj = document.getElementById("updown");
		if (obj) {
			var gwinclient = document.getElementById("gwinclient");
			if (this.updown == 0) {
				obj.className = "gwindown";
				this.updown = 1;
				this.toggler.timer = setTimeout("Gwallwin.toggle('up','" + this.tid + "')", this.ms);
			} else {
				obj.className = "gwinup";
				this.updown = 0;
				this.toggler.timer = setTimeout("Gwallwin.toggle('down','" + this.tid + "')", this.ms);
			}
		}
	};
	this.step = 20;
	this.ms = 10;
	this.toggle = function (type, tid) {
		var o = this.toggler[tid].obj;
		if (type == "up") {
			if (o.offsetHeight <= this.toggler[tid].minHeight) {
				o.style.height = this.toggler[tid].minHeight;
				clearTimeout(this.toggler[tid].timer);
				return;
			}
			o.style.height = (parseInt(o.style.height, 10) - this.step) + "px";
			this.toggler[tid].timer = setTimeout("Gwallwin.toggle('up','" + tid + "')", this.ms);
		} else {
			if (o.offsetHeight >= this.toggler[tid].maxHeight) {
				o.style.height = this.toggler[tid].maxHeight;
				clearTimeout(this.toggler[tid].timer);
				return;
			}
			o.style.height = (parseInt(o.style.height, 10) + this.step) + "px";
			this.toggler[tid].timer = setTimeout("Gwallwin.toggle('down','" + tid + "')", this.ms);
		}
	};
	this.addClient = function (winid) {
		var child = document.getElementById(winid);
		child.style.display = "block";
		this.winObj.gclient = child;
		this.winObj.gwinclient.appendChild(child);
	};
	this.MouseDown = function () {
		if (this.is_IE) {
			this.winObj.gwinhead.setCapture();
		} else {
			event.preventDefault();
			document.addEventListener("mouseup", MouseUp, true);
			document.addEventListener("mousemove", MouseMove, true);
		}
		this.bMove = true;
		this.pX = event.x - this.winObj.gwindow.style.pixelLeft;
		this.pY = event.y - this.winObj.gwindow.style.pixelTop;
		this.WinW = this.winObj.gwindow.clientWidth;
		this.WinH = this.winObj.gwindow.clientHeight;
	};
	this.MouseMove = function () {
		var height = document.body.clientHeight;
		var width = document.body.clientWidth;
		var mx, my;
		if (this.bMove) {
			movx = event.x;
			movy = event.y;
			if (movx > 0 && movx < width) {
				this.winObj.gwindow.style.left = movx - this.pX;
			}
			if (movy > 0 && movy < height) {
				this.winObj.gwindow.style.top = movy - this.pY;
			}
		}
	};
	this.MouseUp = function () {
		if (this.bMove) {
			this.winObj.gwinhead.releaseCapture();
			this.bMove = false;
		}
	};
	this.winClose = function () {
		this.winObj.gcache.appendChild(this.winObj.gclient);
		this.winObj.gmask.style.display = "none";
		this.winObj.gwindow.style.display = "none";
		this.winObj.gclient.style.dispaly = "none";
		this.updown = 0;
		var gwindow = document.getElementById("gwindow");
		if (gwindow.style.height && this.tid != null) {
			gwindow.style.height = this.toggler[this.tid].maxHeight;
		}
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
		if (wWidth == null) {
			wWidth = 480;
		}
		this.winObj.gwindow.style.width = wWidth;
		if (wHeight != null) {
			this.winObj.gwindow.style.height = wHeight;
		}
		if (xLeft != null) {
			this.winObj.gwindow.style.left = xLeft;
		}
		if (yTop != null) {
			this.winObj.gwindow.style.top = yTop;
		}
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
var $dp, WdatePicker;
(function () {
	var _ = {$wdate:true, $dpPath:"", $crossFrame:true, doubleCalendar:false, autoUpdateOnChanged:false, position:{}, lang:"auto", skin:"default", dateFmt:"yyyy-MM-dd HH:mm", realDateFmt:"yyyy-MM-dd", realTimeFmt:"HH:mm", realFullFmt:"%Date %Time", minDate:"1900-01-01 00:00", maxDate:"2099-12-31 23:59", startDate:"", alwaysUseStartDate:false, yearOffset:1911, firstDayOfWeek:0, isShowWeek:false, highLineWeekDay:true, isShowClear:true, isShowToday:true, isShowOK:true, isShowOthers:true, readOnly:false, errDealMode:0, autoPickDate:null, qsEnabled:true, specialDates:null, specialDays:null, disabledDates:null, disabledDays:null, opposite:false, onpicking:null, onpicked:null, onclearing:null, oncleared:null, ychanging:null, ychanged:null, Mchanging:null, Mchanged:null, dchanging:null, dchanged:null, Hchanging:null, Hchanged:null, mchanging:null, mchanged:null, schanging:null, schanged:null, eCont:null, vel:null, errMsg:"", quickSel:[], has:{}};
	WdatePicker = U;
	var X = window, O = "document", J = "documentElement", C = "getElementsByTagName", V, A, T, I, b;
	switch (navigator.appName) {
	  case "Microsoft Internet Explorer":
		T = true;
		break;
	  case "Opera":
		b = true;
		break;
	  default:
		I = true;
		break;
	}
	A = L();
	if (_.$wdate) {
		M(A + "skin/WdatePicker.css");
	}
	V = X;
	if (_.$crossFrame) {
		try {
			while (V.parent[O] != V[O] && V.parent[O][C]("frameset").length == 0) {
				V = V.parent;
			}
		}
		catch (P) {
		}
	}
	if (!V.$dp) {
		V.$dp = {ff:I, ie:T, opera:b, el:null, win:X, status:0, defMinDate:_.minDate, defMaxDate:_.maxDate, flatCfgs:[]};
	}
	B();
	if ($dp.status == 0) {
		Z(X, function () {
			U(null, true);
		});
	}
	if (!X[O].docMD) {
		E(X[O], "onmousedown", D);
		X[O].docMD = true;
	}
	if (!V[O].docMD) {
		E(V[O], "onmousedown", D);
		V[O].docMD = true;
	}
	E(X, "onunload", function () {
		if ($dp.dd) {
			Q($dp.dd, "none");
		}
	});
	function B() {
		V.$dp = V.$dp || {};
		obj = {$:function ($) {
			return (typeof $ == "string") ? X[O].getElementById($) : $;
		}, $D:function ($, _) {
			return this.$DV(this.$($).value, _);
		}, $DV:function (_, $) {
			if (_ != "") {
				this.dt = $dp.cal.splitDate(_, $dp.cal.dateFmt);
				if ($) {
					for (var A in $) {
						if (this.dt[A] === undefined) {
							this.errMsg = "invalid property:" + A;
						}
						this.dt[A] += $[A];
					}
				}
				if (this.dt.refresh()) {
					return this.dt;
				}
			}
			return "";
		}, show:function () {
			Q(this.dd, "block");
		}, hide:function () {
			Q(this.dd, "none");
		}, attachEvent:E};
		for (var $ in obj) {
			V.$dp[$] = obj[$];
		}
		$dp = V.$dp;
	}
	function E(A, $, _) {
		if (T) {
			A.attachEvent($, _);
		} else {
			var B = $.replace(/on/, "");
			_._ieEmuEventHandler = function ($) {
				return _($);
			};
			A.addEventListener(B, _._ieEmuEventHandler, false);
		}
	}
	function L() {
		var _, A, $ = X[O][C]("script");
		for (var B = 0; B < $.length; B++) {
			_ = $[B].src.substring(0, $[B].src.toLowerCase().indexOf("wdatepicker.js"));
			A = _.lastIndexOf("/");
			if (A > 0) {
				_ = _.substring(0, A + 1);
			}
			if (_) {
				break;
			}
		}
		return _;
	}
	function F(F) {
		var E, C;
		if (F.substring(0, 1) != "/" && F.indexOf("://") == -1) {
			E = V.location.href;
			C = location.href;
			if (E.indexOf("?") > -1) {
				E = E.substring(0, E.indexOf("?"));
			}
			if (C.indexOf("?") > -1) {
				C = C.substring(0, C.indexOf("?"));
			}
			var G, I, $ = "", D = "", A = "", J, H, B = "";
			for (J = 0; J < Math.max(E.length, C.length); J++) {
				G = E.charAt(J).toLowerCase();
				I = C.charAt(J).toLowerCase();
				if (G == I) {
					if (G == "/") {
						H = J;
					}
				} else {
					$ = E.substring(H + 1, E.length);
					$ = $.substring(0, $.lastIndexOf("/"));
					D = C.substring(H + 1, C.length);
					D = D.substring(0, D.lastIndexOf("/"));
					break;
				}
			}
			if ($ != "") {
				for (J = 0; J < $.split("/").length; J++) {
					B += "../";
				}
			}
			if (D != "") {
				B += D + "/";
			}
			F = E.substring(0, E.lastIndexOf("/") + 1) + B + F;
		}
		_.$dpPath = F;
	}
	function M(A, $, B) {
		var D = X[O][C]("HEAD").item(0), _ = X[O].createElement("link");
		if (D) {
			_.href = A;
			_.rel = "stylesheet";
			_.type = "text/css";
			if ($) {
				_.title = $;
			}
			if (B) {
				_.charset = B;
			}
			D.appendChild(_);
		}
	}
	function Z($, _) {
		E($, "onload", _);
	}
	function G($) {
		$ = $ || V;
		var A = 0, _ = 0;
		while ($ != V) {
			var D = $.parent[O][C]("iframe");
			for (var F = 0; F < D.length; F++) {
				try {
					if (D[F].contentWindow == $) {
						var E = W(D[F]);
						A += E.left;
						_ += E.top;
						break;
					}
				}
				catch (B) {
				}
			}
			$ = $.parent;
		}
		return {"leftM":A, "topM":_};
	}
	function W(F) {
		if (F.getBoundingClientRect) {
			return F.getBoundingClientRect();
		} else {
			var A = {ROOT_TAG:/^body|html$/i, OP_SCROLL:/^(?:inline|table-row)$/i}, E = false, H = null, _ = F.offsetTop, G = F.offsetLeft, D = F.offsetWidth, B = F.offsetHeight, C = F.offsetParent;
			if (C != F) {
				while (C) {
					G += C.offsetLeft;
					_ += C.offsetTop;
					if (S(C, "position").toLowerCase() == "fixed") {
						E = true;
					} else {
						if (C.tagName.toLowerCase() == "body") {
							H = C.ownerDocument.defaultView;
						}
					}
					C = C.offsetParent;
				}
			}
			C = F.parentNode;
			while (C.tagName && !A.ROOT_TAG.test(C.tagName)) {
				if (C.scrollTop || C.scrollLeft) {
					if (!A.OP_SCROLL.test(Q(C))) {
						if (!b || C.style.overflow !== "visible") {
							G -= C.scrollLeft;
							_ -= C.scrollTop;
						}
					}
				}
				C = C.parentNode;
			}
			if (!E) {
				var $ = a(H);
				G -= $.left;
				_ -= $.top;
			}
			D += G;
			B += _;
			return {"left":G, "top":_, "right":D, "bottom":B};
		}
	}
	function N($) {
		$ = $ || V;
		var _ = $[O];
		_ = _[J] && _[J].clientHeight && _[J].clientHeight <= _.body.clientHeight ? _[J] : _.body;
		return {"width":_.clientWidth, "height":_.clientHeight};
	}
	function a($) {
		$ = $ || V;
		var B = $[O], A = B[J], _ = B.body;
		B = (A && A.scrollTop != null && (A.scrollTop > _.scrollTop || A.scrollLeft > _.scrollLeft)) ? A : _;
		return {"top":B.scrollTop, "left":B.scrollLeft};
	}
	function D($) {
		src = $ ? ($.srcElement || $.target) : null;
		if ($dp && $dp.cal && !$dp.eCont && $dp.dd && src != $dp.el && $dp.dd.style.display == "block") {
			$dp.cal.close();
		}
	}
	function Y() {
		$dp.status = 2;
		H();
	}
	function H() {
		if ($dp.flatCfgs.length > 0) {
			var $ = $dp.flatCfgs.shift();
			$.el = {innerHTML:""};
			$.autoPickDate = true;
			$.qsEnabled = false;
			K($);
		}
	}
	var R, $;
	function U(G, A) {
		$dp.win = X;
		B();
		G = G || {};
		if (A) {
			if (!F()) {
				$ = $ || setInterval(function () {
					if (V[O].readyState == "complete") {
						clearInterval($);
					}
					U(null, true);
				}, 50);
				return;
			}
			if ($dp.status == 0) {
				$dp.status = 1;
				K({el:{innerHTML:""}}, true);
			} else {
				return;
			}
		} else {
			if (G.eCont) {
				G.eCont = $dp.$(G.eCont);
				$dp.flatCfgs.push(G);
				if ($dp.status == 2) {
					H();
				}
			} else {
				if ($dp.status == 0) {
					U(null, true);
					return;
				}
				if ($dp.status != 2) {
					return;
				}
				var D = C();
				if (D) {
					$dp.srcEl = D.srcElement || D.target;
					D.cancelBubble = true;
				}
				G.el = $dp.$(G.el || $dp.srcEl);
				if (!G.el || G.el["My97Mark"] === true || G.el.disabled || (G.el == $dp.el && Q($dp.dd) != "none" && $dp.dd.style.left != "-1970px")) {
					$dp.el["My97Mark"] = false;
					return;
				}
				K(G);
				if (G.el.nodeType == 1 && G.el["My97Mark"] === undefined) {
					$dp.el["My97Mark"] = false;
					var _ = D.type == "focus" ? "onclick" : "onfocus";
					E(G.el, _, function () {
						U.call(this, G);
					});
				}
			}
		}
		function F() {
			if (T && V != X && V[O].readyState != "complete") {
				return false;
			}
			return true;
		}
		function C() {
			if (I) {
				func = C.caller;
				while (func != null) {
					var $ = func.arguments[0];
					if ($ && ($ + "").indexOf("Event") >= 0) {
						return $;
					}
					func = func.caller;
				}
				return null;
			}
			return event;
		}
	}
	function S(_, $) {
		return _.currentStyle ? _.currentStyle[$] : document.defaultView.getComputedStyle(_, false)[$];
	}
	function Q(_, $) {
		if (_) {
			if ($ != null) {
				_.style.display = $;
			} else {
				return S(_, "display");
			}
		}
	}
	function K(H, $) {
		for (var D in _) {
			if (D.substring(0, 1) != "$") {
				$dp[D] = _[D];
			}
		}
		for (D in H) {
			if ($dp[D] !== undefined) {
				$dp[D] = H[D];
			}
		}
		var E = $dp.el ? $dp.el.nodeName : "INPUT";
		if ($ || $dp.eCont || new RegExp(/input|textarea|div|span|p|a/ig).test(E)) {
			$dp.elProp = E == "INPUT" ? "value" : "innerHTML";
		} else {
			return;
		}
		if ($dp.lang == "auto") {
			$dp.lang = T ? navigator.browserLanguage.toLowerCase() : navigator.language.toLowerCase();
		}
		if (!$dp.dd || $dp.eCont || ($dp.lang && $dp.realLang && $dp.realLang.name != $dp.lang && $dp.getLangIndex && $dp.getLangIndex($dp.lang) >= 0)) {
			if ($dp.dd && !$dp.eCont) {
				V[O].body.removeChild($dp.dd);
			}
			if (_.$dpPath == "") {
				F(A);
			}
			var B = "<iframe style=\"width:1px;height:1px\" src=\"" + _.$dpPath + "My97DatePicker.htm\" frameborder=\"0\" border=\"0\" scrolling=\"no\"></iframe>";
			if ($dp.eCont) {
				$dp.eCont.innerHTML = B;
				Z($dp.eCont.childNodes[0], Y);
			} else {
				$dp.dd = V[O].createElement("DIV");
				$dp.dd.style.cssText = "position:absolute;z-index:19700";
				$dp.dd.innerHTML = B;
				V[O].body.appendChild($dp.dd);
				Z($dp.dd.childNodes[0], Y);
				if ($) {
					$dp.dd.style.left = $dp.dd.style.top = "-1970px";
				} else {
					$dp.show();
					C();
				}
			}
		} else {
			if ($dp.cal) {
				$dp.show();
				$dp.cal.init();
				if (!$dp.eCont) {
					C();
				}
			}
		}
		function C() {
			var F = $dp.position.left, B = $dp.position.top, C = $dp.el;
			if (C != $dp.srcEl && (Q(C) == "none" || C.type == "hidden")) {
				C = $dp.srcEl;
			}
			var H = W(C), $ = G(X), D = N(V), A = a(V), E = $dp.dd.offsetHeight, _ = $dp.dd.offsetWidth;
			if (isNaN(B)) {
				if (B == "above" || (B != "under" && (($.topM + H.bottom + E > D.height) && ($.topM + H.top - E > 0)))) {
					B = A.top + $.topM + H.top - E - 3;
				} else {
					B = A.top + $.topM + H.bottom;
				}
				B += T ? -1 : 1;
			} else {
				B += A.top + $.topM;
			}
			if (isNaN(F)) {
				F = A.left + Math.min($.leftM + H.left, D.width - _ - 5) - (T ? 2 : 0);
			} else {
				F += A.left + $.leftM;
			}
			$dp.dd.style.top = B + "px";
			$dp.dd.style.left = F + "px";
		}
	}
})();

