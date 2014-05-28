
	/*
	  Original ShowProgress()
	  
	    函数名称: ShowProgress，进度条(层)
	    ShowProgress()
	    参数说明:
			obj:[Object] 要显示进度层的对象

	    函数返回值:
			无

	*/
	ShowProgress = function(iframeobj){
/*
		var maindiv = parent.document.getElementById("tabsContent");
		var gmask = document.getElementById("progress_mask");
		if (gmask == null){
			gmask = document.createElement("div");
			gmask.id = "progress_mask";
			gmask.style.display = "none";
			
			var progressimg = document.createElement("div");
			progressimg.id = "progress_image";
//progressimg.style.top = (tTop + maindiv.offsetHeight) * 0.7;
			progressimg.innerHTML = "<center><img src=\"images/progress.gif\"/></center>";
			gmask.appendChild(progressimg);

			maindiv.appendChild(gmask);
		} 

		gmask.style.width = maindiv.offsetWidth
		gmask.style.height = maindiv.offsetHeight;

		var oLeft,oTop;
	 	var tLeft = 0,tTop = 0;
	 	var item = maindiv;
	 	while (item != null) {  
			oLeft = 'item.offsetLeft';
			oTop = 'item.offsetTop';
	 		tLeft += eval(oLeft);
	 		tTop += eval(oTop);
	 		
	 		item = item.offsetParent;  
	 	} 
		gmask.style.left = 0;//tLeft;
		gmask.style.top = 0;//tTop;

		gmask.style.display = "block";
		var fmState = function(){
			var ifwin = window.frames[iframeobj];
			var state=null;

			if(document.readyState){
				try{
					state=ifwin.document.readyState;
  					}catch(e){
  						state=null;
  					}
			}
			if(state=="complete"){	//|| !state	//loading,interactive,complete	//onComplete();
				gmask.style.display = "none";
				return;
			}

			window.setTimeout(fmState,10);
		}
		window.setTimeout(fmState,400);	
*/
	}

var Gmdi = new function(){
	this.arrMDI=new Array();
	this.focusObj = null;	//当前浏览对象
	this.arrUI = new Array(); //存放打开界面的对应功能,节点
	this.arrUI[0] = {tree:"",node:"",path:""};
	//首页
	var obj = {id:"tab0",item:"MAIN"};	
	this.arrMDI[0] = obj;	 
	this.MDICount = 1;	// 计数
	this.MIDIndex = 1;	// 序号
	
	this.tabw = 120;
	/*
	  Original showTab()
	  
	    函数名称: showTab，显示选定TAB(层)
		showTab()
	    参数说明:
			tabId要显示的层ID
	    函数返回值:
			无
	*/
	this.showTab = function(tabId) {
		try{
			var id = tabId.substring(3);
			if(id >0)
				onMenuLinkage(this.arrUI[id]);//界面与功能列表联动选中.
		}catch(e){
			//可能别的地方用到了此JS文件.保护下.
		}
		//tab层
		var Contents = document.getElementById("tabsContent");
		//将tab层中所有的内容层设为不可见
		//遍历tab层下的所有子节点
		var taContents = Contents.childNodes;
		for(i=0; i<taContents.length; i++) {
		    //将所有内容层都设为不可见
		    if(taContents[i].id!=null && taContents[i].id != 'tabsHead' && taContents[i].id != 'tabsContent'){
		        taContents[i].style.display = 'none';
		    }
		}
		//将要显示的层设为可见
		this.focusObj = document.getElementById(tabId + "_content");
		this.focusObj.style.display = 'block';
		//遍历tab头中所有的层

		var tabHeads = document.getElementById('tabsHead_wrap_ul').getElementsByTagName('span');
		for(i=0; i<tabHeads.length; i++){ 
		    //将超链接的样式设为未选的tab头样式

		    tabHeads[i].className='tab'; 
		}
		
		//以下所有位置值都是相对Wrap的结果

		var tablocalobj = document.getElementById(tabId + "_head").parentNode;
		var wrapobj = document.getElementById("tabsHead_wrap");
		//TAB相对位置左边
		var tableft = tablocalobj.offsetLeft;
		// 左右是相对于左卷入区与显示区连接点位置而言，左是向左卷入，右是向右卷出
		//TAB当前所处的位置，如果当前位置的右边(相对左+宽)还大于Wrap的显示区域宽，则要左移动
		var localleft = tableft + this.tabw - wrapobj.scrollLeft;
		if (localleft > wrapobj.clientWidth){

			this.scrollTab("L",(localleft - wrapobj.clientWidth + 36));
		} else if(tableft < wrapobj.scrollLeft) {	//如果相对位置的左边小于Wrap已卷进去的左边(scrollLeft)，则要右移动
			this.scrollTab("R",(wrapobj.scrollLeft - tableft));
		}
		
		//将当前超链接的样式设为已选tab头样式

		document.getElementById(tabId + "_head").className='curtab';
		document.getElementById(tabId + "_head").blur();
	};
	
	/*
	  Original removeTab()
	  
	    函数名称: removeTab，移除选定TAB(层)
		removeTab()
	    参数说明:
			tabId：要移除的层ID
	    函数返回值:
			无

	*/
	this.removeTab = function(tabId) {
		var content = document.getElementById(tabId + "_content");
		var head = document.getElementById(tabId + "_head");
		content.parentNode.removeChild(content);
		head.parentNode.removeChild(head);

		var l = tabId.substring(3);
		this.arrMDI[l] = null;
		this.arrUI[l] = null;

		// 计数器减1,序号不变
		this.MDICount = this.MDICount - 1;
		//回到默认首页
		//this.showTab("tab0");
	
		var shownext = false;
		if (l < this.arrMDI.length){
			for (var i=l;i<this.arrMDI.length;i++){
				if (this.arrMDI[i] != null){
					this.showTab('tab' + i);
					shownext = true;
					break;
				}
			}
		}
		
		if (shownext == false){
			for (var i=(l-1);i>=0;i--){
				if (this.arrMDI[i] != null){
					this.showTab('tab' + i);
					shownext = true;
					break;
				}
			}
		}
		/*
		alert(this.arrMDI.length);
		for (var i=0;i<this.arrMDI.length;i++){
			
			alert(this.arrMDI[i]);
		}
		*/
/*
		for(index in this.arrMDI){
			alert('arr['+index+']=' + this.arrMDI[index]);
			
			if (this.arrMDI[index] == tabId){
				delete arrMDI[index];
				//this.arrMDI.splice(index,1);
				break;
			}
		
		}
*/

	};
	
	function indexOfArray(obj,array){
		if(typeof obj == 'string'){
			for(var i in array){
				if(array[i] == obj){
					return true;
				}
			}
		}
		return false;
	}
	
	this.test = function(){
		var s = $("selid").value;
		alert(s);
		var tab ;
		if (!(s == null || s == '')){
			tab = $(s);
			var itemid = tab.itemid; 
			alert(itemid);
		}
	}
	/*
	  Original addTab()
	    函数名称: addTab，移除选定TAB(层)
		addTab()
	    参数说明:
	    函数返回值:
			无

	*/
	this.addTab = function(title,url,itemid) {
		/*
		alert(title);
		alert(this.arrMDI.toString());
		alert(this.arrMDI.valueOf());
		alert(title.indexOf(this.arrMDI.valueOf()));
		alert(title.indexOf(this.arrMDI.toString()));
		*/
		
		// itemid 模块ID
		if(!indexOfArray(title,this.arrMDI)){
			if ( this.MDICount > 24){
				alert('系统最大允许同时打开24个窗口');
				return;
			}
		}
		
		var bExist = false; 
		var tabid;
		
		for(index in this.arrMDI){
			if ( this.arrMDI[index] != null){
				if (this.arrMDI[index].item == itemid){
					bExist = true;
					tabid = this.arrMDI[index].id;
				}
			}
		}
		
		//如果不存在，则先创建
		if (!bExist){
			var obj = {};
			var uiObj={};
			tabid = "tab" + this.MIDIndex.toString();
			obj.id = tabid;
			obj.item = itemid;
			var l = this.arrMDI.length;
			this.arrMDI[l] = obj;
			var iframeleft = document.getElementById("folderForm").contentWindow.document;
			uiObj.tree = iframeleft.getElementById("selectedTree").value;//当前最顶端
			uiObj.node = itemid+"_span"; //节点
			uiObj.path = itemid+"_span"; //完整路径,防止以后有3,4,5,,,级  格式 :底/高
			var temp="",temp1=uiObj.node;//存储多级目录
			var ij=0;
			while(temp != uiObj.tree){
				temp = iframeleft.getElementById(temp1).parentNode.id; //上一级节点ID 
				if(temp.indexOf("_children")!=-1){
					uiObj.path += "/"+temp;
				}
				if(temp.length < 1){
					if(uiObj.path.indexOf(uiObj.tree) == -1){
						uiObj.path += "/"+uiObj.tree;
					}
					break;
				}
				temp1 = temp;				
				ij++;
			}
			this.arrUI[l] = uiObj;
			var head = document.getElementById("tabsHead_wrap_ul");	//tabsHead_wrap
			var content = document.getElementById("tabsContent");

			var list = document.createElement("li");
			var h = document.createElement("span");

			//h.setAttribute
			
			h.itemid = itemid;
			
			h.id = tabid + "_head";
			h.className = "tab"
			//h.innerHTML = "<a href=\"javascript:Gmdi.showTab(\'" + tabid + "\')\" name='" + tabid +"_head'>" + title + "</a>"
			//h.innerHTML = h.innerHTML + "<img class=\"tab_close\" onclick=\"javascript:Gmdi.removeTab(\'" + tabid + "\');\" src=\"images/tab-close.gif\" />";
			//h.innerHTML=title;
			//h.onclick= function(){Gmdi.showTab(tabid);};
			h.innerHTML="<span onclick=\"Gmdi.showTab('"+tabid+"');\">"+title+"</span>";
			
			h.innerHTML = h.innerHTML + "<img class=\"tab_close\" onclick=\"javascript:Gmdi.removeTab(\'" + tabid + "\');\" src=\"images/tab-close.gif\" />"
			
			var c = document.createElement("div");
			c.id = tabid + "_content";
			c.style.display = "none";
			c.className = "content";
			url = url.replace('..','');
			var src = Gskin.skinPath+url;//"about:blank";
			//c.innerHTML = "<IFRAME id=" + tabid + "_frame" + " name=" + tabid + "_frame" + " onload = \"height = this.document.body.clientHeight - 70;\" src=\"frame/mainframe.jsf\" frameBorder=0 width=\"100%\" ></IFRAME>";
			//c.innerHTML = "<f:view><f:verbatim><IFRAME id=" + tabid + "_frame" + " name=" + tabid + "_frame" + " onload = \"height = this.document.body.clientHeight - 70;\" src='"+src+"' frameBorder=0 width=\"100%\"  height=\"100%\"></IFRAME></f:view></f:verbatim>";
			c.innerHTML = "<IFRAME id=" + tabid + "_frame" + " name=" + tabid + "_frame" +
			" src='"+src+"' onload=\"parent.Gskin.setSkinCss(null,this);\" frameBorder=0 width=\"100%\"  height=\"100%\"></IFRAME>";
			//head
			list.appendChild(h);
			head.appendChild(list);

			//content
			content.appendChild(c);
			
			var gmenu;
			//var masterobj = $('curtab');//就是需要显示菜单的区域控件.
			if ( !$('gmenu') ){
				gmenu = document.createElement("div");// 菜单
				gmenu.id = "gmenu";
				gmenu.innerHTML = gmenu.innerHTML + "<div onclick='javascript:Addfav();' class='gwall-menu-item' onmouseover='changOver(event);' onmouseout='changOut(event);' id='addFav'><img class='gwall-addfavorites' src = 'images/menu/favorites.png'>添加到我的收藏夹</div>"
				gmenu.innerHTML = gmenu.innerHTML + "<div onclick='javascript:Delfav();' class='gwall-menu-item' onmouseover='changOver(event);' onmouseout='changOut(event);' id='delFav'><img class='gwall-delfavorites' src='images/drop-no.gif'>从我的收藏夹移除</div>"
				gmenu.innerHTML = gmenu.innerHTML + "<hr color=#995f14 size=1 width=125 align=center >"
				gmenu.innerHTML = gmenu.innerHTML + "<div onclick='javascript:closeThis();' class='gwall-menu-item' onmouseover='changOver(event);' onmouseout='changOut(event);' id='classOne'><img class='gwall-closecurrenttab' src='images/closeCurrentTab.png'>仅关闭当前选项卡</div>"
				gmenu.innerHTML = gmenu.innerHTML + "<div onclick='javascript:closeOther();' class='gwall-menu-item' onmouseover='changOver(event);' onmouseout='changOut(event);' id='classOther'><img class='gwall-closeothertab' src='images/closeOtherTab.png'>关闭除此之外全部</div>"
				gmenu.innerHTML = gmenu.innerHTML + "<div onclick='javascript:Closetab();' class='gwall-menu-item' onmouseover='changOver(event);' onmouseout='changOut(event);' id='classAll'>关闭所有选项卡</div>"
				gmenu.className = "gmenu_menu_favorites";
				is_IE = (navigator.appName == "Microsoft Internet Explorer");
				if(is_IE){
				gmenu.attachEvent("onmouseout",function(et){
					var w=158,h=139;
					var x=parseInt(gmenu.style.left.split("px")[0]),
						y=parseInt(gmenu.style.top.split("px")[0]);
					
					if(et.x > (parseInt(x)+parseInt(w)) || et.y > (parseInt(y)+parseInt(h))){
						//alert("大于:"+et.x+" "+et.y+" "+x+" "+y );
						gmenu.style.display = "none";
					}
					if(et.x < x || et.y < y){
						gmenu.style.display = "none";
						//alert("小于:"+et.x+" "+et.y+" "+x+" "+y );
					}
				});}
				else {
					gmenu.addEventListener("mouseout",function(et){
					var w=132,h=113;
					var x=parseInt(gmenu.style.left.split("px")[0]),
						y=parseInt(gmenu.style.top.split("px")[0]);

					if(et.clientX> (parseInt(x)+parseInt(w)) || et.clientY > (parseInt(y)+parseInt(h))){
						gmenu.style.display = "none";
					}
					else if(et.clientX < x|| et.clientY < y){
							gmenu.style.display = "none";
							
						
					}
					});
				}
				$('container').appendChild(gmenu);
			} else {
				gmenu = $('gmenu');
			}

			//masterobj.appendChild(gmenu);
			
			var Mymenu = new GMenu(h,gmenu);
			
			
			// 计数器加1，序号加1
			this.MDICount = this.MDICount + 1;
			this.MIDIndex = this.MIDIndex + 1;
		}

		//显示打开的TAB
		this.showTab(tabid);
		
		/*
		var oldonload = window.frames[tabid + "_frame"].onload;
		if(typeof oldonload != 'function') {
			window.frames[tabid + "_frame"].onload = function(){
				try{Gskin.setSkinCss(this.document);}catch(e){} 
			}
		}else{  
			window.frames[tabid + "_frame"].onload = function() {
				try{Gskin.setSkinCss(this.document);}catch(e){} 
				oldonload();
		    }
		}
		*/
		ShowProgress(tabid + "_frame");
	};
	
	/*
	Original scrollTab()
	  
	    函数名称: scrollTab，滚动显示TAB头层的内容

		scrollTab()
	    参数说明:
			无

	    函数返回值:
			无

	*/
	this.scrollTab = function(direction,offset) {
		var step = 50;
		var tabh = document.getElementById("tabsHead_wrap");
		//var tabul = document.getElementById("tabsHead_wrap_ul");
		var curtabsw = this.MDICount * this.tabw;
		
		var balance = 0;

		var d = 1

		if (direction == "L"){
			d = 1;
			balance = (tabh.scrollLeft + tabh.clientWidth - 36) % 120 ;
			if (balance > 30 && offset == 0){
				offset = 120 - balance;
			}
		} else {
			d = -1;
			balance = (tabh.scrollLeft) % 120 ;
			if (balance > 30 && offset == 0){
				offset = balance;
			}
		}

		if (offset == 0){
			offset = 120;
		}
		
		var pos = tabh.scrollLeft;
		while(offset > 0){
			step = offset / 5;
			
			if (step < 2){
				step = offset;
			}
			pos = pos + d * step;
			
			offset = offset - step;
			if (pos < 0 ){
				pos = 0;
				offset = 0;
			} else if ((curtabsw - pos) < tabh.clientWidth && direction == "L"){
				pos = curtabsw - tabh.clientWidth + 36;
				offset = 0;
			}
			tabh.scrollLeft = pos;
		}
	};

	/*
	  Original CloseallTab()
	  
	    函数名称: CloseallTab，移除除首页外的所有层
		CloseallTab()
	    参数说明:
			无
	    函数返回值:
			无

	*/
	this.CloseallTab = function() {
		var content;
		var head;
		var tabid;
		
		//从1开始，0是首页
		for (var i=1;i<this.arrMDI.length;i++){
			if (this.arrMDI[i] != null){
				tabid = this.arrMDI[i].id
				
				content = document.getElementById(tabid + "_content");
				head = document.getElementById(tabid + "_head");
				
				content.parentNode.removeChild(content);
				head.parentNode.removeChild(head);
				
				this.arrMDI[i] = null;
				this.MDICount = this.MDICount - 1;
			}
		}

		//全关闭了，只有首页了
		this.showTab("tab0");

	};
	
	this.closeOtherTab = function(tab){
		var content;
		var head;
		var tabid;
		
		//从1开始，0是首页
		for (var i=1;i<this.arrMDI.length;i++){
			if (this.arrMDI[i] != null){
				tabid = this.arrMDI[i].id
				if(tab!=tabid){
					content = document.getElementById(tabid + "_content");
					head = document.getElementById(tabid + "_head");
					
					content.parentNode.removeChild(content);
					head.parentNode.removeChild(head);
					this.arrMDI[i] = null;
				}
				this.MDICount = this.MDICount - 1;
			}
		}

		//全关闭了，只有首页了
		this.showTab(tab);
	}
	
//	this.test = function() {
//		var wrapobj = document.getElementById("tabsHead_wrap");
//		alert(wrapobj.offsetWidth);
//	}	
}