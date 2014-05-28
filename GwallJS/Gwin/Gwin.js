var Gwin = {
	Path:'GwallJS/Gwin/icons/',
	winList:{},
	openPath:{},
	winCount:0,MoveObj:null,CLeft:0,CTop:0,isMoveOut:false,isIE:((!+ [ 1, ]) ? true : false),
	focusWin:null,
	/**
	 * 初始化数据
	 */
	init: function( config ){
		this.getIconPath( config );
		if(config.type === "progress"){	//进度条模式 : 	定位,锁屏,提醒文本,显示时间,超时函数,关闭函数.
			config.showbt = false;
			config.height = 32;
			config.wigth = 300;
			config.contextType = "HTML";			
			config.context = '<div id="progress_'+config.id+'"><b>'+config.progressMsg+'</b><img src="'+config.iconPath+'progress.gif" class="progressImg"></div>';
		}else
		if(config.type === "message"){	//消息框模式		消息标题,消息内容,消息图标,锁屏,按钮,按钮函数
			config.min = config.max = false;
			config.showbt = true;
			config.contextType = "HTML";
			var icon = config.icon;
			switch( icon ){
				case 'Y':{icon = "success";break;}
				case 'X':{icon = "error";break;}
				case '!':{icon = "confirm";break;}
				case '?':{icon = "prompt";break;}
				default: {break;}
			}			
			config.context = '<div id="message_'+config.id+'" class="message">'+			
			'<table align="center" width="90%"><tr><td align="right" width="12%"><img src="'+config.iconPath+icon+'.gif"/></td>'+
			'<td align="left" width="88%"><span class="msgText">'+config.context+'</span></td></tr></table></div>';
		}
		var dom = config.dom;	
		var iframeURL = dom.URL.split("?")[0],iframeC;
		for(var i=iframeURL.length-1;i>0;i--){
			iframeC = iframeURL.charAt(i);
			if(iframeC == '/' || iframeC == '\\'){
				iframeURL = iframeURL.substring(i+1,iframeURL.length);
				dom.iframeURL = iframeURL = iframeURL.split(".")[0]+iframeURL.split(".")[1];
				break;
			}
		}
		var left = config.left,top = config.top;
		if(left == 0 && top == 0 ){//自动定位到当前dom正中心
			top = (dom.body.clientHeight - config.height - 52)/2 + dom.body.scrollTop;
			if(top < 0) top = (dom.body.clientHeight - config.height)/2 + dom.body.scrollTop;
			left = (dom.body.offsetWidth - config.width - 52)/2 + dom.body.scrollLeft;
			if(left < 0) left = (dom.body.offsetWidth - config.width)/2 + dom.body.scrollLeft;
			if(config.type === "windows" && top > (config.height*2+26)+dom.body.scrollTop){
				top = 20 + dom.body.scrollTop;
			}
		}else{
			top += dom.body.scrollTop;
			left += dom.body.scrollLeft;
		}
		if(!dom.getElementById("win_background")){  //是否创建了锁屏
			this.openPath[iframeURL] = {path:""};	//只是用于记录要锁屏的
			div_background = dom.createElement("div");
			div_background.id = "win_background";
			div_background.className = "win_background";
			div_background.style.display = "none";
			div_background.style.background = config.background;
			div_background.style.width = dom.body.scrollWidth;
			div_background.style.height = dom.body.scrollHeight;	//如果所在界面中有滚动条,就的是包括滚动条的高度.不然不能遮住底部的信息.
			if(Gwin.isIE){
				if(dom.body.scroll.length == 0){
					div_background.style.height = dom.body.clientHeight;	//当没有滚动条时候就直接是客户端高度.
				}
			}
			dom.body.appendChild(div_background);
		}
		var wintemp = dom.getElementById("win_"+config.id);
		if(wintemp){
			if(!config.winState.max){
				config.top = wintemp.style.top = top;
				config.left = wintemp.style.left = left;
			}
			var loading = dom.getElementById("loading_"+config.id);
			if(loading){
				loading.style.display = "";
			}
			if(config.type === "windows")dom.getElementById("title_name_"+config.id).innerHTML = "<b>"+config.title+"</b>";
			return this;
		}
		config.left = left;
		config.top = top;
		if(config.type ==="windows" && !dom.getElementById("move_"+config.id)){	//非windows类型的不需要这个.
			var lg = dom.createElement("div");	//用于解决移动时候的鼠标脱落到iframe
			lg.id = "move_"+config.id;
			lg.style.width = config.width - Gwin.isIE ? 10 : 4;
			lg.style.height = config.height-35 > 0 ? config.height-35 : 2;	//不能挡住下面的改变的大小层.没有高度就会出错
			lg.style.left = config.left;
			lg.style.top = config.top+24;	//不能挡住标题栏,会将min,max,close事件失效.
			lg.className = "move_div";		//这个样式在style.css中主要设置z-index:999999;position:absolute;和透明度
			lg.style.display = "none";		//当不能使用鼠标跟踪函数时候用这个.
			config.dom.body.appendChild(lg);
		}
		var div_win = dom.createElement("div");
			div_win.id = "win_"+config.id;
			div_win.className = "Gwin_div_win";
			div_win.style.display = "none";
			div_win.style.top = top;
			div_win.style.left = left;
			div_win.style.width = config.width > config.minWidth ? config.width : config.minWidth;
			div_win.style.height = config.height > config.minHeight ? config.height : config.minHeight;
			div_win.onmousedown = function(){//传递div_win对象
				var obj = window.event ? (window.event.currentTarget ? window.event.cureentTarget : this) : this; //IE就是this
				Gwin.setZindex(obj); //设置层次,里面复杂
			};
		var moveStr = config.drag ? 'isMove=false onMousedown="Gwin.start(this,event)" onmousemove="Gwin.move(this,event)" onmouseout="Gwin.seout(this,event)" onmouseup="Gwin.stop(this)"' : '';
		var title = '<div id="title_'+config.id+'" class="div_title" '+moveStr+' ondblclick="Gwin.dblclick(\''+config.id+'\')">'+
			'<div class="Gwin_title">'+
				'<div class="title_left">'+
					'<img id="title_icon_'+config.id+'" src="'+config.titleIcon+'" class="title_icon"/>'+
					'<span id="title_name_'+config.id+'" class="title_name"><b>'+config.title+'</b></span>'+
				'</div>'+
				'<div class="title_right">';						
			var min = '<a href="javascript:void(0)" target="_self" title="最小化"><div id="min_'+config.id+'" onClick="Gwin.min(\''+config.id+'\')" onMouseOver="this.className=\'button_min\'" onMouseOut="this.className=\'button_min2\'" class="button_min2"></div></a>' +				
					'<a href="javascript:void(0)" target="_self" title="还原窗口"><div style="display:none" id="res_'+config.id+'" onClick="Gwin.res(\''+config.id+'\')" onMouseOver="this.className=\'button_res\'" onMouseOut="this.className=\'button_res2\'" class="button_res2"></div></a>' ;
			var max = '<a href="javascript:void(0)" target="_self" title="最大化"><div id="max_'+config.id+'" onClick="Gwin.max(\''+config.id+'\')" onMouseOver="this.className=\'button_max\'" onMouseOut="this.className=\'button_max2\'" class="button_max2"></div></a>' +
					'<a href="javascript:void(0)" target="_self" title="还原窗口"><div style="display:none" id="rese_'+config.id+'" onClick="Gwin.rese(\''+config.id+'\')" onMouseOver="this.className=\'button_rese\'" onMouseOut="this.className=\'button_rese2\'" class="button_rese2"></div></a>' ;
			var close = '<a href="javascript:void(0)" target="_self" title="关闭窗口"><div id="close_'+config.id+'" onClick="Gwin.close(\''+config.id+'\')" onMouseOver="this.className=\'button_close\'" onMouseOut="this.className=\'button_close2\'" class="button_close2"></div></a>';
			if(config.min){	//是否显示最小化按钮
				title += min;
			}
			if(config.max){ //是否显示最大化按钮
				title += max;
			}
			if(config.close){//是否显示关闭按钮
				title += close;
			}
			title += '</div></div></div>';
		var div_mct = dom.createElement("div");
			div_mct.id = "mct_"+config.id;
			div_mct.className = "div_mct_y";
		var div_menu = dom.createElement("div");
			div_menu.id = "menu_"+config.id;
			div_menu.className = "div_menu";
		//------------------------------------预留菜单栏----------------------------------------------
		var div_context = dom.createElement("div");	
			div_context.id = "context_"+config.id;
			div_context.className = "div_context";
			var html = '';
			if(config.contextType == "ID"){
				html += '<div style="padding-top:'+((config.height-50)/2)+'px;" class="loading" id="loading_'+config.id+'"><img src="'+config.iconPath+'loading.gif" class="loadingImg"><b>'+config.loadingmsg+'</b></div>';
			}else
			if(config.contextType == "URL"){
				html += '<div style="padding-top:'+((config.height-50)/2)+'px;" class="loading" id="loading_'+config.id+'"><img src="'+config.iconPath+'loading.gif" class="loadingImg"><b>'+config.loadingmsg+'</b></div>';
				html += '<iframe onload="Gwin.hideLoadingdiv(\''+config.id+'\',this);" id="iframe_'+config.id+'" scrolling="'+config.scrolling+'" frameborder="0" width="1" height="1"';
				if(config.autoLoad){//自动载入后显示内容.
					html += "src='"+config.context+"'";
				}else{//手动加载后,自己调用方法:setLoadok( id )方法开始显示内容.
					html += 'src="about:blank"';
				}
				html +="></iframe>";
			}else{
				html += config.context;
			}
		div_context.innerHTML = html;
		var div_button = dom.createElement("div");
			div_button.id = "button_"+config.id;
			div_button.className = "div_button";
			div_button.style.display = config.showbt ? 'block' : 'none';
			html = ''		
			if(config.buttons != null){ //有自定义按钮,就不要自带的按钮.
				var btn;
				for(var i=0;i<config.buttons.length;i++){
					btn = config.buttons[i];
					html += '<input type="button" class="buttons" value="'+btn.lable+'" onmouseover="this.className=\'button_over\'" onmouseout="this.className=\'button_out\'" onclick="Gwin.addClick(\''+config.id+'\','+i+')"/>';
				}	
			}else{
				html += '<input type="button" class="buttons" onmouseover="this.className=\'button_over\'" onmouseout="this.className=\'button_out\'" value="'+config.okLable+'" onclick="Gwin.ok(\''+config.id+'\')"/>'+
					'<input type="button" class="buttons" onmouseover="this.className=\'button_over\'" onmouseout="this.className=\'button_out\'" value="'+config.cancelLable+'" onclick="Gwin.cancel(\''+config.id+'\')"/>';
			}
		var h = config.height - 24;	//内容区域的高度
		if(config.showbt){ 
			h -= 24;
		}
		div_context.style.height = h;
		div_button.innerHTML = html;
		//div_mct.appendChild(div_menu);		//菜单层
		div_mct.appendChild(div_context);	//内容层
		if(config.type == "progress"){		//是进度条模式就更改样式
			div_win.className = "win_progress";
			div_context.className = "context_prs";
			div_mct.className = "progress";
		}else{		
			div_mct.appendChild(div_button);//按钮层
			var ttpp = "";
			if(config.resize){//resize根据这个值进行判断是否要加入改变大小控制//标题层 和 八个角控制大小层
				ttpp = " style='cursor:nw-resize;'";
			}
			title += '<div id="RS_L_U_'+config.id+'" class="LeftUp"'+ttpp+'></div>'
			+'<div id="RS_L_U1_'+config.id+'" class="LeftUp1"'+ttpp+'></div>'
			+'<div id="RS_L_U2_'+config.id+'" class="LeftUp2"'+ttpp+'></div>'
			+'<div id="RS_R_D_'+config.id+'" class="RightDown"'+ttpp+'></div>'
			+'<div id="RS_R_D1_'+config.id+'" class="RightDown1"'+ttpp+'></div>'
			+'<div id="RS_R_D2_'+config.id+'" class="RightDown2"'+ttpp+'></div>';
			if(config.resize){
				ttpp = " style='cursor:ne-resize;'";
			}
			title += '<div id="RS_L_D_'+config.id+'" class="LeftDown"'+ttpp+'></div>'
			+'<div id="RS_L_D1_'+config.id+'" class="LeftDown1"'+ttpp+'></div>'
			+'<div id="RS_L_D2_'+config.id+'" class="LeftDown2"'+ttpp+'></div>'
			+'<div id="RS_R_U_'+config.id+'" class="RightUp"'+ttpp+'></div>'
			+'<div id="RS_R_U1_'+config.id+'" class="RightUp1"'+ttpp+'></div>'
			+'<div id="RS_R_U2_'+config.id+'" class="RightUp2"'+ttpp+'></div>';
			if(config.resize){
				ttpp = " style='cursor:e-resize;'";
			}
			title += '<div id="RS_R_'+config.id+'" onmousedown="Gwin.startChangeSize(\''+config.id+'\',\'R\',event)" class="Right"'+ttpp+'></div>'
			+'<div id="RS_L_'+config.id+'" onmousedown="Gwin.startChangeSize(\''+config.id+'\',\'L\',event)" class="Left"'+ttpp+'></div>';
			if(config.resize){
				ttpp = " style='cursor:n-resize;'";
			}
			title += '<div id="RS_U_'+config.id+'" onmousedown="Gwin.startChangeSize(\''+config.id+'\',\'U\',event)" class="Up"'+ttpp+'></div>'
			+'<div id="RS_D_'+config.id+'" onmousedown="Gwin.startChangeSize(\''+config.id+'\',\'D\',event)" class="Down"'+ttpp+'></div>';	
			div_win.innerHTML += title;//不是进度条模式就加入标题栏
			div_context.style.overflow = "hidden";
			try{
				div_mct.style.border = (Gskin ? Gskin.skinObj.winBorder+" 2px solid" : "");
				div_mct.style.borderTop = (Gskin ? Gskin.skinObj.winBorder+" 1px solid" : "");
			}catch(e){
				div_mct.style.border = "#FF0FEC 2px solid";
				div_mct.style.borderTop = "#FF0FEC 1px solid";
			}
		}
		div_mct.style.height = config.showbt ? h+24 : h;
		div_win.appendChild(div_mct);		//除了标题层
		dom.body.appendChild(div_win);
		this.winList[config.id] = config;	
		this.setZindex( div_win );//当前层应该显示在最上面.  注意执行顺序,一定要放在this.winList[config.id] = config;下.
		if(config.init && typeof  config.init === 'function'){				
			config.init( div_win );//------------------------------------预留加载窗口完成后要执行的函数
		}
		return this;
	},
	/**
	 * 设置窗口的标题
	 */
	setTitle : function( winID, name ){
		var config = this.getWin( winID );
		if(config != null){
			var obj = config.dom.getElementById("title_name_"+config.id);
			if(obj){
				obj.innerHTML = "<b>"+name+"</b>";
				return true;
			}
		}
		return false;
	},
	/**
	 * 设置窗口的大小
	 * w || h === 0 就不设置
	 */
	setSize : function ( winID, w, h){
		var config = this.getWin( winID );
		if(config != null){
			var dom = config.dom;
			var winObj = dom.getElementById("win_"+config.id);
			var mct = dom.getElementById("mct_"+config.id);
			var cont = dom.getElementById("context_"+config.id);
			var iframe = dom.getElementById("iframe_"+config.id);
			if(w === 0 && h > 0){
				if(config.showbt){
					cont.style.height = h-22;
					mct.style.height = h;
					if(iframe){
						iframe.style.height = h - 24;
					}
					h+=24;
				}else{
					mct.style.height = cont.style.height = h; 
					if(iframe){
						iframe.style.height = h - 4;
					}
					h+=24;
				}
				config.height = winObj.style.height = h;
			}else 
			if(h === 0 && w > 0){
				winObj.style.width = w += 4;
				if(iframe){
					iframe.style.width = w - 10;
				}
				config.width = w;
			}else 
			if(w >0 && h > 0){
				if(config.showbt)h+=24;
				winObj.style.width = w += 4;
				winObj.style.height = h += 28;
				config.width = w;
				config.height = h;
				cont.style.height = h - 23 - (config.showbt ? 23 : 0);
				mct.style.height = h - 24;
				if(iframe){
					iframe.style.height = h - 25;
					iframe.style.width = w - 10;
				}
				
			}
			this.winList[winID] = config;
		}
	},
	/**
	 * 只用于对当前窗口且显示类型为ID时候进行自动调整大小
	 */
	autoReSize : function(){
		if(this.focusWin != null && this.focusWin.type === "windows" &&this.focusWin.contextType === "ID"){
			var obj = this.focusWin.dom.getElementById(this.focusWin.context);
			if(obj && obj.style.display != "none"){
				this.setSize(this.focusWin.id, obj.offsetWidth, obj.offsetHeight);
				return true;
			}
		}
		return false;
	},
	/**
	 * 开始
	 * id:哪个窗口
	 * type:R|L|D|U 方向
	 */
	startChangeSize : function( id, type, ee ){
		var config = Gwin.getWin( id );
		if(!config.resize)return;
		var dom = config.dom,lg = null;
		var stat = {id:id,type:type,config:config};
		var cr = "e-resize";	//R L
		if(type === "U" || type==="D")cr = "n-resize";
		else if(type === "RU" || type === "LD")cr = "ne-resize";
		else if(type === "LU" || type === "RD")cr = "nw-resize";			
		window.document.body.style.cursor = cr; 
		dom.onselectstart = function(){
			return false;
		}
		dom.onmousemove = function(e){
			Gwin.areChangeSize(stat,Gwin.isIE ? ee : e);
		}
		if(config.contextType === "URL"){
			lg = dom.getElementById("move_"+id);
			lg.style.display = "";
			lg.style.left = config.left;
			lg.style.top = config.top + 24;
			lg.style.width = config.width - Gwin.isIE ? 10 : 4;
			lg.style.height = config.height - 35;
			if(Gwin.isIE)lg.style.background="#EAEAEA"; //IE中,如果透明了就失去作用了.奇怪
			stat.lg = lg;
			lg.onmousemove = dom.onmousemove;
			lg.onmouseup = dom.onmouseup;
		}
		dom.onmouseup = function(e){
			dom.onmouseup = dom.onmousemove = dom.onselectstart = null;
			window.document.body.style.cursor = "default";
			if(lg != null)lg.style.display = "none";
		}
	},
	/**
	 * 正在改变大小
	 */
	areChangeSize : function( stat, e){
		var x = e.clientX - stat.config.left - stat.config.width;
		var y = e.clientY - stat.config.top - stat.config.height;
		var xx,yy;
		if(stat.type === "R"){
			xx = stat.config.width+x - 10;	//减10是防止松开后就难以停止的情况
			if(Gwin.isIE)xx +=5;
			if(xx > stat.config.minWidth){	//大于最小宽度
				Gwin.setSize(stat.id, xx, 0);
				if(stat.lg){
					stat.lg.style.width = stat.config.width-4;
					stat.lg.style.height = stat.config.height;
				}
			}
		}else
		if(stat.type === "L"){
			//Gwin.setSize(id, x, 0);	//动坐标
		}else
		if(stat.type === "D"){
			yy = stat.config.height+y - 20;	//减20是防止松开后就难以停止的情况
			if(yy > stat.config.minHeight){	//大于最小高度
				Gwin.setSize(stat.id, 0, yy);
				if(stat.lg){
					stat.lg.style.height = stat.config.height;
					stat.lg.style.width = stat.config.width-4;
				}
			}
		}else
		if(stat.type === "U"){
			//Gwin.setSize(id, 0, y);	//动坐标
		}
	},
	/**
	 * 取得当前窗口资源位置:config.iconPath;
	 */
	getIconPath: function ( config ){
		var path = config.dom.location.href;
		path = path.split("?")[0];
		var rpath = "";
		var list = path.split("//")[1].split("/");
		for(var i=2;i<list.length-1;i++){
			rpath += "../";
		}
		rpath += this.Path;
		config.titleIcon = rpath + config.titleIcon;
		config.iconPath = rpath;
	},
	/**
	 * 刷新指定一个窗口
	 */
	reloadWin: function( id ){
		var config = this.getWin( id );
		if(config != null){
			var iframeObj = config.dom.getElementById("iframe_"+config.id);
			iframeObj.src = iframeObj.src;
		}
	},
	/**
	 * 获取当前焦点窗口ID,如果传值,对象存在就返回此窗口对象配置,
	 * id: 有2种值, 1:win_id  2: id   一般就用:id     win_id是内部使用,传入win_id这种格式的id会自动转换为id.
	 * 没有窗口就返回null
	 */
	getWin: function( id ){
		if(id){//传入了ID
			var config = this.winList[id];
			if(config == undefined){
				if(id.substring(0,4) == "win_"){
					id = id.substring(4,id.length);
					config = this.winList[id];
					if( config != undefined )
						return config;
				}
			}else{
				return config;
			}		
		}else{//没有传ID,返回当前焦点窗口ID
			if(this.focusWin != null){
				var config = this.focusWin;
				if(config != undefined){
					return config;
				}
			}
		}		
		return null;
	},
	/**
	 * 指定winId窗口中的指定id对象
	 */
	getObjById: function( winId, id ){
		var config = this.getWin( winId );
		if(config != null){
			if(config.type == "windows"){
				if(config.contextType == "URL"){
					return config.dom.getElementById("iframe_"+config.id).contentWindow.document.getElementById(id);
				}	
				return config.dom.getElementById(id);
			}
		}
		return null;
	},
	/**
	 * 指定窗口中的iframe中的对象
	 */
	getIframeObjById: function( winId, iframeId, id ){
		var obj = Gwin.getObjById( winId, iframeId );
		if(obj != null){
			return obj.contentWindow.document.getElementById(id);
		}
		return null;
	},
	/**
	 * 指定winId窗口中的指定id对象的指定name属性的值为value. 
	 */
	setObjById: function( winId, id , name , value){
		var config = this.getWin( winId );
		if(config != null){
			if(config.type == "windows"){
				var obj;
				if(config.contextType == "URL"){
					obj = config.dom.getElementById("iframe_"+config.id).contentWindow.document.getElementById(id);
				}else{
					obj = config.dom.getElementById(id);
				}				
				obj[""+name+""] = value;
				return obj;
			}
		}
		return false;
	},
	/**
	 * 适用JSF中,先弹出层,显示正在载入数据...等完成后,回调此方法,设置显示内容. 
	 */
	setLoadok: function( id ){
		var config = this.getWin( id );
		if(config != null){
			id = config.id;
			var dom = config.dom;	
			var div_context = dom.getElementById("context_"+config.id);
			if(!config.autoLoad){
				if(config.contextType == "ID"){
					dom.GwinID = id;
					dom.getElementById("loading_"+config.id).style.display = "none";
					var obj = dom.getElementById(config.context);
					obj.style.display = "";
					if(div_context.childNodes.length != 2){
						div_context.appendChild(obj);
						if(config.autoRsize){
							this.setSize(config.id, obj.offsetWidth, obj.offsetHeight);
						}
						return true;
					}
				}else
				if(config.contextType == "URL"){				
					dom.getElementById("iframe_"+config.id).src = config.context +"?time="+(new Date().getTime());
					return true;
				}
			}		
		}
		return false;
	},
	/**
	 * 隐藏iframe中的正在载入图片层,显示完成载入的iframe,此方法加入到iframe中的onload中执行.
	 */
	hideLoadingdiv: function( id, iframeObj ){	
		var config = this.getWin( id );
		if(config != null){
			id = config.id;
			var dom = config.dom;
			var winObj = dom.getElementById("win_"+id);
			var loaddiv = dom.getElementById("loading_"+id);
			var iframe = dom.getElementById("iframe_"+id);
			var context = dom.getElementById("context_"+id);
			if(loaddiv && iframe && iframe.src != "about:blank"){
				iframe.style.width = context.offsetWidth-1;
				iframe.style.height = context.offsetHeight-1;
				loaddiv.style.display = "none";
				var div_mct = dom.getElementById("mct_"+id);
				try{
					var ifdom = iframe.contentWindow.document;
					iframe.contentWindow.Gwin = this;		//该子界面加入引用
					Gskin.setSkinCss(null,iframeObj);		//换皮肤
					ifdom.GwinID = id;						//告诉载入的界面怎么关闭自己.
					ifdom.GwinParentID = config.parentID;	//给子界面指定父窗口
					Gskin.changeSkin(id,function(){
						Gskin.setSkinCss(ifdom);
						div_mct.style.border = Gskin.skinObj.winBorder+" 2px solid";
						div_mct.style.borderTop = Gskin.skinObj.winBorder+" 1px solid";
					});
				}catch (e) {/*是打开指定网站,跨域了.无权限访问! 或者无Gskin*/	}
				if(config.iframeOnload  != null && typeof  config.iframeOnload === 'function'){
					config.iframeOnload( iframeObj );
				}
			}
		}
	},
	/**
	 * 开始拖动
	 */
	start: function(obj,e){
		if(Gwin.focusWin.drag){
			Gwin.MoveObj = obj.parentNode;
			Gwin.MoveObj.X = Gwin.MoveObj.offsetLeft - e.clientX;
			Gwin.MoveObj.Y = Gwin.MoveObj.offsetTop - e.clientY;
			var dom = Gwin.focusWin.dom;
			Gwin.CLeft = dom.body.clientWidth - (Gwin.MoveObj.offsetWidth)- 4;
			Gwin.CTop = dom.body.clientHeight - (Gwin.MoveObj.offsetHeight)- 4;
			dom.body.onselectstart = function(){return false;};
			var lg = dom.getElementById("move_"+Gwin.focusWin.id);
			Gwin.lg = lg;
			try{obj.setCapture();}catch (e) {	//有的浏览器不支持此方法.加入body移动实现.lg是辅助拖动防止掉落
				lg.style.display = "";
				lg.style.left = Gwin.MoveObj.style.left;
				lg.style.top = Gwin.MoveObj.style.offsetTop;
				lg.onmousemove = dom.body.onmousemove = function(e){
					if(Gwin.isMoveOut && Gwin.MoveObj){
						var x = e.clientX + Gwin.MoveObj.X, y = e.clientY + Gwin.MoveObj.Y;
						lg.style.left = Gwin.MoveObj.style.left = x > 0 ? (x < Gwin.CLeft ? x : Gwin.CLeft) : 0; 
						y = y > 0 ? (y < Gwin.CTop ? y : Gwin.CTop) : 0;
						Gwin.MoveObj.style.top = y;
						lg.style.top = y+24;
					}
					return false;
				};
				lg.onmouseup = function(e){
					this.style.display = "none";
					Gwin.stop(null);
				};
			}
		}
		return false;
	},
	/**
	 * 拖动中
	 */
	move: function(obj,e){
		if(Gwin.MoveObj){
			var x = e.clientX + Gwin.MoveObj.X,y = e.clientY + Gwin.MoveObj.Y;
			x = x > 0 ? (x < Gwin.CLeft ? x : Gwin.CLeft) : 0;
			y = y > 0 ? (y < Gwin.CTop ? y : Gwin.CTop) : 0;
			if(x >= 0 && y >= 0){
				Gwin.MoveObj.style.left = x;
				Gwin.MoveObj.style.top = y;
				Gwin.isMoveOut = false;
			}
		}
		return false;
	},
	/**
	 * 离开
	 */
	seout: function(obj,e){
		if(Gwin.MoveObj){
			var x = e.clientX + Gwin.MoveObj.X;
			var y = e.clientY + Gwin.MoveObj.Y;
			x = x > 0 ? (x < Gwin.CLeft ? x : Gwin.CLeft) : 0;
			y = y > 0 ? (y < Gwin.CTop ? y : Gwin.CTop) : 0;
			if(x >= 0 && y >= 0){
				Gwin.MoveObj.style.left = x;
				Gwin.MoveObj.style.top = y;
				Gwin.isMoveOut = true;
			}
		}
		return false;
	},
	/**
	 * 停止拖动
	 */
	stop: function(obj){
		Gwin.CLeft = Gwin.CTop = 0;
		Gwin.MoveObj = null;
		try{obj.releaseCapture();}catch (e){//停止对当前对象的鼠标跟踪
			var dom = Gwin.focusWin.dom;
			dom.body.onmousemove = null;
			dom.getElementById("move_"+Gwin.focusWin.id).style.display = "none";
		}
		Gwin.focusWin.dom.body.onselectstart = null;
		Gwin.focusWin.left = obj.parentNode.offsetLeft;
		Gwin.focusWin.top = obj.parentNode.offsetTop;
		if(Gwin.lg){ //很小的几率会出现null的错误.保护下!
			Gwin.lg.style.left = obj.parentNode.offsetLeft;
			Gwin.lg.style.top = Gwin.focusWin.top + 24;
		}
		Gwin.lg = null;
		return false;
	},
	/**
	 * 双击标题栏,最大化 | 还原 
	 */
	dblclick:function(id){
		var config = this.getWin( id );
		if(config != null){
			id = config.id;
			var iconObj = config.dom.getElementById("max_"+id);
			if(iconObj != null && iconObj !== undefined){
				if(iconObj.style.display != "none"){
					if(config.dom.getElementById("min_"+id).style.display != "none"){
						this.max( id );		//最大化
					}
				}else{						
					this.rese( id );		//还原
				}				
			}
		}
		return false;
	},
	showMsg: function(){
		var argument = arguments[0];
		var winid="alert_id",title,context,type,dom,buttons;
		if(argument.length == 1){ context = argument[0]; title = type = dom = buttons = null; }else
		if(argument.length == 2){ title = argument[0]; context = argument[1]; type = dom = buttons = null;  }else
		if(argument.length == 3){ title = argument[0]; context = argument[1]; type = argument[2]; dom = buttons = null;  }else
		if(argument.length == 4){ title = argument[0]; context = argument[1]; type = argument[2]; dom = argument[3]; buttons=null; }else
		if(argument.length == 5){ title = argument[0]; context = argument[1]; type = argument[2]; dom = argument[3]; buttons=argument[4]; }else
		if(argument.length == 6){ winid = argument[0]; title = argument[1]; context = argument[2]; type = argument[3]; dom = argument[4]; buttons=argument[5]; }else return;
		this.open({
			id:winid,
			type:"message",
			title:title ? title : '系统提示',
			icon:type ? type : '!',
			width:400,
			height:120,
			context:context,
			lock:true,
			dom:dom ? dom : document,
			buttons:buttons ? buttons : [{lable:'确定',click:function(){
				Gwin.close(winid);
			}}]
		}).show(winid);
	},
	alert: function(){
		this.showMsg(arguments);
	},
	confirm: function(){
		if(arguments.length == 6){
			this.showMsg(arguments);
		}
	},
	progress: function(msg,time,dom){
		if(dom);else return;
		this.open({
			id:"progress_id",	
			type:"progress",
			dom:dom,
			lock:true,
			progressMsg:msg,
			progressTime:time
		}).show("progress_id");
	},
	/**
	 * 创建一个窗口,初始化数据.
	 */
	open: function( config ){
		config = config || {};
		var setting = this.setting;
		for( var i in setting ){			
			if( config[i] === undefined ) config[i] = setting[i];
		};
		return this.init( config );
	},
	/**
	 * 显示窗口,默认调用open方法是创建一个窗口,并没有显示,需要调用此方法就显示.
	 */
	show: function( id ){
		var config = this.getWin( id );
		if(config != null){
			id = config.id;
			var iframeURL = config.dom.iframeURL;
			var obj = config.dom.getElementById("win_"+id);
			if(obj){
				this.winCount++;
				obj.style.display = "";
				config.winState.show = true;
				config.winState.hide = false;
				this.openPath[iframeURL].path += config.id +"@";
				this.setZindex(obj);
				if(config.type == "progress"){
					if(config.progressTime > 0){	//设置了显示时间,需要设置超时函数
						if(config.progressTimeOut != null){
							setTimeout(config.progressTimeOut,1000 * config.progressTime); 	//设置超时执行函数.
						}else{
							setTimeout(function(){
								Gwin.close( config.id );
							},1000 * config.progressTime);	//函数为null时候,自己关闭进度条.
						}
					}
				}else
				if(config.type === "windows" && config.contextType != "URL"){
					try{Gskin.changeSkin(config.id,function(){
						var div_mct = config.dom.getElementById("mct_"+config.id);
						div_mct.style.border = Gskin.skinObj.winBorder+" 2px solid";
						div_mct.style.borderTop = Gskin.skinObj.winBorder+" 1px solid";
					});}catch(e){}
				}
			}	
			return this;
		}	
		return null;
	},
	/**
	 * 隐藏窗口
	 */
	hide: function( id ){
		var config = this.getWin( id );
		if(config != null){
			id = config.id;
			var iframeURL = dom.iframeURL;
			var obj = config.dom.getElementById("win_"+id);
			if(obj == null && id.indexOf("win_") != -1){
				id = id.split("win_")[1];
				obj = config.dom.getElementById("win_"+id);
			}
			if(obj){			
				obj.style.display = "none";
				config.winState.hide = true;
				config.winState.show = false;
				var winPath = this.openPath[iframeURL].path.split("@");
				for(i=0;i<winPath.length-1;i++){
					if(winPath[i] != id){
						newPath += winPath[i]+"@";
					}
				}
		    	this.openPath[iframeURL].path = newPath;			//重新设置路径
			}
			return this;
		}
		return null;
	},
	/**
	 * 自定义按钮的添加事件函数,转调用方式
	 */
	addClick: function( id , index){
		var config = this.getWin( id );
		if(config != null){
			if(index < config.buttons.length){
				var btn = config.buttons[index];
				if(btn.click && typeof btn.click === 'function'){
					btn.click( config.dom.getElementById("win_"+config.id) );
				}
			}
		}
	},
	/**
	 * 默认按钮OK事件
	 */
	ok:function( id ){
		var config = this.getWin( id );
		if(config != null){
			id = config.id;
			if(config.ok && typeof  config.ok === 'function'){				
				config.ok( config.dom.getElementById("win_"+id) );//------------------------------------OK执行函数
			}
		}
	},
	/**
	 * 默认按钮cancel事件
	 */
	cancel:function( id ){
		var config = this.getWin( id );
		if(config != null){
			id = config.id;
			if(config.cancel && typeof  config.cancel === 'function'){				
				config.cancel( config.dom.getElementById("win_"+id) );//------------------------------------cancel执行函数
			}else{
				this.close( id );
			}
		}
	},
	/**
	 * 获得焦点的窗口后,最上显示,其他的窗口(如果有)在焦点窗口下显示.
	 */
	setZindex: function( winObj ){//要根据config中的配置.是否开启了背景层.是的话,还要进行打开层操作.	
		if(winObj === undefined)return false;
		var config = this.getWin( winObj.id );
		if(config){
			var id = config.id;
			var dom = config.dom;
			var iframeURL = dom.iframeURL;
			var obj = dom.getElementById("win_background");
			winObj.style.zIndex = 1002 + this.winCount;			 //从1000开始的.  当前层的下一层是背景层的预留位置.
			config.winState.focus = true;
			this.focusWin = config;		//记录当前焦点窗口
			if(config.lock){
				obj.style.zIndex = winObj.style.zIndex - 1;  //背景层显示在窗口下面.
				obj.style.display = "";
			}
			var i = 0,item,cf,j = 0;	
			for(item in this.winList){
				if(item != id){//注意下上下层次  需要判断
					try{ 
						cf = this.winList[""+item+""];
						if(cf.dom.iframeURL != iframeURL)continue;	//不是在同一个页面中的窗口.就不需要重新设置层次.
						obj = cf.dom.getElementById("win_"+item);
						cf.winState.focus = false;
					}catch(e){obj = null;}
					if(obj){
						if(cf.parent == id){  //当前焦点是父窗口,不需要更新层次
							
						}else{
							if(cf.parent && cf.parent == config.parent){	//窗口是子集//是同一个窗口中的子集
								obj.style.zIndex = 1000 + i++; //按顺序层次
							}else{
								if(config.parent == null){ //当前窗口是子集
									obj.style.zIndex = 1000 + i++; //按顺序层次
								}
							}
						}
					}else{
						this.winCount -- ;
						delete this.winList[""+item+""];	//有可能是刷新某个子界面了,刚好那个界面有窗口隐藏了.所以要删除掉它们.
					}
				}
			}
			return true;
		}
		return false;
	},
	/**
	 * 最小化
	 */
	min: function( id ){	
		var config = this.getWin( id );
		if(config != null){
			id = config.id;
			var dom = config.dom;
			if(config.min){
				var winObj = dom.getElementById("win_"+id);
				var obj = dom.getElementById("mct_"+id);
				var iconObj = dom.getElementById("res_"+id);		
				if(winObj !== undefined && iconObj !== undefined && obj !== undefined){
					if(config.minfront != null && typeof  config.minfront === 'function'){				
						if(!config.minfront( winObj ))return false;//------------------------------------最小化前函数,返回true继续
					}
					iconObj.style.display = "";					//显示还原按钮
					iconObj = dom.getElementById("min_"+id);
					iconObj.style.display = "none";				//隐藏最小化按钮	
					obj.className = "div_mct_n";	
					winObj.style.height = 21;
					if(config.minafter != null && typeof  config.minafter === 'function'){				
						config.minafter( winObj )//------------------------------------最小化后
					}
					config.winState.min = true;
					config.winState.max = false;
					return true;
				}
			}		
		}
		return false;
	},
	/**
	 * 最小化还原
	 */
	res:function( id ){
		var config = this.getWin( id );
		if(config != null){
			id = config.id;
			var dom = config.dom;
			if(config.min){
				var winObj = dom.getElementById("win_"+id);
				var obj = dom.getElementById("mct_"+id);
				var iconObj = dom.getElementById("res_"+id);
				if(winObj !== undefined && obj !== undefined ){
					iconObj.style.display = "none";				//隐藏还原按钮
					iconObj = dom.getElementById("min_"+id);
					iconObj.style.display = "";					//显示最小化按钮	
					obj.className = "div_mct_y";
					winObj.style.height = config.height;
					if(config.minRese != null && typeof  config.minRese === 'function'){				
						config.minRese( winObj )//------------------------------------最小化还原函数
					}
					config.winState.min = false;
					return true;
				}	
			}		
		}
		return false;
	},
	/**
	 * 最大化
	 */
	max: function( id ){
		var config = this.getWin( id );
		if(config != null){
			id = config.id;
			var dom = config.dom;
			var loaddiv = dom.getElementById("loading_"+id);
			if(loaddiv != null && loaddiv.style.display != "none"){if(this.isIE)return;} //IE,还未加载完成,不允许最大化.滚动条显示问题.
			if(config.max){
				var winObj = dom.getElementById("win_"+id);
				if(config.maxfront != null && typeof  config.maxfront === 'function'){				
					if(!config.maxfront( winObj ))return false;//------------------------------------最大化前,返回true继续
				}
				var iconObj = dom.getElementById("rese_"+id);
				iconObj.style.display = "";						//显示还原按钮
				iconObj = dom.getElementById("max_"+id);
				iconObj.style.display = "none";					//隐藏最大化按钮		
				var mctObj = dom.getElementById("mct_"+id);
				var contextObj = dom.getElementById("context_"+id);
				var iframeObj = dom.getElementById("iframe_"+id);
				var min = dom.getElementById("min_"+id);
				if(min && min.style.display == "none"){//当前是最小化状态
					this.res( id );//先还原最小化的状态
				}
				config.width = winObj.offsetWidth;
				config.height = winObj.offsetHeight;
				config.top = winObj.offsetTop;
				config.left = winObj.offsetLeft;
				this.winList[id] = config;
				winObj.style.top = dom.body.scrollTop;
				winObj.style.left = dom.body.scrollLeft;
				var bw = this.isIE ? dom.body.offsetWidth : dom.body.clientWidth - 7;
				var bh = this.isIE ? dom.body.offsetHeight : dom.body.clientHeight - 7;
				winObj.style.width = bw - 4;
				//if(config.showbt) bh -= 24;
				winObj.style.height = bh;
				if(mctObj.getAttribute("MH"));else mctObj.setAttribute("MH",mctObj.offsetHeight-3);
				mctObj.style.height = bh - 24;
				if(contextObj.getAttribute("CH"));else contextObj.setAttribute("CH",contextObj.offsetHeight-3);
				contextObj.style.height = bh - 24;
				//将IFRAME最大化
				if(iframeObj && iframeObj.src && iframeObj.src != "about:blank"){ //不为null,存在属性src,src长度大于0
					iframeObj.style.height = contextObj.offsetHeight - 2;
					iframeObj.style.width = contextObj.offsetWidth - 6;		//出边了
				}
				if(dom.body.scroll != "no"){//说明有滚动条了
					winObj.setAttribute("scrollValue",dom.body.scroll);
					dom.body.scroll = "no";//禁用一下.还原的时候又给回去
				}
				if(config.drag)
					config.drag = false;
				if(config.maxafter != null && typeof  config.maxafter === 'function'){				
					config.maxafter( winObj )//------------------------------------最大化后
				}
				config.winState.max = true;
				config.winState.min = false;
				return true;
			}
		}
		return false;
	},
	/**
	 * 最大化还原
	 */
	rese: function( id ){
		var config = this.getWin( id );
		if(config != null){
			id = config.id;
			var dom = config.dom;
			if(config.max){
				var iconObj = dom.getElementById("rese_"+id);
				iconObj.style.display = "none";					//显示还原按钮
				iconObj = dom.getElementById("max_"+id);
				iconObj.style.display = "";						//隐藏最大化按钮		
				var winObj = dom.getElementById("win_"+id);	
				var mctObj = dom.getElementById("mct_"+id);
				var iframeObj = dom.getElementById("iframe_"+id);
				var contextObj = dom.getElementById("context_"+id);
				var min = dom.getElementById("min_"+id);
				if(min && min.style.display == "none"){//当前是最小化状态
					this.res( id );//先还原最小化的状态
				}
				winObj.style.top = config.top;
				winObj.style.left = config.left;
				winObj.style.width = config.width;				//还原窗口大小
				winObj.style.height = config.height-4;
				mctObj.style.height = mctObj.getAttribute("MH");
				contextObj.style.height = contextObj.getAttribute("CH");
				//将IFRAME还原
				if(iframeObj && iframeObj.src && iframeObj.src != "about:blank"){ //不为null,存在属性src,src长度大于0
					iframeObj.style.height = contextObj.offsetHeight;
					iframeObj.style.width = contextObj.offsetWidth - 2; //为什么减去12 ? win{mct{context,buttons}}有边框,或者边距.
				}
				var scrollValue = winObj.getAttribute("scrollValue");
				if(scrollValue != null && scrollValue != undefined){//说明有滚动条了
					winObj.setAttribute("scrollValue",null);
					dom.body.scroll = scrollValue;//还原的时候又给回去
				}
				if(!config.drag)
					config.drag = true;
				if(config.maxRese != null && typeof  config.maxRese === 'function'){				
					config.maxRese( winObj )//------------------------------------最大化还原函数
				}
				config.winState.max = false;
				return true;
			}
		}
		return false;
	},
	/**
	 * 关闭窗口,关闭后,自动把在打开此窗口前的窗口设置为当前窗口.
	 * id: 可以是新建窗口时候的ID,也可以是:"win_新建窗口的ID"
	 */
	close: function( id ){		
		var config = this.getWin( id );
		if(config != null){
			id = config.id;
			var dom = config.dom;
			var iframeURL = dom.iframeURL;
			var obj = dom.getElementById("win_"+id);		
			if(obj){					
				if(config.closefront != null && typeof  config.closefront === 'function'){				
					if(!config.closefront( obj ))return false;//------------------------------------预留关闭窗口前执行函数
				}
				this.winCount -- ;
				if(config.type == "windows" && config.contextType == "ID"){
					try{	
						dom.getElementById("move_"+id).style.display = dom.getElementById(config.context).style.display = obj.style.display = "none";
						config.winState.hide = true;
					}catch(ee){}
				}else{
					var iframeobj = dom.getElementById("iframe_"+id);
					if(iframeobj){
						iframeobj.src = "about:blank";//防止无法聚焦问题.
						try{
							Gskin.changeSkinFun[id] = null;
						}catch(ee){}
					}
					dom.body.removeChild(obj);
					delete this.winList[id];
				}
				var winbj = dom.getElementById("win_background");
				if(config.lock){				//如果当前窗口开启了屏,就要检查上一个窗口是否开启了锁屏				
					winbj.style.display = "none";
				}					
				var winPath = this.openPath[iframeURL].path.split("@");
				var newPath = "",newId = null;
				for(i=0;i<winPath.length-1;i++){	//得到去掉当前关闭窗口的新顺序.
					if(winPath[i] != id){
						newPath += winPath[i]+"@";
					}
				}
				winPath = newPath.split("@");
				if(winPath.length > 1){
					newId = winPath[winPath.length - 2];
				}				
		    	this.openPath[iframeURL].path = newPath;			//重新设置路径
				if(newId){
					try{
						var cf = this.winList[""+newId+""];
						if(cf.dom.iframeURL == iframeURL && cf.lock){
							this.setZindex(dom.getElementById("win_"+newId));
					}
					}catch(e){
						this.winCount -- ;
						delete this.winList[""+newId+""];	//有可能是刷新某个子界面了,刚好那个界面有窗口隐藏了.所以要删除掉它们.
					}
				}					
				if(config.closeafter != null && typeof  config.closeafter === 'function'){				
					config.closeafter( obj );//------------------------------------预留关闭窗口后执行函数
				}
			}
		}
	}	
};
Gwin.setting = {
		id:'win0',					//编号
		type: 'windows',			//目前只接受:windows(窗口模式),progress(进度条模式),message(消息框模式),
		contextType: 'HTML',		// 内容显示类型.     目前只接受:HTML,ID,URL.
		//context内容说明:    http:// 或者 HTTP:// 开头且长度大于11的,进行iframe加载.指定ID加载,直接传个对象过来.其他加入给定的内容.
		context: '请填写内容!',		//根据contextType判断载入内容,context可以是HTML代码,一个ID,一个网址.
		dom:document,				//传入要显示窗口在哪个界面层的document
		title: '窗口',				// 标题. 默认'窗口'
		iconPath:'',				//图片所在文件夹,根据不同框架中位置来设置图片位置.
		titleIcon: 'gwall.gif',     // 标题栏左边的小图标
		showbt: true,				//是否显示按钮栏
		buttons: null,				// 自定义按钮buttons:[{lable:xxxx,click:function}...] 注:按钮的id会自动加上当前窗口id,格式:按钮ID_窗口ID
		ok: null,					// 确定按钮回调函数				
		cancel: null,				// 取消按钮回调函数				
		init: null,					// 对话框初始化后执行的函数
		loadingmsg:'正在载入...',		// 设置载入数据时候的提示内容.
		autoLoad: true,				// 默认是自己载入完成后,就马上显示内容.此项为JSF中功能所设置.如:先弹出窗口,需要等带ajax设置后,在显示内容.这样,这里就设置为false,自己调用方法:setLoadok( id )后就开始显示内容
		autoRsize: true,			// 是否字段调整大小.只对显示类型是ID有效.
		closefront: null,			// 对话框关闭前执行的函数			
		closeafter: null,			// 对话框关闭后执行的函数			
		okLable: '确定',				// 确定按钮文本. 默认'确定'
		cancelLable: '取消',			// 取消按钮文本. 默认'取消'		
		width: 300,					// 内容宽度
		height: 150,				// 内容高度
		minWidth: 200,				// 最小宽度限制
		minHeight: 10,				// 最小高度限制		
		scrolling: 'no',			// iframe中是否出现滚动条.默认为没有滚动条,如果需要,请设置这个参数:  | no
		iframeOnload:null,			// contextType=URL时候会创建iframe,此函数是iframe的onload事件.
		lock: false,				// 是否开启锁屏		
		background: '#7E7E7E',		// 锁屏的背景颜色		
		icon: null,					// 设置显示图标类型,支持:Y,X,!,?,error,success,confirm,prompt其中一种
		bigIcon: false,				// 是否大图标
		left: 0,					// 内部用于记录位置
		top: 0,						// 内部用于记录位置
		parentID:null,				// 当前窗口的父窗口是谁
		winState:{min:false,max:false,hide:false,show:false,focus:false},	// 窗口的状态值:min(最小化)max(最大化)hide(隐藏)show(显示)focus(焦点)
		minRese:null,				// 最小化还原的回调函数
		maxRese:null,				// 最大化还原的回调函数
		maxfront:null,				// 最大化前,回调函数
		maxafter:null,				// 最大化后,回调函数
		minfront:null,				// 最小化前,回调函数
		minafter:null,				// 最小化后,回调函数
		max: true,                  // 是否显示最大化按钮
		min: true,                  // 是否显示最小化按钮
		close: true,				// 是否显示关闭按钮
		resize: true,				// 是否允许用户调节尺寸
		drag: true, 				// 是否允许用户拖动位置	
		progressTime: 0,			// 显示进度条的时间,0表示一直显示,调用者自己关闭它.秒为单位. 当此项不为0,超时函数为null,默认自动超时关闭.
		progressMsg:'',				// 进度条提示信息
		progressTimeOut: null		// 如果设置了时间,当显示进度条的时间超过了就执行的函数.		当此项为null,并设置了时间,默认自动超时关闭.
};