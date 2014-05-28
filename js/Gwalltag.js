/**
 * 版本:1.0
 * 更新:2013-06-28
 */
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

var GwallWHG = new function () {
	this.bMove = false;
	this.WHGObj = null;
	this.pX = 0;
	this.pY = 0;
	this.WinW = 0;
	this.WinH = 0;
	this.WHG = function (nodeobj) {
		this.WHGObj = nodeobj;
//		GaddEvent(this.WHGObj,"mousedown",this.MouseDown,false);
//		GaddEvent(this.WHGObj,"mousemove",this.MouseMove,false);
//		GaddEvent(this.WHGObj,"mouseup",this.MouseUp,false);
		return this.WHGObj;
	};
	this.MouseDown = function () {
var e = window.event || arguments.callee.caller.arguments[0];
var _element = e.srcElement ? e.srcElement : e.target;
		_element.setCapture();
		this.bMove = true;

		var item = event.srcElement;
		var totalLeft = 0;
		do {
			s = "item.offsetLeft";
			totalLeft += eval(s);
			item = item.offsetParent;
		} while (item != null);
		item = event.srcElement;
		var totalTop = 0;
		do {
			s = "item.offsetTop";
			totalTop += eval(s);
			item = item.offsetParent;
		} while (item != null);
		this.pX = event.x - totalLeft;
		this.pY = event.y - totalTop;
		
		//this.pX = event.x - event.srcElement.style.pixelLeft;
		//this.pY = event.y - event.srcElement.style.pixelTop;
		this.WinW =_element.clientWidth;
		this.WinH = _element.clientHeight;
		/*
		if (this.is_IE){ 
			event.srcElement.setCapture();
		}else{
			//event.preventDefault();
			document.addEventListener("mouseup",MouseUp,true);
			document.addEventListener("mousemove",MouseMove,true);
		}
		*/
	};
	this.MouseMove = function () {
		var height = document.body.clientHeight;
		var width = document.body.clientWidth;
var e = window.event || arguments.callee.caller.arguments[0];
var _element = e.srcElement ? e.srcElement : e.target;
		var mx, my;
		if (this.bMove) {
			movx = event.x;
			movy = event.y;
			if (movx > 0 && movx < width) {
				_element.style.left = movx - this.pX;
			}
			if (movy > 0 && movy < height) {
				_element.style.top = movy - this.pY;
			}
		}
	};
	this.MouseUp = function () {
var e = window.event || arguments.callee.caller.arguments[0];
var _element = e.srcElement ? e.srcElement : e.target;
		if (this.bMove) {
			_element.releaseCapture();
			this.bMove = false;
		}
	};
};

var GJSON = new function () {
	var gJSONobj;
	var gid;
	var gclass;
	this.initJSON = function (gid) {
		var s = $("Gjson_" + gid);
		var s1 = "(" + s.innerHTML + ")";
		this.gJSONobj = eval(s1);
		this.gid = gid;
		this.gclass = this.gJSONobj.gclass;
	
		//根据不同的类型生成HTML代码
		if (s.gtype == "GWHgraphic") {
			this.DrawgWHgraphic();
		} else {
			if (s.gtype == "GTable") {
			//this.drawTable();		
			}
		}
	};
	this.DrawgWHgraphic = function () {
		var parent = $(this.gid);
		parent.value = this.gJSONobj.gwhgid;
		var len = this.gJSONobj.GWHgraphic.length;
		//先清空
		var divnode = document.createElement("div");
		divnode.className = this.gclass + "_whg_head";
		if (this.gJSONobj.gwhgid == "") {
			divnode.innerHTML = "";
		} else {
			divnode.innerHTML = this.gJSONobj.gwhgid + "--\u5e93\u4f4d\u56fe";
		}
		parent.appendChild(divnode);
		var divmainnode = document.createElement("div");
		divmainnode.className = this.gclass + "_whg_main";
		parent.appendChild(divmainnode);
		var prerow = 0;
		var currrow;
		var tablenode = document.createElement("table");
		var tbody = document.createElement("tbody");
		var trnode;
		var tdnode;
//		var rowl = new Array();
//		var colw = new Array();
		if (len > 0) {
			var rowl = this.gJSONobj.GWHgraphic[1].in_rowl;
			var colw = this.gJSONobj.GWHgraphic[1].in_colw;
			trnode = document.createElement("tr");
			//先生成一行无内容的TR，避免COLSPAN不对齐
			for (var i = 0; i < rowl; i++) {
				tdnode = document.createElement("td");
				tdnode.id = i;
				trnode.appendChild(tdnode);
			}
			tbody.appendChild(trnode);
			for (var i = 0; i < len; i++) {
				currrow = this.gJSONobj.GWHgraphic[i].in_row;
				if (prerow != currrow) {
					prerow = currrow;
					//取得库位层
					tbody.appendChild(trnode);
					
					//再创建新的一行(tr)
					trnode = document.createElement("tr");
				}
				tdnode = document.createElement("td");
				tdnode.rowSpan = this.gJSONobj.GWHgraphic[i].in_rowspan;
				tdnode.colSpan = this.gJSONobj.GWHgraphic[i].in_colspan;
				
				//tdnode.innerHTML = "i:" + i;
				
				var divnode = this.createnode(this.gJSONobj.GWHgraphic[i]);
				tdnode.appendChild(divnode);
				trnode.appendChild(tdnode);
			}
			tbody.appendChild(trnode);
			tablenode.border = "0";
			tablenode.cellPadding = "0";
			tablenode.cellSpacing = "0";
		}
		tablenode.appendChild(tbody);
		divmainnode.appendChild(tablenode);
	};
	this.createnode = function (obj) {
		var WHID = obj.vc_warehouseid;
		var WHGtext = obj.nv_warehousename;
		var node = document.createElement("DIV");
		var zoom = obj.dc_zoom;
		node.style.width = (obj.in_length * zoom);
		node.style.height = (obj.in_width * zoom * 2);
		//分不同的层来表示不同的库位或分隔带
		if (WHID != "") {
			if (obj.ch_flag != "0") {			//系统库位
				node.id = WHID;
				var rate = (obj.dc_factvolume / obj.dc_volume * 100);
				//库位层
				WHGtext = WHGtext + "<br />";
				WHGtext = WHGtext + "\u4f7f\u7528\u7387:" + rate.toFixed(2) + "%";
				if (rate > 90) {
					node.className = this.gclass + "_whg_warn";
				} else {
					node.className = this.gclass + "_whg_normal";
				}
				node.innerHTML = WHGtext;
				node.setAttribute("whid", obj.vc_warehouseid);
				//用ADD EVENT的方式处理不了参数问题
				//addEvent(node, "click", new Function(this.gJSONobj.gclick), false);
	
				//var mygclick = this.gJSONobj.gclick;
				//var f2 = new Function("x", "y", "return x*y;"); //使用Function和new定义 
				var funclick = new Function((this.gJSONobj.gclick));//Function()构造函数
				node.onclick = funclick;
				node.onselectstart = new Function("return false");
				node = GwallWHG.WHG(node);
			} else {							//非系统库位			
				node.id = WHID;
				var tag = WHGtext.substring(0, 2);
				if (tag == "W:") {				//横标尺
					//库位层
					WHGtext = WHGtext.substring(2, WHGtext.length);
					node.className = this.gclass + "_whg_w";
					node.innerHTML = WHGtext;
				} else {
					if (tag == "H:") {		//竖标尺
					//库位层
						WHGtext = WHGtext.substring(2, WHGtext.length);
						node.className = this.gclass + "_whg_h";
						node.innerHTML = WHGtext;
					} else {
					//库位层
						WHGtext = WHGtext;
						node.className = this.gclass + "_whg_other";
						node.innerHTML = WHGtext;
					}
				}
				node.setAttribute("whid", obj.vc_warehouseid);
				//用ADD EVENT的方式处理不了参数问题
				//addEvent(node, "click", new Function(this.gJSONobj.gclick), false);

				//var mygclick = this.gJSONobj.gclick;
				//var f2 = new Function("x", "y", "return x*y;"); //使用Function和new定义

//				var funclick = new Function((this.gJSONobj.gclick));//Function()构造函数
//				node.onclick = funclick;
				node.onselectstart = new Function("return false");
				node = GwallWHG.WHG(node);
			}
		} else {
			node.id = WHID;
			node.className = this.gclass + "_whg_space";
			node.setAttribute("whid", obj.vc_warehouseid);
			node.innerHTML = "&nbsp";
			node.onselectstart = new Function("return false");
			node = GwallWHG.WHG(node);
		}
		return node;
	};

};


/***************************** 右键菜单 开始 *****************************/

function GMenu(_object, _menu) {
	this.IEventHander = null;
	this.IMenuHander = null;
	this.IContextMenuHander = null;
	this._GMenu = _menu
	
	// SHOW MENU
	this.Show = function (_menu) {
		var e = window.event || arguments.callee.caller.arguments[0];
		if (e.button == 2) {
			if (window.document.all) {
				this.IContextMenuHander = function () {
					return false;
				};
				document.attachEvent("oncontextmenu", this.IContextMenuHander);
			} else {
				this.IContextMenuHander = document.oncontextmenu;
				
				document.oncontextmenu = function () {
					return false;
				};
			}
			
			window.GMenu$Object = this;
			this.IEventHander = function () {
				window.GMenu$Object.Hide(_menu);	
			};
			
			if (window.document.all) {
				document.attachEvent("onmousedown", this.IEventHander);
			} else {
				document.addEventListener("mousedown", this.IEventHander, false);
			}
			
			_menu.style.left = e.clientX;
			_menu.style.top = e.clientY;
			_menu.style.display = "";

			if (this.IMenuHander) {
				var _iMenumain = $(this.IMenuHander);
				_iMenumain.style.left = e.clientX;
				_iMenumain.style.top = e.clientY;
				_iMenumain.style.height = _menu.offsetHeight;
				_iMenumain.style.width = _menu.offsetWidth;
				_iMenumain.style.display = "none";
			}
		}
	};
	
	// HIDE MENU
	this.Hide = function (_menu) {
		var e = window.event || arguments.callee.caller.arguments[0];
		var _element = e.srcElement ? e.srcElement : e.target;;
		do {
			if (_element == _menu) {
				return false;
			}
		} while ((_element = _element.offsetParent));
		
		if (window.document.all) {
			document.detachEvent("on" + e.type, this.IEventHander);
		} else {
			document.removeEventListener(e.type, this.IEventHander, false);
		}
		
		if (this.IMenuHander) {
			$(this.IMenuHander).style.display = "none";;
		}
		
		_menu.style.display = "none";
		if (window.document.all) {
			document.detachEvent("oncontextmenu", this.IContextMenuHander);
		} else {
			document.oncontextmenu = this.IContextMenuHander;
		}
	};
	
	// _object 要弹出右键的HTML对象,_menu 要显示的菜单
	this.initialize = function (_object, _menu) {
		window._GMenu$Object = this;
		var _eventHander = function () {
			window._GMenu$Object.Show(_menu);
		};

		_menu.style.position = "absolute";
		_menu.style.display = "none";
		_menu.style.zIndex = "1000000";
		
		if (window.document.all) {
			var _gmenumain = document.createElement("div");
			$(_object).appendChild(_gmenumain);
			//document.body.insertBefore(_gmenumain, document.body.firstChild);
			_gmenumain.id = _menu.id + "_main";
			
			this.IMenuHander = _gmenumain.id;
			
			_gmenumain.className = "default_gmenu_main";
			
			//GaddEvent(this.WHGObj,"mousedown",this.MouseDown,false);
			
			_object.attachEvent("onmouseup", _eventHander);
		} else {
			_object.addEventListener("mouseup", _eventHander, false);
		}
	};
	
	this.initialize(_object, _menu);
}

/***************************** 右键菜单 结束 *****************************/

/***************************** Gtable 开始 *****************************/
var Gtable = new function () {
	this.isIE = (!+ [ 1, ]) ? true : false;
	this.x = 0;
	this.objw = 0;
	this.resizeable = false;
	this.resizebegin = false;
	this.newwidth = 0;
	this.spanid = "";
	this.selectBgColor = "#92BFD8";
	this.debug = false;	//是否调试,如果要调试;右击查看代码之类的调试;就设置Gtable.debug = true;
	this.GfreezeIndex = {};	//分多个处理,根据ID去里面的index;控制层次
	this.selectUpRows = {};
	this.GtableObj = {tabID:'',columnN:-1,GtableCD:null};
	
	/**
	 * Gtable完成时候初始化函数:编号,宽度,自定义合计公式结果对象数组
	 */
	this.inittable = function (gtableid, gwidth) {
		//设置当前窗口的名称,保证点击是在本窗口打开
        window.name = "__self";       
		var tab = $(gtableid + "_table");
		if(gwidth > parent.document.body.clientWidth-205){
			tab.style.width = gwidth;
			$(gtableid).style.width = gwidth;
			var obj = $("mmain_nav");
			if(obj){
				obj.style.width = gwidth;
			}
			obj = $("mmain");
			if(obj){
				obj.style.width = gwidth;
			}
		}else{
			tab.style.width = "100%";
			$(gtableid).style.width = "100%";
		}
		tab.oncontextmenu = function(e){return Gtable.getColumn(e);};
		var fun = function(){
			//如果gtable中存在输入编辑列就会自动添加键盘事件
			Gtable.inputKey(gtableid);
			//冻结列
			Gtable.Gfreeze(gtableid);
		};
		setTimeout(fun,1000);
		if(window.onGtableLoad){
			window.onGtableLoad(gtableid);
		}
		this.initTrColor(gtableid);
	};
	 
	this.initTrColor = function( gid ){	//斑马线
		var tab = $(gid + "_table");
		var rows = tab.rows,len = rows.length - 1;
		if(rows[len].id.indexOf("_foot_r") == -1){
			len++;
		}
		for(var i=2;i<len;i+=2){
			rows[i].className = "default_body2";
			rows[i].setAttribute("oldclass","default_body2");
		}
	};
	
	this.initSelecte = function(id,vs){		//初始化选中
		var tab = $(id+"_table");
		var vss = "";
		for(var i = 0;i<vs.length;i++){
			vss += vs[i]+"#@#";
		}
		var cb,ips;
		for(var i=0;i<tab.rows.length;i++){
			cb = null;
			ips = tab.rows[i].getElementsByTagName("INPUT");
			for(var j=0;j<ips.length;j++){
				if(ips[j].type == "checkbox"){
					cb = ips[j];
					break;
				}
			}
			if(cb){
				cb.checked = vss.indexOf(cb.value+"#@#")!= -1;
			}
		}
	};
	
	this.selectRow = function( obj ){
		return;//被initCBselected实现
	};
	/**
	 * a标签的点击事件,头部排序,尾部翻页
	 * 处理在chrome中的bug:A,B选项卡,在B中点击排序,内容跑到A去了.MB...奇怪
	 */
	this.aClick = function(obj){
		var v = obj.getAttribute("href");
		if(Gtable.isIE && v.indexOf("javascript:")!= -1){
			v = v.split("javascript:")[1];
			eval(v);
			window.event.returnValue = false;
			return ;
		}
		window.event.returnValue = false;
		//不显示总页数时候不进行排序
		var id = obj.parentNode.id.split("_")[0];
		var o = $(id+"_showpage");
		var isNotPage = false;
		if(o && o.parentNode){
			isNotPage = $(id+"_showpage").parentNode.style.display == "none";	//不显示总页数
		}
		var isPageRow = obj.parentNode.id.indexOf("_foot_") != -1;
		var v = obj.getAttribute("href");
		if(isNotPage){
			if(isPageRow){	//是翻页行,后台排序
				if(Gtable.isFilter && v.charAt(0) == '?'){
					v += Gtable.getGroupFileds(id);
				}
				document.location.href = v;
			}else{	//JS排序
				var bool = obj.getAttribute("isSX") == "F" ? true:false;
				obj.setAttribute("isSX",bool ? "T":"F");
				while(obj && obj.tagName != "TD"){
					obj = obj.parentNode;
				}
				var cellIndex = obj.cellIndex;
				if(Gtable.isIE){	//IE下会计算当前列的方式有点问题.隐藏的也得算进去.不然操作错误.
					var tr = obj.parentNode,tds=tr.cells,hideN=0;
					for(var i=0,j=tds.length;i<j;i++){
						if(obj.id === tds[i].id)break;
						if(tds[i].style.display === "none"){
							hideN++;
						}
					}
					cellIndex+=hideN;
				}
				Gtable.Gsort(id,cellIndex,bool);
			}
		}else{	//正常情况
			if(v.indexOf("javascript:")!=-1){
				v = v.split("javascript:")[1];
				eval(v);
			}else{
				if(Gtable.isFilter && v.charAt(0) == '?'){
					v += Gtable.getGroupFileds(id);
				}
				document.location.href = v;
			}
		}
	};
	
	/**
	 * 得到要操作的列存放于GtableObj中.
	 */
	this.getColumn = function(e){
		if(this.debug == true)return false;		//如果要调试;右击查看代码之类的调试;就设置Gtable.debug = true;
		if(e);else{e = event;}
		var obj = e.srcElement ? e.srcElement : e.target;
		if(obj){
			while(obj && obj.tagName != "TD"){
				obj = obj.parentNode;
			}
			if(obj){
				if(obj.id.length == 0 )return false;	//没有ID编号的就是个空的,或者尾部
			}else return false;
			var cellIndex = obj.cellIndex;
			if(!+ [ 1, ]){	//IE下会计算当前列的方式有点问题.隐藏的也得算进去.不然操作错误.
				var tr = obj.parentNode,tds=tr.cells,hideN=0;
				for(var i=0,j=tds.length;i<j;i++){
					if(obj.id === tds[i].id)break;
					if(tds[i].style.display === "none"){
						hideN++;
					}
				}
				cellIndex+=hideN;
			}
			var GtableObj = Gtable.GtableObj;
			GtableObj.tabID = obj.id.split("_")[0]; //这里有问题
			if(GtableObj.GtableCD == null){
				Gtable.createDiv();
			}
			GtableObj.GtableCD.style.top = e.clientY + document.body.scrollTop - 10;
			GtableObj.GtableCD.style.left = e.clientX + document.body.scrollLeft;
			GtableObj.GtableCD.style.display = "";
			Gtable.initCopyJS();	//初始化复制对象
			Gtable.initCopyText(); //准备要复制的数据
			GtableObj.copyObj.show();
			GtableObj.columnN = cellIndex;
		}
		return false;
	};
	/**
	 * 创建菜单
	 */
	this.createDiv = function(){
		var div = document.createElement("div");
		div.id = Gtable.GtableObj.tabID+"_menu";
		div.style.zIndex = 1001;
		div.style.width = Gtable.isIE ? "72px" : "80px";
		div.style.backgroundColor = "#E6F0FC";
		div.style.textAlign = "left";   //对齐方式
		div.style.border = "#73D1F7 2px solid";	//边框颜色
		div.style.position = "absolute";
		div.style.display = "none";
		div.innerHTML = '<button onclick="Gtable.GtableCDtd(\'SX\')">将此列升序</button><br>'
			+'<button onclick="Gtable.GtableCDtd(\'JX\')">将此列降序</button><br>'
			+'<button onclick="Gtable.GtableCDtd(\'gexport\')">导出'+(Gtable.isIE ? ' ':' &nbsp;')+'Excel</button><br>'
			+'<button id="Gtable_menu_copyBtn">复制选中值</button><br>'
			+'<button onclick="Gtable.GtableCDtd(\'hide\')">隐藏当前列</button><br>'
			+'<button onclick="Gtable.GtableCDtd(\'show\')">显示附近列</button><br>'
			+'<button onclick="Gtable.GtableCDtd(\'showAll\')">显示所有列</button>';
		div.onmouseover = function(){
			Gtable.GtableObj.menuHide = false;
			Gtable.GtableObj.copyObj.div.style.display = this.style.display = "";
		}
		div.onmouseout = function(e){
			if(e);else{e = event;}
			var obj = e.srcElement ? e.srcElement : e.target;
			if(obj.name != "copyBtnDiv"){
				this.style.display = "none";
				Gtable.GtableObj.menuHide = true;
				setTimeout(function(){
					if(Gtable.GtableObj.menuHide){
						var obj = $(Gtable.GtableObj.tabID+"_menu");
						Gtable.GtableObj.copyObj.div.style.display = obj.style.display = "none";
					}
				},500);
			}
		}
		Gtable.GtableObj.GtableCD = div;
		document.body.appendChild(div);
	};
	/**
	 * 准备移动选中,鼠标按下的时候触发
	 */
	this.initCBselected = function(id,rowObj,row,e){
		var obj = e.srcElement || e.target;
		if(obj.tagName === "TD" || obj.tagName === "SPAN"){
			Gtable.isMoveSelect = true;
			Gtable.isSelectYvalue = e.clientY;
			var cb = $(id+"_checkbox"+row);
			if(cb){
				cb.checked = !cb.checked;
				if(cb.checked){
					rowObj.style.backgroundColor = Gtable.selectBgColor;
				}else{
					rowObj.style.backgroundColor = "";
				}
				document.onmouseup = function(){
					Gtable.isMoveSelect = false;
					document.onmouseup = null;
				};
			}else{
				if(Gtable.selectUpRows[id]){
					Gtable.selectUpRows[id].style.backgroundColor = "";
				}
				rowObj.style.backgroundColor = Gtable.selectBgColor;
				Gtable.selectUpRows[id] = rowObj;
			}
		}
	};
	/**
	 * 准备复制的内容到一个地方.等待触发
	 */
	this.initCopyText = function(){
		var sv = "";
		if(document.selection){
			sv = document.selection.createRange().text;
		}else{
			var selecter = window.getSelection();
			if(selecter.anchorNode && selecter.anchorNode.data){
	        	var data = selecter.anchorNode.data;
	        	sv = data.substring(selecter.anchorOffset,selecter.focusOffset);
	        }
		}
		if(sv.length > 0){
			Gtable.GtableObj.copyText = sv;
			Gtable.GtableObj.copyObj.setText(sv);
		}
	};
	/**
	 * 初始化复制组件
	 */
	this.initCopyJS = function(){
		var GtableObj = Gtable.GtableObj;
		ZeroClipboard.setMoviePath(GtableObj.URL+"/js/copy/ZeroClipboard.swf");
		GtableObj.copyObj = new ZeroClipboard.Client();
		GtableObj.copyObj.glue("Gtable_menu_copyBtn");
		GtableObj.copyObj.addEventListener( "complete", function(){
			var obj = $(Gtable.GtableObj.tabID+"_menu");
			obj.style.display = Gtable.GtableObj.copyObj.div.style.display = "none";
		    alert("已复制["+Gtable.GtableObj.copyText+"]到剪贴板!");
		});
		GtableObj.copyObj.addEventListener( "mouseOver", function(client) {
			Gtable.GtableObj.menuHide = false;
			var obj = $(Gtable.GtableObj.tabID+"_menu");
			obj.style.display = "";
		});
		GtableObj.copyObj.addEventListener( "mouseOut", function(client) {
			Gtable.GtableObj.menuHide = false;
			var obj = $(Gtable.GtableObj.tabID+"_menu");
			if(obj.style.display === "none"){
				Gtable.GtableObj.copyObj.div.style.display = "none";
			}
		});
		GtableObj.copyObj.div.name = "copyBtnDiv";
	};
	/**
	 * 加载复制所需的组件
	 */
	this.loadCopyJS = function(){
		var o = parent,path,i=0;
		while(o){
			o = o.parent;
			if(o && o.document && o.document.getElementById("projectname") != null){
				path = o.document.getElementById("projectname").getAttribute("path");
				break;
			}
			i++;
			if(i > 20){
				path = "获取路径错误!";
				break;
			}
		}
		Gtable.GtableObj.URL = path;
		Gtable.GtableObj.copyObj = null;
		if($("copyJS") == null){
			var js = document.createElement("script");
			js.type = "text/javascript";
			js.id = "copyJS"
			js.src = path+"/js/copy/ZeroClipboard.js";
			document.getElementsByTagName("HEAD").item(0).appendChild(js);
		}
	};
	/**
	 * 菜单中的操作
	 */
	this.GtableCDtd = function(type){
		var GtableObj = Gtable.GtableObj;
		if(type === "showAll"){
			var cells = $(GtableObj.tabID+"_table").rows[0].cells;
			for(var i=0;i<cells.length;i++){
				Gtable.Gfilter(GtableObj.tabID,i,false);
			}
		}else
		if(type === "gexport"){
			Gtable.gexport(GtableObj.tabID,"数据报表",3000,60000);	//默认每页6万
		}else
		if(type === "show"){
			Gtable.Gfilter(GtableObj.tabID,GtableObj.columnN-1,false);
			Gtable.Gfilter(GtableObj.tabID,GtableObj.columnN+1,false);
		}else
		if(type === "hide"){
			Gtable.Gfilter(GtableObj.tabID,GtableObj.columnN,true);
		}else
		if(type === "JX"){
			Gtable.Gsort(GtableObj.tabID,GtableObj.columnN,false);
		}else
		if(type === "SX"){
			Gtable.Gsort(GtableObj.tabID,GtableObj.columnN,true);
		}
		GtableObj.GtableCD.style.top = -200;//隐藏和鼠标进入事件冲突.用这个.
	};
	/**
	 * 过滤
	 * tabID = Gtable的ID
	 * columnN = 第几列
	 */
	this.Gfilter = function( tabID, columnN, type ){
		var rows = $(tabID+"_table").rows;
		var td = rows[0].cells[columnN];
		if(columnN < 0 && rows[0].cells.length <= columnN)return;
		if(td.style.display == "none"){
			if(type)return;
		}else{
			if(!type)return;
		}
		if(td.getAttribute("type") == "HIDDEN"){
			return;//这是Gtable生成的要求隐藏的.
		}
		for(var i=0,j=rows.length-1;i<j;i++){
			rows[i].cells[columnN].style.display = type ? "none" : "";
		}
	};
	/**
	 * 排序 	
	 * tabID = Gtable的ID
	 * columnN = 第几列
	 * type = false降序 | true升序
	 */
	this.Gsort = function( tabID, columnN, type ){
		var tabObj = $(tabID+"_table");
		if(tabObj);else return;
		var trs = tabObj.rows;
		var length = trs.length-1,index;
		var ilh = length - 1,v1,v2;
		columnN*=1;
		if(columnN < 0 && rows[0].cells.length <= columnN)return;
		for(var i=1;i<ilh;i++){
			index = i;
			for(var j=i+1;j<length;j++){
				if(trs[index].id.length == 0 || trs[j].id.length == 0)break;
				v1 = trs[index].cells[columnN].children[0].getAttribute("value");
				v2 = trs[j].cells[columnN].children[0].getAttribute("value");
				if(Gtable.sortCheck(v1,v2,type,columnN) < 0){	//如果返回是个负数就说明要求更换位置
					index = j;	//只到最后一个再来交换.
				}
			}
			if(index != i){	//是否要交换TR
				Gtable.moveRow(tabObj,i,index);
			}
		}
	};
	/**
	 * 判断
	 * type = false降序 | true升序
	 */
	this.sortCheck = function(a,b,type,columnN){
		if(columnN < 2){ //0,1  为什么不转换数字,0大多是多选框也有可能是其他数据,1一样.
			if(a.length == b.length){
				//去执行下面的for
			}else if(a.length > b.length){
				return type ? -1 : 1;
			}else{
				return type ? 1 : -1;
			}
		}
		if(a == b) return 0;
		for(var i=0,j=a.length; i<j; i++){   
			 if(a.charCodeAt(i) > b.charCodeAt(i)){
				 return type ? -1 : 1;
			 }else if(a.charCodeAt(i) < b.charCodeAt(i)){
				 return type ? 1 : -1;
			 }
		}
		return 0;
	};
	/**
	 * TR行替换位置
	 * table对象,行,目标行
	 */
	this.moveRow = function(pNode, sri, tri) {
		if(sri == tri)return;
	    var temp,sr,tr,trnr;
	    if (pNode.tagName == 'TABLE') pNode = pNode.getElementsByTagName('tbody')[0];
	    for(var i=0;i<2;i++){
	    	if(i > 0){
	    		temp = sri;
	    		sri = tri + (sri<tri ? -1 : 1);
	    		tri = temp;
	    	}
		    sr = pNode.rows[sri];
		    tr = pNode.rows[tri];
		    if (sr == null || tr == null) return false;
		    trnr = sri > tri ? false : Gtable.getTRNode(tr, 'nextSibling');
		    if (trnr === false) pNode.insertBefore(sr, tr); //后面行移动到前面，直接insertBefore即可
		    else {//移动到当前行的后面位置，则需要判断要移动到的行的后面是否还有行，有则insertBefore，否则appendChild
		        if (trnr == null) pNode.appendChild(sr);
		        else pNode.insertBefore(sr, trnr);
		    }
	    }
	};
	this.getTRNode = function(nowTR, sibling) { 
		while (nowTR = nowTR[sibling]) if (nowTR.tagName == 'TR') break; return nowTR; 
	};
	//将字符串变成json对象
	this.stringToJson = function (str){
		return (new Function("return " + str))();
	};	
	this.jsonToString = function (obj){  
        var THIS = this;   
        switch(typeof(obj)){  
            case 'string':  
                return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';  
            case 'array':  
                return '[' + obj.map(THIS.jsonToString).join(',') + ']';  
            case 'object':  
                 if(obj instanceof Array){  
                    var strArr = [];  
                    var len = obj.length;  
                    for(var i=0; i<len; i+=1){  
                        strArr.push(THIS.jsonToString(obj[i]));  
                    }  
                    return '[' + strArr.join(',') + ']';  
                }else if(obj == null){  
                    return 'null';  
                }else{  
                    var string = [];  
                    for (var property in obj){
                    	string.push(THIS.jsonToString(property) + ':' + THIS.jsonToString(obj[property]));
                   	}  
                    return '{' + string.join(',') + '}';  
                }  
            case 'number':  
                return obj;  
            case 'boolean':  
                return obj;
        }
    };
    /*筛选开始*/
    this.setGroupSelected = function( fileds ){
    	if(fileds != "null"){
    		Gtable.isFilter = true;
	    	var vs = fileds.split(" and "),vv,s;
	    	for(var i=0;i<vs.length;i++){
	    		vv = vs[i].split(" = ");
	    		s = $(vv[0]+"_filter");
	    		if(s){
	    			s.setAttribute("selectValue",vv[1]);
	    		}
	    	}
    	}else{
    		Gtable.isFilter = false;
    	}
    };
    this.groupSelect = function(e, isShow){
    	var o = e.target || e.srcElement;
    	var sp = o.parentNode,a = sp.children[0],s;
    	if(isShow){
    		s = sp.children[1];
    		Gtable.getColGroupColData(s);
    		o.style.display = a.style.display = "none";
    		s.style.display = "";
    		s.focus();
    	}else{
    		s = sp.children[2];
    		s.style.display = a.style.display = "";
    		o.style.display = "none";
    	}
    };
    this.getColGroupColData = function( obj ){	//获取指定列的最新分组数据
    	if(obj.getAttribute("loadOK") != "OK"){
    		var vs = obj.id.split("_");
    		var tabID = vs[0];
    		var colName = vs[1];
    		var requestURL = document.URL.replaceAll("&isAll=0","");
	    	this.ajax({url:requestURL,type:'post',
	    	data:{ajaxid:tabID,selectID:obj.id,getGroupColData:true,filed:colName,sql:Gtable.getSQL(tabID)},
	    	successFun:function( data ){
				obj.setAttribute("loadOK","OK");
				Gtable.updateColSelectData(Gtable.stringToJson(data.substring(data.indexOf("GETGROUPDATAS")+13,data.indexOf("GETGROUPDATAE"))));		
	    	},
	    	failureFun:function( state ){
	    		alert("请求分组数据失败:"+state);
	    	}});
    	}
    };
    this.updateColSelectData = function( data ){	//更新指定列的分组数据//data=["V1","V2","V3"]
    	var o = $(data.id),list = o.options,j = list.length,item;
    	var mask = o.getAttribute("mask");
    	var mk,map = null,vs;
    	if(mask){
    		map = {};
    		vs = mask.split("/");
    		for(var i=0;i<vs.length;i++){
    			mk = vs[i].split(":");
    			map["_"+mk[0]] = mk[1];
    		}
    		o.removeAttribute("mask");
    	}
    	for(var i=0;i<data.list.length;i++){
    		if(map != null){
    			item = new Option(map["_"+data.list[i]], data.list[i]);	
    		}else{
    			item = new Option(data.list[i], data.list[i]);
    		}
        	list.add(item);
    	}
    	if(o.getAttribute("selectValue") != null){
			o.value = o.getAttribute("selectValue");
			o.removeAttribute("selectValue");
		}
    };
    this.updateGtable = function( obj ){		//根据所有的筛选条件得出最新的数据列表
    	Gtable.groupSelect({target:obj},false);
    	if(obj.value != obj.getAttribute("tempValue")){
    		obj.setAttribute("tempValue",obj.value);
    		var tabID = obj.id.split("_")[0];
    		var fileds = Gtable.getGroupFileds(tabID);
    		if(fileds.length > 0){
    			window.location.href = "?ajaxid="+tabID+fileds
    			//Gtable.reLoadTable({ajaxid:tabID,getGroupData:true,fileds:fileds});    			
    		}
    	}
    };
    this.getGroupFileds = function( id ){	//获取所有分组字段
    	var tr = $(id+"_table").rows[0],td,fileds = "",v,s;
    	for(var i=0;i<tr.cells.length;i++){
    		td = tr.cells[i];
    		if(td.style.display != "none" && td.children[0].children.length == 3 && td.children[0].children[1].tagName =='SELECT'){//里面有3个元素就是分组的
    			if(fileds.length > 0){
    				fileds += ";";
    			}
    			s = td.children[0].children[1];
    			if(s.getAttribute("selectValue") != null){
    				v = s.getAttribute("selectValue");
    			}else{
    				v = s.value;
    			}
    			fileds += td.id.split("_")[1]+"_FV_"+v;
    		}
    	}
    	if(fileds.length > 0){
    		fileds = "&getGroupData=true&fileds="+fileds;	
    	}
    	return fileds;
    };
    /*筛选结束*/
    this.reLoadTable = function(data){	//刷新Gtable:翻页,排序,分组
    	var action = "";
    	if(typeof data != "object"){
    		var o = {};
    		var vs = data.split("?");
    		action = vs[0];
    		vs = vs[1].split("&");
    		var kv;
    		for(var i=0;i<vs.length;i++){
    			kv = vs[i].split("=");
    			o[kv[0]] = kv[1];
    		}
    		data = o;
    	}
    	var f = $("GtableFromDiv");
    	if(f == null){
    		f = document.createElement("div");
    		f.id = "GtableFormDiv";
    		f.style.display = "none";
    		f.innerHTML = '<form action="" method="post"></form>';
    		document.body.appendChild(f);
    	}
    	f = f.children[0];
    	f.setAttribute("action",action);
    	var html = '';
    	for(var k in data){
    		html += '<input name="'+k+'" value="'+data[k]+'">';
    	}
    	html += '</div>';
    	f.innerHTML = html;
    	f.submit();
    };
    
	this.copyObj = function( obj ){
		var temp = {};
		for(var key in obj){
			temp[key] = obj[key];
		}
		return temp;
	};
	this.gexport = function( id, title, pageSize, sheetSize, zipSize, minJvm ){
		var div = $(id+"_gsql");
		var colTexts = div.getAttribute("gcolheadtext");
		var names = div.getAttribute("gcolname");
		var sizeObj = $(id+"_stotalRecords");
		var size = 1;	
		if(sizeObj){
			size = sizeObj.innerHTML*1;
			if(size && size > 20000){
				Gwin.progress("<font color='red' size=2>数据较多,请不要刷新界面,正在导出...</font>",1800,document);
			}else{
				Gwin.progress("<font color='#66FF00' size=2>正在导出数据...</font>",1800,document);
			}
		}else{
			Gwin.progress("<font color='#66FF00' size=2>正在导出数据...</font>",1800,document);
		}
		title = title ? title : "数据报表";	//标题
		zipSize = zipSize ? zipSize : 10;	//压缩标准是多少MB
		pageSize = pageSize ? pageSize : 3000;		//每批处理行	
		sheetSize = sheetSize ? sheetSize : 60000;	//每页多少行
		minJvm = minJvm ? minJvm : 20;			//JVM大于多少才可以执行
		var requestURL = document.URL.replaceAll("&isAll=0","");
		this.ajax({
			url : requestURL,
			data: {ajaxid:id,isExport:true,zipSize:zipSize,minJvm:minJvm,exportTitle:title,colTexts:colTexts,names:names,pageSize:pageSize,sheetSize:sheetSize},
			type: 'post',
			successFun : function( data ){
				var winid = "gexport_gtable_"+id;
				var obj = Gtable.stringToJson(data.substring(data.indexOf("EXPORTGTABLES")+13,data.indexOf("EXPORTGTABLEE")));
				if(!obj)obj={msg:"导出数据发生错误",type:"NO"};
				if(obj.type == "YES"){
					var vs = obj.msg.split("/");
					var nbsp = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
					var html = '文件名称: <a href="'+obj.msg+'" target="_blank" title="点击重新下载">'+vs[vs.length - 1]+'</a><br>'
					+nbsp+(Gtable.isIE ? nbsp+"&nbsp;&nbsp;":"")+'导出数据: '+obj.size+' 条<br>'
					+nbsp+(Gtable.isIE ? nbsp+"&nbsp;&nbsp;":"")+'总共耗时: '+obj.time+' 秒';
					Gwin.alert("导出成功",html,"Y",document);
					var iframe = $("exportGtableIfrmae");
					if(iframe){
						iframe.style.display = "";
						iframe.src = obj.msg;
					}else{
						var iframe = document.createElement("iframe");
						iframe.id = "exportGtableIfrmae";
						iframe.style.width = iframe.style.height = 1;
						iframe.setAttribute("frameborder",0);
						iframe.src = obj.msg;
						iframe.setAttribute("onload","this.style.display='none';")
						document.body.appendChild(iframe);
					}
				}else{
					Gwin.alert("导出错误",obj.msg,"X",document);
				}
				Gwin.close("progress_id");
			},
			failureFun : function( state ){
				Gwin.close("progress_id");
				Gwin.alert("请求错误","发出请求失败!错误代码:"+state,"!",document);
			}
		});
		return true;
	};
	this.getURLHTML = function(url){
		this.ajax({url:url,type:'get',successFun:function(data){
			alert(data);
		},failureFun:function(state){
			alert(state);
		}});
	};
	this.ajax = function( obj ){
		obj.cache = obj.cache ? obj.cache : true;
		var xmlHttp = Gtable.createXmlHttp(),c = obj.url.indexOf("?") === -1 ? '?' : '&';
		obj.url += c + (obj.cache ? "cache=true" : "cache="+new Date().getTime());
		if(obj.data){
			var data = "";
			for(var name in obj.data){
				data += "&"+name+"="+ obj.data[name];
			}
			obj.data = data.substring(1,data.length);
		}
		if(obj.type === "post"){
			xmlHttp.open("post", obj.url, true);
			xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		}else{
			xmlHttp.open("get", obj.url, true);
		}
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
				if( obj.successFun && typeof obj.successFun === 'function' ){
					obj.successFun( xmlHttp.responseText );
				}
			}else{
				if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
					if( obj.failureFun && typeof obj.failureFun === 'function' ){
						obj.failureFun( xmlHttp.readyState );
					}
				}
			}
		};
		if(obj.type === "post"){
			xmlHttp.send(encodeURI(obj.data));
		}else{
			xmlHttp.send(null);
		}
	};
	this.updateSum = function( obj ){	//编辑input时候动态更新合计和小计值
		var ids = obj.id.split("_"),obj1,obj2,obj3,sum,n,m;
		m = obj.parentNode.getAttribute("value");
		if(obj.value == m)return;
		if(isNaN(obj.value)){
			obj.value = m;
			return;
		}
		if(m+"".length > 0)m *= 1;else m = 0;
		obj.parentNode.setAttribute("value",obj.value);
		if(obj.id.indexOf("_G_")!=-1){//交叉列的
			obj1 = $(ids[0]+"___GCRSSMY_"+ids[ids.length-1]);
			obj2 = $(ids[0]+"_"+ids[1]+"_"+ids[2]+"_summary");
			obj3 = $(ids[0]+"___GCRSSMY_summary");
			if(obj1){
				Gtable.setSumValue(obj1,obj3,obj1.getAttribute("value"),obj.value,m);
			}
			if(obj2){
				Gtable.setSumValue(obj2,null,obj2.innerHTML,obj.value,m);
			}
		}else{	//普通表格的
			obj1 = $(ids[0]+"_"+ids[1]+"_summary");
			if(obj1){
				Gtable.setSumValue(obj1,null,obj1.innerHTML,obj.value,m);
			}
		}
	};
	this.setSumValue = function( obj, sumObj, sum, n, m ){	//设置合计小计值,obj合计或小计对象,sum是当前合计值,n修改值,m原先值
		sum = (sum+"").length > 0 ? sum*1 : 0;
		var tempSum = sum;
		n = (n+"").length > 0 ? n*1 : 0;
		if(n == m){	//修改值 大于 原来值
			return
		}else{	//没修改
			n -= m;
		}
		sum += n;
		obj.setAttribute("value",sum);
		obj.innerHTML = sum;
		if(sumObj != null){
			obj.parentNode.setAttribute("value",sum);
			if(tempSum != sum){
				var ss = sumObj.innerHTML;
				ss = ss.length > 0 ? ss*1 : 0;
				sum -= tempSum;
				ss += sum;
				sumObj.setAttribute("value",ss);
				sumObj.innerHTML = ss;
			}
		}
	};
	//当gtable是编辑时候,提供上下左右跳转
	this.inputKey = function(gtableid){
		var div = $(gtableid+"_columnList");
		if(div == null){
			setTimeout("Gtable.inputKey('"+gtableid+"')",500);
			return;
		}
		if(div.innerHTML.indexOf("update:\"edit\"") != -1){
			var tds = $(gtableid+"_table").rows[1].cells;
			var list = [],id = "",vs;
			for(var i=0;i<tds.length;i++){
				if(tds[i].getAttribute("type") == "INPUT" && tds[i].style.display != "none"){
					vs = tds[i].id.split("_");
					id = vs[0]+"_"+vs[1];
					if(vs.length > 4){
						id += "_"+vs[2];
					}
					list.push(id);
				}
			}
			if(Gtable.editCells != null){
				Gtable.editCells[gtableid] = list;
			}else{
				Gtable.editCells = {};
				Gtable.editCells[gtableid] = list;
			}
			document.onkeydown = function(e){
				e = e || event;
				var code = 0,obj = e.target || e.srcElement,td;
				if(obj.tagName != "INPUT"){
					return;
				}
				td = obj.parentNode.parentNode;
				if(td && td.tagName != "TD"){
					return;
				}
				if(window.event){
					code = window.event.keyCode;
				}else 
				if(e.which){
					code = e.which;
				}
				var vs = td.id.split("_");
				var id = vs[0]+"_"+vs[1];
				if(vs.length > 4){
					id += "_"+vs[2];
				}
				if(code == 37){//左
					var input = null;
					var list = Gtable.editCells[vs[0]];
					for(var i=0;i<list.length;i++){
						if(list[i] == id){
							if(i > 0){
								id = list[i-1];
								if(id.split("_").length == 2){
									input = $(id+"_"+vs[2]);
								}else{
									input = $(id+"_"+vs[3]);
								}
								break;
							}
						}
					}
					if(input != null){
						input.onfocus();
					}
				}else
				if(code == 39){//右
					var input = null;
					var list = Gtable.editCells[vs[0]];
					for(var i=0;i<list.length;i++){
						if(list[i] == id){
							if(i < list.length - 1){
								id = list[i+1];
								if(id.split("_").length == 2){
									input = $(id+"_"+vs[2]);
								}else{
									input = $(id+"_"+vs[3]);
								}
							}
							break;
						}
					}
					if(input != null){
						input.onfocus();
					}
				}else
				if(code == 38){	//上
					var vs = td.id.split("_");
					if(vs.length == 4){
						td = $(vs[0]+"_"+vs[1]+"_"+(vs[2]*1 - 1));
					}else
					if(vs.length == 5){
						td = $(vs[0]+"_"+vs[1]+"_"+vs[2]+"_"+(vs[3]*1 - 1));
					}
					if(td){
						td.onfocus();
					}
				}else
				if(code == 40){	//下
					var vs = td.id.split("_");
					if(vs.length == 4){
						td = $(vs[0]+"_"+vs[1]+"_"+(vs[2]*1 + 1));
					}else
					if(vs.length == 5){
						td = $(vs[0]+"_"+vs[1]+"_"+vs[2]+"_"+(vs[3]*1 + 1));
					}
					if(td){
						td.onfocus();
					}
				}
		 	}
	 	}
	};
	this.decryption = function(str){
		var bl = str.length%2 == 1;
		var ei = str.length/2+(bl ? 1 : 0);
		var ss = str.substring(0,ei),es = str.substring(ei,str.length);
		var sb = "";
		var si = ss.length;
		ei = es.length;
		while(si >= 0 || ei >= 0){
			if(--si >= 0){
				sb += ss.charAt(si);
			}
			if(--ei >= 0){
				sb += es.charAt(ei);
			}
		}
		var index,lg = sb.length;
		var msg = "";		
		var mm = "D5E3aCbXcLMd2AeWNBfgOhiP4jQkRlSmFTnUVop6YqrGstuZ0vw7H1xI8yJzK9";	
		var mw = "aAEb9cdeCxfghDi1FjBkGlmHI5nop6JKLuvqrys2tMNOP07QRS8TU4wVWXzY3Z";	
		for(var i=0;i<lg;i++){
			index = mm.indexOf(sb.charAt(i));
			if(index != -1){
				msg += mw.charAt(index);
			}else{
				msg += sb.charAt(i);
			}
		}
		return msg;
	};
	//冻结列
	this.Gfreeze = function(gtableid){
		var gtableobj = $(gtableid);
		var freezerow = gtableobj.getAttribute("freezerow");
        var freezecol = gtableobj.getAttribute("freezecol");//多列用分号隔开        
        if(freezecol && freezecol.length == 0){
        	return;
        }else
        if(!freezecol){
			return;
        }
		var h = gtableobj.offsetHeight;
		div = document.createElement("div");
		div.id = "Main_"+gtableid;
		div.style.width = "100%";
		div.style.overflow = "auto";
		var ph = gtableobj.parentNode.offsetHeight;
		if(ph < 10){
			ph = 400;
		}
		if(ph < 100) ph = h;
		div.style.height = h > ph ? ph-4 : h;
		gtableobj.parentNode.appendChild(div);
		div.appendChild(gtableobj);		
		if(window.GfreezeloadFun){
			GfreezeloadFun(div);
		}
        var gtab = $(gtableid + "_table");
        Gtable.moveData = [];	//当改变列宽度时候会更新[1]值
        Gtable.moveData[0] = this.gtableLockRow(gtab,freezerow);
        Gtable.moveData[1] = this.gtableLockCol(gtab,freezecol);
        var left = div.scrollLeft;
        this.GfreezeIndex[gtableid] = {index:3,isChange:false};
        div.onscroll = function(){
        	(function(that){
        		var td,tl,ts;
        		var index = ++Gtable.GfreezeIndex[gtableid].index;
        		if(that.scrollLeft != left && Gtable.moveData[1].length > 0){
		        	for(var i=0;i<Gtable.moveData[1].length;i++){
		        		ts = 0;
		        		for(var j=0;j<Gtable.moveData[1][i].length;j++){
		        			td = Gtable.moveData[1][i][j];
			        		tl = td.getAttribute("tempLeft")*1;
			        		td.style.zIndex = index;
			        		if(tl < that.scrollLeft){
			        			td.style.left = that.scrollLeft - tl;
			        		}else{
			        			td.style.left = 0;
			        		}
		        		}
		        	}
		        	left = that.scrollLeft;
		        	if(Gtable.GfreezeIndex[gtableid].isChange){
		        		index++;
		        		var id;
		        		for(var i=0;i<Gtable.moveData[0][0].length;i++){
		        			td = Gtable.moveData[0][0][i];
		        			id = td.id.split("_")[1];
							if(id.length > 0 && freezecol.indexOf(id)!=-1){
								td.style.zIndex = index+1;				
							}else{
								td.style.zIndex = index;
							}
		        			td.style.top = that.scrollTop-1;
			        	}
		        	}
	        	}else{
	        		var id;
	        		for(var i=0;i<Gtable.moveData[0][0].length;i++){
	        			td = Gtable.moveData[0][0][i];
	        			id = td.id.split("_")[1];
	        			if(id.length > 0 && freezecol.indexOf(id)!=-1){
							td.style.zIndex = index+1;				
						}else{
							td.style.zIndex = index;
						}
	        			td.style.top = that.scrollTop-1;
		        	}
		        	Gtable.GfreezeIndex[gtableid].isChange = that.scrollTop > 1;
	        	}
        	})(this);
        }
	};
	
	this.gtableLockRow = function( tab, freezerow ){ //暂且只支持头部冻结
		var id = tab.id.split("_")[0];
		var tr = tab.rows[0];
		var top = $(id).scrollTop;
		var list = [],td;
		list[0] = [];
		for(var j=0;j<tr.cells.length;j++){
			td = tr.cells[j];
			td.style.position = "relative";
			td.style.top = top;
			td.style.zIndex = 1;
			td.className = "default_head";
			list[0].push(td);
		}
		return list;
	};
	this.gtableLockCol = function( tab, freezecol ){
		var trs = tab.rows,rowsize=trs.length-1,colsize =  trs[0].cells.length,td;
		var left = $(tab.id.split("_")[0]).scrollLeft;
		var list = [],id,w,uw,gw;
		for(var i=0;i<rowsize;i++){
			if(trs[i].id.length == 0 || trs[i].id.indexOf("_summary_tr") != -1 || trs[i].id.indexOf("_foot_") != -1)break;
			list[i] = [];
			w = uw = gw = 0;
			for(var j=0;j<colsize;j++){
				td = trs[i].cells[j];
				id = td.id.split("_")[1];
				if(id.length > 0 && freezecol.indexOf(id)!=-1){
					td.style.position = "relative";
					td.style.left = left;
					td.style.zIndex = 2;
					td.style.backgroundColor = "#DDEBF2";
					w = td.offsetLeft;	//当前列的距离左边位置
					if(uw == 0){
						uw = w;		//第一次就直接设置
						gw = 0;
					}else{
						w = w - (w - uw) + gw;		//当前列位置 减去 (当前列位置 减去 上次列的位置) + 中间隔着的列
					}
					td.setAttribute("tempLeft",w);
					list[i].push(td);
				}else{
					gw += td.offsetWidth+1;	//中间隔开的列
				}
			}
		}
		return list;
	};
	
	//************************* start Resize *************************
	this.startResize = function (gtableid, obj, evt) {
		var e = evt;
		if (this.resizebegin) {
			if (this.isIE) {
				obj.setCapture();
			} else {
				e.preventDefault();
				document.addEventListener("mouseup", Gtable.stopResize, true);
				document.addEventListener("mousemove", Gtable.Resizing, true);
			}
			this.x = e.screenX;//clientX; 
			this.objw = parseInt(obj.childNodes[0].style.width);
			this.showline(gtableid, true);
			this.resizeable = true;
			this.GtableID = gtableid;
			this.changeTD = obj;
		}
	};
	//************************* start Resize *************************
	
	//************************* stop Resize & resize the table *************************
	this.stopResize = function (gtableid, obj, evt) {
		var e = evt;
		if(typeof gtableid != "string"){
			e = gtableid || window.event;
			gtableid = Gtable.GtableID;
			obj = Gtable.changeTD;
		}
		if (Gtable.resizeable) {
			if (Gtable.isIE) {
				obj.releaseCapture();
			} else {
				gtableid = Gtable.GtableID;
				document.removeEventListener("mouseup", Gtable.stopResize, true);
				document.removeEventListener("mousemove", Gtable.Resizing, true);
			}
			var i = 0;
			var span = $(Gtable.spanid);

			// set td width
			// if width less than 10 pixls,then width equal 10
			Gtable.newwidth = Math.max(10, Gtable.newwidth);
			if (typeof (span) == "object" && span != null) {
				span.style.width = Gtable.newwidth;
			}
			
			// before change table's td width ,save the table's old width			
			var tablewidth = parseInt($(gtableid).style.width);

			// set span and span's child width
			var spanpre = Gtable.spanid.substring(0, Gtable.spanid.indexOf("0_td"));
			var diffwidth = 0;
			span = $(spanpre + i + "_s");
			while (typeof (span) == "object" && span != null) {
			 	// use parseInt function get width value with no 'px' end
				diffwidth = parseInt(Gtable.newwidth) - parseInt(span.style.width);
				// set span's width		
				span.style.width = Gtable.newwidth;
				// set span's child node width (only one node) (i must lager than 1)
				if (i > 0) {
					span.childNodes[0].style.width = Gtable.newwidth;
				}
				i = i + 1;
				span = $(spanpre + i + "_s");
			}
			
			//summary column
			span = $(spanpre + "summary");
			if (typeof (span) == "object" && span != null) {
				// use parseInt function get width value with no 'px' end
				diffwidth = parseInt(Gtable.newwidth) - parseInt(span.style.width);		
				// set span's width		
				span.style.width = Gtable.newwidth;
			}
			
			//comupter new width
			tablewidth = tablewidth + diffwidth;
			// risize finish,hide line and set flag 
			Gtable.resizeable = false;
			var div = $(gtableid);
			div.style.width = tablewidth;
			var tab = $(gtableid + "_table");
			tab.style.width = tablewidth;
			Gtable.showline(gtableid, false);
			if(Gtable.moveData && Gtable.moveData.length == 2){	//有冻结列,要更新值
       			 (function(div,tab){
       			 	 var freezecol = div.getAttribute("freezecol");//多列用分号隔开   
       			 	 Gtable.moveData[1] = Gtable.gtableLockCol(tab,freezecol);
       			 })(div,tab);
			}
		}
	};
	//************************* stop Resize *************************
	
	//************************* Resizing(just moveline move)  *************************
	this.Resizing = function (gtableid, obj, evt) {
		var e = evt ? evt : window.event;
		if(typeof gtableid != "string"){
			e = gtableid || window.event;
			gtableid = Gtable.GtableID;
			obj = e.target || e.srcElement;
		}
		Gtable.checkedge(obj);
		if (Gtable.resizeable) {
			Gtable.newwidth = Gtable.objw + e.screenX - Gtable.x;
			Gtable.spanid = Gtable.isIE ? obj.id : Gtable.changeTD.id;
			var divlive = $(gtableid + "_line");
			divlive.style.left = window.event.clientX + window.document.body.scrollLeft;
			window.document.body.style.cursor = "e-resize";
		}
	};
	//************************* Resizing *************************
	
	//************************* showline *************************
	this.showline = function (gtableid, visibled) {
		var divlive = $(gtableid + "_line");
		if (visibled) {
			divlive.style.left = window.event.clientX + window.document.body.scrollLeft;
			var pd = divlive.parentNode;
			if(pd.parentNode && pd.parentNode.id == "Main_"+gtableid){
				pd = divlive.parentNode.parentNode;
			}
			divlive.style.height = pd.offsetHeight - 2;
			if(Gtable.GfreezeIndex[gtableid]){
				divlive.style.zIndex = Gtable.GfreezeIndex[gtableid].index+10;
			}
			divlive.style.display = "";
		} else {
			divlive.style.display = "none";
		}
	};
	//************************* showline *************************
	
	//************************* calculateOffset *************************
	this.calculateOffset = function (item, offsetName) {
		var s;
		var totalOffset = 0;
		do {
			s = "item.offset" + offsetName;
			totalOffset += eval(s);
			item = item.offsetParent;
		} while (item != null);
		return totalOffset;
	}; 
	//************************* calculateOffset *************************
	
	//************************* checkedge *************************
	this.checkedge = function (obj) {
		var e = window.event || arguments.callee.caller.arguments[0];
		var mousex =e.clientX + window.document.body.scrollLeft;
		var calx = Gtable.calculateOffset(obj, "Left") + obj.offsetWidth;
		if (mousex > calx - 3 && mousex < calx + 3) {
			Gtable.resizebegin = true;
			window.document.body.style.cursor = "e-resize";
		} else {
			Gtable.resizebegin = false;
			window.document.body.style.cursor = "default";
		}
	};
	//************************* checkedge *************************

	//************************* get SQL info *************************
	this.getSQL = function (gtable) {
		var divobj = typeof (gtable) == "string" ? $(gtable) : gtable;
		var gsobj = $(divobj.id + "_gsql");
		var sql = gsobj.getAttribute("GSQL");
		if(sql.indexOf("select") != -1 || sql.indexOf("SELECT") != -1 || sql.indexOf("from")!=-1 || sql.indexOf("where") != -1){
			return sql;
		}else{
			return Gtable.decryption(sql);
		}
	}; 
	//************************* get SQL info *************************

	//************************* get COLDATATYPE info *************************
	this.getCOLDATATYPE = function (gtable) {
		var divobj = typeof (gtable) == "string" ? $(gtable) : gtable;
		var gsobj = $(divobj.id + "_gsql");
		
		return gsobj.getAttribute("GCOLDATATYPE");
	}; 
	//************************* get COLDATATYPE info *************************
	
	//************************* get COLHEADTEXT info *************************
	this.getCOLHEADTEXT = function (gtable) {
		var divobj = typeof (gtable) == "string" ? $(gtable) : gtable;
		var gsobj = $(divobj.id + "_gsql");
		
		return gsobj.getAttribute("GCOLHEADTEXT");
	}; 
	//************************* get COLHEADTEXT info *************************
	
	//************************* get COLNAME info *************************
	this.getCOLNAME = function (gtable) {
		var divobj = typeof (gtable) == "string" ? $(gtable) : gtable;
		var gsobj = $(divobj.id + "_gsql");
		
		return gsobj.getAttribute("GCOLNAME");
	}; 
	//************************* get COLNAME info *************************
	
//Programs Programs Programs
	//************************* get Updateinfo info *************************
	this.getUpdateinfo = function (gtable) {
		var divobj = typeof (gtable) == "string" ? $(gtable) : gtable;
		var records = $(divobj.id + "_records").value;
		var trobj = $(divobj.id + "_g@r0");
		
		var tdarr = trobj.getElementsByTagName("td")
		
		var sjson = "";
		var sfiled = "";
		
		//取得要更新列的值
		for (var i = 0;i < tdarr.length;i++){
			//typeof(tdarr[i].update) != "undefined" 
			if (typeof(tdarr[i].getAttribute('update')) != "undefined" && tdarr[i].getAttribute('update') == "edit"){
				
				var sret = "";
				var itemvalue = "";

				var obj = null;
				
				//只有表头有colname属性				
				var colname = tdarr[i].getAttribute('colname');
				var coldatatype = tdarr[i].getAttribute('coldatatype');
				
				//更新字段列
				sfiled = sfiled + "" + colname + ",";
				
				for (var j = 1; j <= records; j++) {
					obj = $(divobj.id + "_" + colname + "_" + j);
					
					if (obj == null) {
						//获取主键列数据，主要是checkbox列，临时处理方式:如果没有值，则再向上一层的SPAN取
						obj = $(divobj.id + "_" + colname + "_" + j + "_s");
						if (obj == null) {
							alert("no exists column name:" + colname);
							sret = "";
							//break;
						} else {
							if (coldatatype == "number"){		//数字类型时才替换
								itemvalue = obj.getAttribute('value').replace(/,/g,"");
							} else {
								itemvalue = obj.getAttribute('value');
							}
							sret = sret + "\"" + itemvalue + "\",";
						}
					} else {
						var v = null;
						if(obj.tagName == "INPUT"){
							v = obj.value;
						}else{
							v = obj.getAttribute("value");
						}
						if (coldatatype == "number"){			//数字类型时才替换
							itemvalue = v.replace(/,/g,"");
						} else {
							itemvalue = v;
						}
						sret = sret + "\"" + itemvalue + "\",";
					}
				}
				sjson = sjson + "\"" + colname + "\":[" + sret.substring(0, sret.length - 1) + "],";
			}
		}
		
		//取得主键列的值
		var pkey = divobj.getAttribute('tablepk').split(",");
		
		for (var i = 0;i < pkey.length;i++){
			sret = "";
			for (var j = 1; j <= records; j++) {
				//获取主键列数据
				obj = $(divobj.getAttribute('id') + "_" + pkey[i] + "_" + j);
				
				if (obj == null) {
					//获取主键列数据，主要是checkbox列，临时处理方式:如果没有值，则再向上一层的SPAN取
					obj = $(divobj.getAttribute('id') + "_" + pkey[i] + "_" + j + "_s");
					if (obj == null) {
						alert("no exists column name");
						sret = "";
						//break;
					} else {
						itemvalue = obj.getAttribute('value');
						sret = sret + "\"" + itemvalue + "\",";
					}
				} else {
					itemvalue = obj.getAttribute('value');
					sret = sret + "\"" + itemvalue + "\",";
				}
			}
			sjson = sjson + "\"" + pkey[i] + "\":[" + sret.substring(0, sret.length - 1) + "],";
		}
		
		sfiled = sfiled.substring(0, sfiled.length - 1)
		sfiled = "\"fields\":\"" + sfiled + "\"";
				
		sjson = sjson.substring(0, sjson.length - 1);

		//js json ,for evel
		//sjson = "(\{" + "\"table\":\"" + divobj.table + "\",\"tablepk\":\"" + divobj.tablepk + "\"," + sfiled + "," + sjson + "\})";
		//myjson = eval(sjson);
				
		
		//java json
		sjson = "\{" + "\"table\":\"" + divobj.getAttribute('table') + "\",\"tablepk\":\"" + divobj.getAttribute('tablepk') + "\","
			+ "\"records\":\"" + records + "\"," + sfiled + "," + sjson + "\}";
		
		return sjson;
	}; 
	//************************* get Updateinfo info *************************
	
	
	//************************* selcheckbox *************************
	this.selcheckbox = function selcheckbox(gtableid) {
		var myReg = /checkbox([0-9]+)/;
		var divobj = typeof (gtableid) == "string" ? $(gtableid) : gtableid;
		var cvalue = false;
		var inputobj = divobj.getElementsByTagName("input");
		for (var i = 0; i < inputobj.length; i++) {
			if (inputobj[i].id == "checkboxall") {
				if (inputobj[i].checked) {
					cvalue = true;
				}
			} else {
				if (myReg.test(inputobj[i].id)) {
					inputobj[i].checked = cvalue;
				}
			}
		}
	}; 
	//************************* selcheckbox *************************

	//************************* getselectid *************************
	this.getselectid = function (gtable) {
		var myReg = /checkbox([0-9]+)/;
		var sret = "";
		var divobj = typeof (gtable) == "string" ? $(gtable) : gtable;
		var inputobj = divobj.getElementsByTagName("input");
		for (var i = 0; i < inputobj.length; i++) {
			if (myReg.test(inputobj[i].id)) {
				if (inputobj[i].checked) {
					sret = sret + inputobj[i].value + ",";
				}
			}
		}
		return sret.substring(0, sret.length - 1);
	}; 
	//************************* getselectid *************************

	//************************* get column values *************************
	this.getcolvalues = function (gtable, colname) {
		if (colname != "CHECKID") {
			var sret = "";
			var itemvalue = "";
			var divobj = typeof (gtable) == "string" ? $(gtable) : gtable;
			var records = $(divobj.id + "_records").value;
			var obj = null;
			for (var i = 1; i <= records; i++) {
				obj = $(divobj.id + "_" + colname + "_" + i);
				if (obj == null) {
					alert("no exists column name");
					sret = "";
					break;
				} else {
					if(obj.tagName == "INPUT"){
						itemvalue = obj.value;
					}else{
						itemvalue = obj.getAttribute("value");
					}
					sret = sret + itemvalue + "#@#";
				}
			}
			sret = sret.substring(0, sret.length - 3);
		} else {
			var myReg = /checkbox([0-9]+)/;
			var sret = "";
			var divobj = typeof (gtable) == "string" ? $(gtable) : gtable;
			var inputobj = divobj.getElementsByTagName("input");
			for (var i = 0; i < inputobj.length; i++) {
				if (myReg.test(inputobj[i].id)) {
					sret = sret + inputobj[i].value + ",";
				}
			}
			sret = sret.substring(0, sret.length - 1);
		}
		return sret;
	}; 
	//************************* get column values *************************
	
	//************************* get single column value *************************
	this.getsinglevalue = function (gtable, colname, row) {
		if (colname != "CHECKID") {
			var sret = "";
			var itemvalue = "";
			var divobj = typeof (gtable) == "string" ? $(gtable) : gtable;
			//var inputobj = divobj.getElementsByTagName('input');		
			var obj = null;
			obj = $(divobj.id + "_" + colname + "_" + row );
			if (obj == null) {
				alert("no exists column name");
				sret = "";
			} else {
				sret = obj.getAttribute("value");
			}
		} else {
			sret = "no support yet";
		}
		return sret;
	}; 
	//************************* get single column value *************************
	
	//************************* set single column value *************************
	this.setsinglevalue = function (gtable, colname, row, value) {
		if (colname != "CHECKID") {
			var sret = "";
			var itemvalue = "";
			var divobj = $(gtable);
			var obj = null;
			obj = $(divobj.id + "_" + colname + "_" + row);
			if (obj == null) {
				alert("no exists column name");
			} else {
				if (obj.tagName == "INPUT") {
					obj.value = value;
				} else {
					if (obj.tagName == "SPAN") {
						obj.innerHTML = value;
					}
				}
			}
		} else {
			sret = "no support yet";
		}
		return "";
	}; 
	//************************* set single column value *************************
	
	//************************* getselcolvalues *************************
	this.getselcolvalues = function (gtable, colname) {
		var myReg = /checkbox([0-9]+)/;
		var sret = "";
		var divobj = $(gtable);
		var inputobj = divobj.getElementsByTagName("input");
		for (var i = 0; i < inputobj.length; i++) {
			if (myReg.test(inputobj[i].id)) {
				if (inputobj[i].checked) {
					var obj = null;
					var rowid=null;
					if(inputobj[i].rowid!=null) {
					rowid = inputobj[i].rowid;
					}
					else {
						rowid = inputobj[i].attributes['rowid'].nodeValue;
					}

					obj = $(divobj.id + "_" + colname + "_" + rowid);
					if (obj == null) {
						alert("no exists column name");
						sret = "";
						break;
					} else {
						itemvalue = obj.getAttribute("value");
						sret = sret + itemvalue + "#@#";
					}
				}
			}
		}
		//alert(sret);
		return sret.substring(0, sret.length - 3);
	}; 
	//************************* getselcolvalues *************************
	
	this.removeMoveSelect = function( id ){	//去除拖动选取功能
		var obj = $(id);
		if(obj){
			obj.setAttribute("stopMoveSelect","true");
		}
	}
	
	//************************* rowover *************************
	this.rowover = function (gtableid, obj,row,e) {
		//id gtable
		//ie浏览器兼容
		var divobj = $(gtableid);
		obj.className = divobj.getAttribute("myclass")+"_over";
		if(Gtable.isMoveSelect && divobj.getAttribute("stopMoveSelect") == null){
			var cb = $(gtableid+"_checkbox"+row);
			if(cb){
				cb.checked = Gtable.isSelectYvalue < e.clientY ? true : false;
				if(cb.checked){
					obj.style.backgroundColor = Gtable.selectBgColor;
				}else{
					obj.style.backgroundColor = "";
				}
				Gtable.isSelectYvalue = e.clientY;
			}
		}
	}; 
	//************************* rowover *************************
	
	//************************* rowout *************************
	this.rowout = function (gtableid, obj) {
		obj.className = obj.getAttribute("oldclass");
	}; 
	//************************* rowout *************************
	
	//************************* rowsel *************************
	this.rowsel = function (gtableid, checkobj, trid) {
		var divobj = $(gtableid);
		var trobj = $(trid);
		if (trobj != null) {
			if (checkobj.checked) {
				trobj.className = divobj.getAttribute("myclass")+"_sel";
				trobj.setAttribute("oldclass",divobj.getAttribute("myclass")+"_sel");
			} else {
				trobj.className = divobj.getAttribute("myclass")+"_body";
				trobj.setAttribute("oldclass",divobj.getAttribute("myclass")+"_body");
			}
		}
	}; 
	//************************* rowsel *************************
	
	//************************* onRowclick *************************
	this.onclick = function (gtableid, trobj) {
		var divobj = $(gtableid);
		var myReg = /checkbox([0-9]+)/;
		var e = window.event || arguments.callee.caller.arguments[0];
		var _element = e.srcElement ? e.srcElement : e.target;
		with (e) {
			if (!myReg.test(_element.id)) {
				var divobj = typeof (gtableid) == "string" ? $(gtableid) : gtableid;
				var inputobj = divobj.getElementsByTagName("input");
				var pre = gtableid + "_g@r";
				var rowid = trobj.id.substring(pre.length, trobj.id.length);
				for (var i = 0; i < inputobj.length; i++) {
					if (myReg.test(inputobj[i].id)) {
						if (inputobj[i].id == gtableid+"_checkbox" + rowid) {
							inputobj[i].checked = true;
							inputobj[i].parentNode.parentNode.parentNode.style.backgroundColor = Gtable.selectBgColor;
						} else {
							inputobj[i].checked = false;
							inputobj[i].parentNode.parentNode.parentNode.style.backgroundColor = "";
						}
					}
				}
			}
		}
	};
	//************************* onRowclick *************************
	
//	//************************* onRowdblclick *************************
//	this.ondoubleclick = function (gtableid, obj) {
//		//alert('double click:' + obj.id);
//	};
//	//************************* onRowdblclick *************************
	
	//************************* Go Button Event *************************
	this.goClick = function (gtableid, goURL) {
		var url = "";
		var showpage = gtableid + "_showpage";
		var pagesize = gtableid + "_pagesize";
		if ($(showpage).value.length == 0 || $(pagesize).value.length == 0) {
			alert("请输入正确的页大小或页码!");
			return false;
		}
		
		var sp = $(showpage).value;
		var ps = $(pagesize).value;
		
		var reg =  /^[0-9]*[1-9][0-9]*$/;
				
		if ( !reg.test(sp) || !reg.test(ps)){
			alert("请输入正确的页大小或页码(01)!");
			return false;
		}
		//window.self.location.href = goURL;
		goURL = "?page=" + $(showpage).value + "&pagesize=" + $(pagesize).value + "&" + goURL;
		if(Gtable.isFilter){
			goURL += Gtable.getGroupFileds(gtableid);
		}
		if(Gtable.isIE) {
			window.name = "__self";
			window.open(goURL, "__self");
		} else{
			window.location.target= "_self";
			window.location.href = goURL;
		}
	}; 
	//************************* Go Button Event *************************
	
	//************************* create XmlHttp *************************
	this.createXmlHttp = function () {
		var xmlHttp = null;
		if (window.XMLHttpRequest) {
			xmlHttp = new XMLHttpRequest();                  //FireFox、Opera等浏览器支持的创建方式
		} else {
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");//IE浏览器支持的创建方式
		}
		return xmlHttp;
	};
    //************************* create XmlHttp *************************
    
	//************************* Go Button Event *************************
	this.refreshtable = function (gtableid) {
		var url = "";
		var sRet = "";
		var postdate = "a=1&b=22&a=333";
		var xmlHttp = this.createXmlHttp();                       //创建XmlHttpRequest对象   
		xmlHttp.onreadystatechange = function () {
			if (xmlHttp.readyState == 4) {
		        //调用addChildren函数生成子节点
				if (xmlHttp.status == 200) {
					sRet = xmlHttp.responseText;
				}
			}
		};
		xmlHttp.open("POST", "test.gs", false); 	//?time=" + new Date().getTime() 
		xmlHttp.setRequestHeader("content-length", postdate.length);//post提交设置项
		xmlHttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");//post提交设置项          
		xmlHttp.send(postdate);
		return sRet;
	}; 
	//************************* Go Button Event *************************
	
	//************************* get getGtableJSON *************************
	this.getGtableJSON = function (gtable) {
		var divobj = typeof (gtable) == "string" ? $(gtable) : gtable;
		var records = $(divobj.id + "_records").value;
		var trobj = $(divobj.id + "_g@r0");
		
		var tdarr = trobj.getElementsByTagName("td")
		
		var sjson = "";
		var sfiled = "";
		
		//取得要更新列的值
		for (var i = 0;i < tdarr.length;i++){
			var sret = "";
			var itemvalue = "";

			var obj = null;
			
			//只有表头有colname属性				
			var colname = tdarr[i].colname;
			var coldatatype = tdarr[i].coldatatype;
			
			//更新字段列
			sfiled = sfiled + "" + colname + ",";
			
			for (var j = 1; j <= records; j++) {
				obj = $(divobj.id + "_" + colname + "_" + j);
				
				if (obj == null) {
					//获取主键列数据，主要是checkbox列，临时处理方式:如果没有值，则再向上一层的SPAN取
					obj = $(divobj.id + "_" + colname + "_" + j + "_s");
					if (obj == null) {
						alert("no exists column name:" + colname);
						sret = "";
						//break;
					} else {
						if (coldatatype == "number"){		//数字类型时才替换
							itemvalue = obj.getAttribute("value").replace(/,/g,"");
						} else {
							itemvalue = obj.getAttribute("value");
						}
						sret = sret + "\"" + itemvalue + "\",";
					}
				} else {
					if ( coldatatype == "number"){			//数字类型时才替换
						itemvalue = obj.getAttribute("value").replace(/,/g,"");
					} else {
						itemvalue = obj.getAttribute("value");
					}
					sret = sret + "\"" + itemvalue + "\",";
				}
			}
			sjson = sjson + "\"" + colname + "\":[" + sret.substring(0, sret.length - 1) + "],";
		}
		
		sfiled = sfiled.substring(0, sfiled.length - 1)
		sfiled = "\"fields\":\"" + sfiled + "\"";
				
		sjson = sjson.substring(0, sjson.length - 1);

		//js json ,for evel
		//sjson = "(\{" + "\"table\":\"" + divobj.table + "\",\"tablepk\":\"" + divobj.tablepk + "\"," + sfiled + "," + sjson + "\})";
		//myjson = eval(sjson);

		//java json
		sjson = "\{" + "\"table\":\"" + divobj.table + "\",\"tablepk\":\"" + divobj.tablepk + "\","
			+ "\"records\":\"" + records + "\"," + sfiled + "," + sjson + "\}";
		
		return sjson;
	}; 
	//************************* get getGtableJSON *************************
};
Gtable.loadCopyJS(); //初始化复制组件
/***************************** Gtable 结束 *****************************/