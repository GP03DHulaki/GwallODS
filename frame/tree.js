/**
 * 
 * @memberOf {TypeName} 
 * _url：要请求的xml文件地址
 * _initId:需要页面有一个对应id的容器，让js去填充树
 * _boxSuffix
 * _tree:树形结构根节点标识，如<tree><item></item><item></item><item></item></tree>,则此处等于tree
 * @return {TypeName} 
 */
var Tree = new function() {
    this._url = "tree.jsp";										//用于请求数据的服务器页面地址
    this._initId = "treeInit";									//树形目录初始div标识
    this._boxSuffix = "_children";								//子节点容器后缀
    this._tree="tree"											
	this.showspeed = 1.8;

    //初始化根节点
    this.init = function() {
		var initNode = $(this._initId);   //获取初始div
		
/**************************/
/**************************/
//				var gmask = $("progress_mask");
//
//				if (gmask == null){
//					gmask = document.createElement("div");
//					gmask.id = "progress_mask";
//					gmask.style.display = "block";
// //				gmask.style.height = "300";	
//					var progressimg = document.createElement("div");
//					progressimg.id = "progress_image";
// //progressimg.style.top = (tTop + initNode.offsetHeight) * 0.5;
//					progressimg.innerHTML = "<center><img src=\"../images/progress_tree.gif\"/></center>";
//					gmask.appendChild(progressimg);
//				} 
/**************************/
/**************************/
		    
        //隐藏文本框，用来保存选定的节点
		initNode.innerHTML = "<input id=\"selecteditem\" type=\"hidden\" value=\"\"/>";
		//隐藏文本框，用来保存选定的节点树
		initNode.innerHTML = initNode.innerHTML + "<input id=\"selectedTree\" type=\"hidden\" value=\"\"/>";
		
        var _node = document.createElement("div");              //创建新div作为根节点
        _node.id = "ROOT";                                      //根节点id为0 

        this.showprogress();
        initNode.appendChild(_node);                            //将根节点加入初始div
        this.getChildren(_node.id);
        
		var _autohide = document.createElement("div");          //页面是否自动隐藏
		_autohide.id = "div_autohide";							//用于更新皮肤
		_autohide.style.width  = "100%";
		_autohide.style.textAlign = "center";
		try{_autohide.style.background = parent.Gskin.skinObj ? parent.Gskin.skinObj.color : "#99bbee";}catch (e) {
			_autohide.style.background = "#99bbee";
		}
		_autohide.className = "autohide";
		
		var self=_autohide; 
	    this.ahmouseover = function(event){
	    	self.className = "autohide_over";
	    }

	    this.ahmouseout = function(event){   
	    	self.className = "autohide";
	    }

	    GaddEvent(_autohide,"mouseover",this.ahmouseover,false);
	    GaddEvent(_autohide,"mouseout",this.ahmouseout,false);
		
	    _autohide.innerHTML = "菜单自动收缩<input type=checkbox id=autohide checked/>";
	    initNode.appendChild(_autohide);
//gmask.style.display = "none";
    }
   
   	String.prototype.Trim = function(){ 
	    return this.replace(/(^\s*)|(\s*$)/g, ""); 
	}

    Function.prototype.bind = function(){   
        var __method = this;   
        var arg = arguments;   
        return function() {__method.apply(window, arg);}   
    }
    
    //获取给定节点的子节点
    this.getChildren = function(_parentId) {  
    	var folderImg = $(_parentId+"_FolderImg");
    	if(folderImg){
    		var src = folderImg.src;
    		var i = src.indexOf("/files.gif");
    		src = i == -1 ? src.replace("filesopen.gif","files.gif") : src.replace("files.gif","filesopen.gif");
    		folderImg.src = src;
    	}
    	
        //获取页面子节点容器box
        var childBox = $(_parentId + this._boxSuffix);

        //根据第一层的className的名称来判断并改变className达到变换效果，不管子节点容器是否已经存在
        var _parentNode = $(_parentId);
        if (_parentNode.className == 'title_shrink'){
            _parentNode.className = 'title_expand';
        } else if (_parentNode.className == 'title_expand') {
            _parentNode.className = 'title_shrink';
        }

        //如果子节点容器已存在则直接设置显示状态，否则从服务器获取子节点信息   
        if (childBox) {
        	//通过样式名判断根节点，然后特效展开
        	if ( _parentNode.className == 'title_shrink' || _parentNode.className == 'title_expand' ) {
	        	this.myScroll(childBox,childBox.scrollHeight,this.showspeed);
        	} else {
           		var isHidden = (childBox.style.display == "none");      	//判断当前状态是否隐藏
           		childBox.style.display = isHidden?"block":"none";       	//隐藏则显示，如果显示则变为隐藏
            }
        	try{
        		parent.waitAjaxData(true);
        	}catch(ee){
        		//防止其他界面引用本文件调用本方法,
        	}
        } else {
            var xmlHttp=this.createXmlHttp();                               //创建XmlHttpRequest对象
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == 4) {                   
                    // 从XML读数据，是第一次，肯定是展开样式
                    var rootflag = 'T';
                    if (_parentNode.className == 'title_expand' ){
                    	rootflag = 'T';
                    } else {
                    	rootflag = 'F';
                    }
                    //调用addChildren函数生成子节点
                    Tree.addChildren(_parentId, xmlHttp.responseXML,rootflag);
                }
            }
            xmlHttp.open("GET", this._url + "?parentId=" + _parentId + "&time="+new Date().getTime(), true);		// 
            xmlHttp.send(null);
        }
    }

    //根据获取的xmlTree信息，设置指定节点的子节点
    this.addChildren = function(_parentId, _data,_rootflag) {
		var _nodeBox

        if (_parentId !='ROOT'){										//非第一层（通过ID判断），增加新的BOX
	        _nodeBox = document.createElement("div");               	//创建一个容器，称为box，用于存放所有子节点
	    	_nodeBox.className = "box";                             	//父节点样式名称div.box，子节点时样式名称为box_detail，第一层是样式动态的，初始时是title_shrink
        	_nodeBox.id = _parentId + this._boxSuffix;                  //容器的id规则为：在父节点id后加固定后缀
        	
			$(_parentId).appendChild(_nodeBox); 	//将子节点box放入父节点中 
		} else {														//第一层（通过ID判断），取出已有的父节点
			_nodeBox = $(_parentId); 
		}
		
        if(_data.getElementsByTagName(this._tree).length!=0)
        {
	        var _children = _data.getElementsByTagName(this._tree)[0].childNodes;   //获取所有item节点
	        var _child = null;                                          //声明_child变量用于保存每个子节点
	        var _childType = null;                                      //声明_childType变量用于保存每个子节点类型
	        for(var i=0; i<_children.length; i++ ) {					//循环创建每个子节点
	            _child = _children[i];
	            _node = document.createElement("div");                  //每个节点对应一个新div
	            _node.id = _child.getAttribute("id");                   //节点的id值就是获取数据中的id属性值
	            if (_parentId == 'ROOT'){
	                _node.className = "title_shrink";
	                _childType = "Root";   //设置子节点类型，第一层除外
	            } else {
	                _node.className = "box_detail";
	                _childType = _child.getAttribute("isFolder")=="true"?"Folder":"File";   //设置子节点类型
	            }
	            //根据节点类型不同，调用createItemHTML创建节点内容
	            if (_childType == "File") {
	            	//非目录节点在最后多传一个link数据，用于点击后链接到新页面
	                _node.innerHTML = this.createItemHTML(_node.id, _childType, _child.firstChild.data, _child.getAttribute("link"));
	            } else {
	            	//目录节点只需传递id，节点类型，节点数据，第一层是特别样式（肯定是目录）
					_node.innerHTML = this.createItemHTML(_node.id, _childType, _child.firstChild.data);
	            }

	            _nodeBox.appendChild(_node);                        //将创建好的节点加入子节点box中
	         }

	         if (_rootflag == 'T') {
	         	var h = _nodeBox.scrollHeight
	         	_nodeBox.style.display = 'NONE';
        		this.myScroll(_nodeBox,h,this.showspeed);
        	}
		}
        try{
        	parent.waitAjaxData(false);
        }catch(e){
        	//可能别的地方用到了此JS文件.保护下.
        }
    }
    
    //创建节点的页面片断
	this.createItemHTML = function(itemId, itemType, itemData, itemLink) {
		//根据节点类型不同，返回不同的HTML片断		
		if (itemType == "File") {
            //非目录节点的class属性以item开头，并且onclick事件调用Tree.clickItem函数//direct_blue
            return '<span class="itemMark" ><img src="../images/file.gif" ></span>' +
                '<span id=\'' + itemId + '_span\' itemid=\'' + itemId + '\'  class="item" onclick="Javascript:Tree.clickItem(\'' + itemLink + '\',\''+itemId+'\');" >'+itemData+'</span>';
        } else if (itemType == "Folder") {
            //目录节点的class属性以folder开头，并且onclick事件调用Tree.getChildren函数//folder
            return '<span class="folderMark" onclick="Tree.getChildren(\'' + itemId + '\')" >' + 
                '<img id="'+itemId+'_FolderImg" src="../images/files.gif"></span>' +
                '<span class="folder" onclick="Tree.getChildren(\'' + itemId + '\')"  >' + itemData + '</span>';
        }　else if (itemType == "Root") {
            //第一层特殊处理
            return '<span class="Root" onclick="Tree.getChildren(\'' + itemId + '\')"  >' + itemData + '</span>';
        }
    }

    //点击叶子节点后的动作，目前只是弹出对话框，可修改为链接到具体的页面
    this.clickItem = function(link,itemId) {  
    	var spanitemid = itemId + "_span";
    	// 先处理上次点击的
		var olditem = $("selecteditem").value;
		if (olditem != '') {		//不为空时表示存在上次点击的节点，需处理，否则不用
			$(olditem).className = "item";
		}
		
		var spanitem = $(spanitemid);
		var title = spanitem.innerHTML;
		spanitem.className = "item_click";
		var url = link+"?ch_moduleid="+itemId.Trim()+"&url="+link+"&isAll=0";
//		parent.frames["mainForm"].location=url;
        //将本次点击的节点名保存
		$("selecteditem").value = spanitemid;
		//parent.ShowProgress("mainForm");
		//改为由Gmdi去打开
		parent.Gmdi.addTab(title,url,itemId);
    }
    
    //点击叶子节点后的动作，从页面点击创建一个新的tab
    this.openModule = function(itemId,url) {  	
    	var spanitemid = itemId + "_span";
    	//alert(spanitemid + '--' + url);
    	
    	// 先处理上次点击的
		var olditem = $("selecteditem").value;
		if (olditem != '') {		//不为空时表示存在上次点击的节点，需处理，否则不用
			$(olditem).className = "item";
		}
		
		var spanitem = $(spanitemid);
		var title = spanitem.innerHTML;
		spanitem.className = "item_click";

        //将本次点击的节点名保存
		$("selecteditem").value = spanitemid;	
		//改为由Gmdi去打开
		parent.Gmdi.addTab(title,url,itemId);
    }
    
    
    //用于创建XMLHttpRequest对象
    this.createXmlHttp=function() {
        var xmlHttp = null;
        //根据window.XMLHttpRequest对象是否存在使用不同的创建方式
        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();                     //FireFox、Opera等浏览器支持的创建方式
        } else {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");   //IE浏览器支持的创建方式
        }
        return xmlHttp;
    }
    

	/*
	  　改写后的　myscroll　满足自身的使用需求　By Sam 
	    函数名称: Scroll，层展开、收缩滑动的效果
	    Scroll(obj, h, s)
	    参数说明:
	        obj,[object]  id值或对象.     必需
	          h,[height]  展开后的高度.   可选(默认为200px)
	          s,[speed]   展开速度,值越小展开速度越慢. 可选(默认为1.2){建议取值为1.1到2.0之间[例如:1.17]}.
	    函数返回值:
			无返回值
	*/
	this.myScroll = function(obj, h, s){
	    var obj = typeof(obj)=="string"?$(obj):obj;
	    if(obj == undefined){return false;}
	    
	    var tmph = 0;
	    
	    var objheight = obj.getAttribute("showheight");
	    objheight = objheight == null?h:obj.getAttribute("showheight");
	    
	    var s = s || 1.2;
		var isHidden = (obj.style.display == "none");              //判断当前状态是否隐藏
		if (isHidden) {
			obj.style.height = 1;
			obj.style.display = "block"
		} else {
			obj.style.display = "none"
			obj.setAttribute("showheight",h);
		}
		
		obj.style.overflow = "hidden";
	
	    var reSet = function(){
			if(tmph < objheight){
			    tmph = Math.ceil(objheight-(objheight-tmph)/s);
			    obj.style.height = tmph+"px";
			}else{
			    window.clearInterval(IntervalId);
			    obj.style.height = 'auto';
			}
	    }
	
		var oldTree = $("selectedTree").value;

		//增加控制菜单收缩功能
		var autohideobj = $("autohide");
    			
		if (oldTree != '' && oldTree != obj.id && autohideobj.checked) {		//不为空时表示存在上次点击的节点，需处理，否则不用
			var preobj = $(oldTree)
			preobj.setAttribute("showheight",preobj.scrollHeight);
	
			// 更改被隐藏的节点的样式
			if (oldTree.indexOf('_child') > 0 ){
				$(oldTree.substring(0,oldTree.indexOf('_child'))).className = 'title_shrink';		
			}
			preobj.style.display = "none";
		}
		$("selectedTree").value = obj.id;
		  
	    var IntervalId = window.setInterval(reSet,10);
		
		if (obj.getAttribute("mybottom") == null){
			obj.innerHTML = obj.innerHTML + '<b class="rbottom"><b class="r4"></b><b class="r3"></b><b class="r2"></b><b class="r1"></b></b>';
			obj.setAttribute("mybottom","Yes");
		}
	}
	
	/*
	  Original scroll() From Internet Explorer
	  
	    函数名称: Scroll，层展开、收缩滑动的效果
	    Scroll(obj, h, s)
	    参数说明:
	        obj,[object]  id值或对象.     必需
	          h,[height]  展开后的高度.   可选(默认为200px)
	          s,[speed]   展开速度,值越小展开速度越慢. 可选(默认为1.2){建议取值为1.1到2.0之间[例如:1.17]}.
	    函数返回值:
	        true    展开(对象的高度等于展开后的高度)
	        false   关闭(对象的高度等于原始高度)
	*/
	this.Scroll = function(obj, h, s){
	    var h = h || 200;
	    var s = s || 1.2;
	    var obj = typeof(obj)=="string"?$(obj):obj;
	    if(obj == undefined){return false;}
	    var status = obj.getAttribute("status")==null;
	    var oh = parseInt(obj.offsetHeight);
	    obj.style.height = oh;
	    obj.style.display = "block";
	 	obj.style.overflow = "hidden";
	    if(obj.getAttribute("oldHeight") == null){
	        obj.setAttribute("oldHeight", oh);
	    }else{
	        var oldH = Math.ceil(obj.getAttribute("oldHeight"));
	    }
	    var reSet = function(){
	        if(status){
	            if(oh < h){
	                oh = Math.ceil(h-(h-oh)/s);
	                obj.style.height = oh+"px";
	            }else{
	                obj.setAttribute("status",false);
	                window.clearInterval(IntervalId);
	            }
	        }else{
	            obj.style.height = oldH+"px";
	            obj.removeAttribute("status");
	            window.clearInterval(IntervalId);
	        }
	    }
	    var IntervalId = window.setInterval(reSet,10);
	 	return status;
	}
	
	/*
	  Original showprogress() From Internet Explorer
	  
	    函数名称: showprogress，进度条
	    showprogress()
	    参数说明:
	    函数返回值:
	*/
	this.showprogress = function(){
		var parent = $(this._initId);   //获取初始div
		var gmask = $("progress_mask");

		if (gmask == null){
			gmask = document.createElement("div");
			gmask.id = "progress_mask";
			gmask.style.display = "block";
			var progressimg = document.createElement("div");
			progressimg.id = "progress_image";
//progressimg.style.top = (tTop + initNode.offsetHeight) * 0.5;
			progressimg.innerHTML = "<center><img src=\"../images/progress_tree.gif\"/></center>";
			gmask.appendChild(progressimg);
			parent.appendChild(gmask);
		} 
		
		var fmState = function(){
		//var ifwin = parent.frames[1];
		var state=null;
		if(document.readyState){
			try{
				state = document.readyState;		//ifwin.
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
		window.setTimeout(fmState,200);
	}
}
