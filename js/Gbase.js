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
/*
* 添加事件监听函数  
* elm 目标元素  
* evType 触发事件的种类  
* fn 监听函数  
* Capture 捕获阶段  
*/
function GaddEvent(elm, evType, fn, Capture) {
	if (elm.addEventListener) {
		elm.addEventListener(evType, fn, Capture);//DOM2.0 
		return true;
	} else {
		if (elm.attachEvent) {
			var r = elm.attachEvent("on" + evType, fn);//IE+ 
			return r;
		} else {
			elm["on" + evType] = fn;//DOM 0 
		}
	}
}

//去除前后空格
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

//正则表达式,中文字符
function existzh_CN(str) {
	var pattern = /[\u4e00-\u9fa5]/g;  
    //检测是否中文字符
	if (pattern.test(str)) {
		return true;
	} else {
		return false;
	}
}

//获取querystring 的参数值
Request = {QueryString:function (item) {
	var svalue = location.search.match(new RegExp("[?&]" + item + "=([^&]*)(&?)", "i"));
	return svalue ? svalue[1] : svalue;
}};
/**清空form*/
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
/**
 *指定元素的值及非空验证
 *formId:	传入的form的id
 *elements:	元素值以逗号分隔
 *values:	对应元素的值
 *type:		Y用于清空 N用于验证非空
 *focusId:	给予指定id，焦急也可为(null)不指定
 */
function textClearOrCheck(formId, elements, values, type, focusId) {
	//指定元素
	var ele = elements.split(",");
	//指定值
	var val = values.split(",");
	if (ele.length == val.length) {
		for (var i = 0; i < ele.length; i++) {
			var eleId = formId + ":" + ele[i];
		    //清空数值
			if (type == "Y") {
				if ($(eleId) != null) {
					$(eleId).value = val[i];
					if (focusId != null) {
						$(formId + ":" + focusId).focus();
					}
				}
			}
		    //验证不允许为空
			if (type == "N") {
				if ($(eleId).value.Trim().length <= 0) {
					alert(val[i] + "\u4e0d\u80fd\u4e3a\u7a7a!");
		    		//如果可用
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
var Gskin = parent.Gskin;	//切换皮肤用
var Gwin = parent.Gwin;	//声明当前界面的Gwin,一定得全局变量.其他地方导出都用到这个.
Gskin ? Gskin.changeSkin(GetPageName().split(".")[0],function(){
	var ifs = document.getElementsByTagName("iframe");
	for(var l=ifs.length-1;l>=0;l--){
		Gskin.setSkinCss(null,ifs[l]);
	}
}) : null;

function GetPageName(url){
	url = url ? url : document.location.href;
	var url = url.split("?")[0],c;
	for(var i=url.length;i>0;i--){
		c = url.charAt(i);
		if(c == '/' || c == '\\'){
			url = url.substring(i+1,url.length);
			break;
		}
	}
	return url;
}

/**弹出选择页面*/
function showModal(url, width, height,dom,parentID,title) {
	var winid = "Gwin_"+GetPageName(url).split(".")[0]+url.length;
	var patrn = /[?]/;   
	//应分原URL有没有参数处理
	if (patrn.exec(url)) {
		url += "&time=" + new Date().getTime();
	} else {
		url += "?time=" + new Date().getTime();
	}
	var w = parseInt(width),h = parseInt(height);
	w = (w && w!= "NaN" ? w : 600);
	h = (h && h!= "NaN" ? h : 500);
	dom = dom ? dom : document;
	if(Gwin){
		Gwin.open({
			id:winid,
			title:title?title:"",
			contextType:"URL",
			context:url,
			dom:dom,
			scrolling:'yes',
			parentID:parentID ? parentID : null,
			lock:true,
			showbt:false,
			width: w,
			height: h
		}).show(winid);
		return winid;
	}else{
		var ret  =window.showModalDialog(url, window, "dialogHeight:" + height + "px;dialogWidth:" + width + "px;status:no;resizable:no;");
		if(!ret){  
			ret = window.ReturnValue;
		}
		return ret;
	}
}

function showModal(url, width, height,dom,parentID,title,x,y) {
	var winid = "Gwin_"+GetPageName(url).split(".")[0]+url.length;
	var patrn = /[?]/;   
	//应分原URL有没有参数处理
	if (patrn.exec(url)) {
		url += "&time=" + new Date().getTime();
	} else {
		url += "?time=" + new Date().getTime();
	}
	var w = parseInt(width),h = parseInt(height);
	w = (w && w!= "NaN" ? w : 600);
	h = (h && h!= "NaN" ? h : 500);
	dom = dom ? dom : document;
	if(Gwin){
		Gwin.open({
			id:winid,
			title:title?title:"",
			contextType:"URL",
			context:url,
			dom:dom,
			scrolling:'yes',
			parentID:parentID ? parentID : null,
			lock:true,
			showbt:false,
			width: w,
			height: h,
			top:y
		}).show(winid);
		return winid;
	}else{
		var ret  =window.showModalDialog(url, window, "dialogHeight:" + height + "px;dialogWidth:" + width + "px;status:no;resizable:no;");
		if(!ret){  
			ret = window.ReturnValue;
		}
		return ret;
	}
}


//验证是否为数字型,并且小数部分为2位有效数字
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
/*正整数验证*/
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
/*非负整数验证(含0)*/
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

//验证是否为数字型,并且小数部分为2位有效数字
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
/*数字显示格式化函数
alert(formatNumber(0,''));
alert(formatNumber(12432.21,'#,###'));
alert(formatNumber(12432.21,'#,###.000#'));
alert(formatNumber(12432,'#,###.00'));
alert(formatNumber(12432.419,'#,###.0#'))
*/
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
			//outputFloat		= outputFloat.substring(0,formatFloat.length);
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
String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
	if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
		return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
	} else {
		return this.replace(reallyDo, replaceWith);
	}
};
var hashMap = {Set:function (key, value) {
	this[key] = value;
}, Get:function (key) {
	return this[key];
}, Contains:function (key) {
	return this.Get(key) == null ? false : true;
}, Remove:function (key) {
	delete this[key];
}};
function keyhandle(obj) {
	e = window.event;
	var keycode = e.which ? e.which : e.keyCode;
	//alert(keycode);
	if (keycode == 13 || keycode == 108) {
		var n = obj.id;
		var l = n.length;
		var fk, fn;
		for (var i = l - 1; i >= 0; i--) {
			fk = n.substring(i, i + 1);
			if (fk == "_") {
				fk = n.substring(0, i);
				fn = n.substring(i + 1, l);
				break;
			}
		}
		fn = eval(fn + "+ 1");
		fk = fk + "_" + fn;
		//存在才跳
		if ($(fk) != null) {
			$(fk).focus();
		} else {
			return;
		}
	}
}
function keyhandleupdown(obj) {
	e = window.event;
	var keycode = e.which ? e.which : e.keyCode;
	if (keycode == 38) {
		var n = obj.id;
		var l = n.length;
		var fk, fn;
		for (var i = l - 1; i >= 0; i--) {
			fk = n.substring(i, i + 1);
			if (fk == "_") {
				fk = n.substring(0, i);
				fn = n.substring(i + 1, l);
				break;
			}
		}
		fn = eval(fn + "- 1");
		fk = fk + "_" + fn;
		//存在才跳
		if ($(fk) != null) {
			$(fk).focus();
		}
	} else {
		if (keycode == 40) {
			var n = obj.id;
			var l = n.length;
			var fk, fn;
			for (var i = l - 1; i >= 0; i--) {
				fk = n.substring(i, i + 1);
				if (fk == "_") {
					fk = n.substring(0, i);
					fn = n.substring(i + 1, l);
					break;
				}
			}
			fn = eval(fn + "+ 1");
			fk = fk + "_" + fn;
		//存在才跳
			if ($(fk) != null) {
				$(fk).focus();
			}
		}
	}
}