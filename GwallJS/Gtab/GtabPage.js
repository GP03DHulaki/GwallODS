/**
 * 选项卡
 * 最多10个.多余的不处理.原因是设置了不显示滚动条.
 * 之后可以在两端加入一个按钮.点击进行控制移动.
 */
var GtabPage = function( id, type, width, height, fun ){	//如果传ID,就创建好了放入ID对象中,没有,就返回创建好对象.
	this.GtabID = id ? id : document.body;
	type= type ? "onclick" : "onmouseover";
	this.div = document.createElement("div");
	this.div.id = "GtabPage_"+id;
	if(width != undefined) this.div.style.width = width;
	if(height != undefined) this.div.style.height = height;
	this.divte = document.createElement("div");
	this.divte.id = "GtabPage_title";
	this.divte.innerHTML = "<span></span>";
	this.divte[type] = function(){
		var that = window[this.parentNode.id];
		var te = event.srcElement;
		var ids = event.srcElement.id.split("_te_");
		if(te.id.indexOf("_te_") != -1){
			var ct = $(te.id+"_ct");
			if(ct){
				var obj;
				for(var i=0,l=this.childNodes.length;i<l;i++){
					obj = this.childNodes[i];
					if(obj.tagName === "DIV" || obj.tagName === "div"){
						obj.className = "";
						$(obj.id+"_ct").style.display = "none";
					}
				}
				te.className = "hover";
				ct.style.display = "block";
				var url = ct.getAttribute("URL"); 
				if(url != null && url != "null"){
					if(ct.firstChild != null){
						ct.firstChild.src = url;
					}
				}
				if(that.fun){
					var index = te.getAttribute("index")*1;
					that.fun(that.TabTitles[index]);
				}
			}
		}
	}
	this.divct = document.createElement("div");
	this.divct.id = "GtabPage_context";
	this.divct.style.background = "#FFFFFF";
	var center = document.createElement("div");
	center.className = "GtabPage_center";
	this.div.appendChild(this.divte);
	this.div.appendChild(center);
	this.div.appendChild(this.divct);
	this.TabTitles = [];				//标题HTML,内容ID
	this.addTab = function( obj,index ){		//单个添加
		if(this.TabTitles.length < 10){
			this.TabTitles.push( obj );
			this.load( (index ? index : 0),"add" );
		}
	}
	this.delTab = function( id ){		//第几个,TabTitles中存放的是title:"标题",context:"ID",index:下标数
		var index = id*1 - 1,l = this.TabTitles.length;
		if(l === 1){return true;}
		for(var i=0;i<l;i++){
			if(index >=0 && this.TabTitles[i].index === index){
				var te = $(this.div.id+"_te_"+this.TabTitles[i].id);
				if(te){
					var ct = $(te.id+"_ct");
					te.parentNode.removeChild(te);
					ct.parentNode.removeChild(ct);
					this.TabTitles.splice(i,1);
					index = -1;
					i--;l--;
				}
			}else{
				if(index < 0){
					this.TabTitles[i].index --;
				}
			}
		}
		return index < 0 ? true : false;
	}
	this.editTab = function( index, obj ){	//obj = {title:"",context:""}
		var index = index*1 - 1,l = this.TabTitles.length;
		for(var i=0;i<l;i++){
			if(this.TabTitles[i].index === index){
				var te = $(this.div.id+"_te_"+this.TabTitles[i].id);
				if(te){
					var ct = $(te.id+"_ct");
					this.TabTitles[i].title = te.innerHTML = obj.title;
					if(obj.context){
						ct.innerHTML = "";
						ct.appendChild($(obj.context));
						this.TabTitles[i].context = obj.context;
					}
					return true;
				}
			}
		}
		return false;
	}
	this.select = function( index ){
		var l=this.divct.childNodes.length,i=0;
		if(index){
			var index = index*1 - 1;
			if(index >= l)index = l-1;
			if(index <= 0)index = 0;
			for(;i<l;i++){
				obj = this.divct.childNodes[i];
				$(obj.id.split("_ct")[0]).className = i == index ? "hover" : "";
				obj.style.display = i == index ? "block" : "none";
			}
		}else{
			for(;i<l;i++){
				obj = this.divct.childNodes[i];
				if(obj.style.display === "block"){
					return i+1;
				}
			}
		}
	}
	this.setTabs = function( list,index ){	//多个添加
		if(list.length && list.length < 10){
			this.TabTitles = list;
			this.load( (index ? index : 0),"adds" );
		}
	}
	this.setFun = function( fun ){
		this.fun = fun;
	}
	this.setTabCss = function( css ){	//设置最外层DIV的样式
		this.div.style.cssText = css;
	}
	this.load = function( index, type ){
		var i = 0, l = this.TabTitles.length;
		if(type === "add"){
			i = l-1;
		}else{
			this.divte.innerHTML = "<span></span>";
			this.divct.innerHTML = "";
		}
		var ctobj,tp;
		for(;i<l;i++){
			var te = document.createElement("div");
			te.setAttribute("index",i);
			te.id = this.div.id+"_te_"+i;
			te.className = (i == index) ? "hover" : "";
			te.innerHTML = this.TabTitles[i].title;
			var ct = document.createElement("div");
			ct.id = te.id+"_ct";
			ct.style.display = (i == index ? "block" : "none");
			tp = this.TabTitles[i].context;
			ctobj = $(tp);
			if(ctobj == null && (tp.indexOf(".") != -1 || tp.indexOf("/") != -1)){//是URL
				ctobj = document.createElement("iframe");
				ctobj.src = i === index ? tp : "about:blank";
				ctobj.onload = function(e){
					if(e.target.src != "about:blank"){
						var pn = e.target.parentNode;
						if(pn != null){
							pn.setAttribute("URL","null");
						}
					}
				}
				ctobj.height = ctobj.width = "100%";
				ct.appendChild(ctobj);	
				ct.setAttribute("URL", i === index ? "null" : tp);	//如果是当前,就不要设置URL了.免得在设置src属性加载.
			}else{
				ct.appendChild(ctobj);
			}
			this.TabTitles[i].id = this.TabTitles[i].index = i;
			this.divte.appendChild(te);
			this.divct.appendChild(ct);
		}
		$(this.GtabID).appendChild(this.div);
	}
	window[this.div.id] = this;
};
function $(id){
	if(typeof  id === "object"){
		return id;
	}else{
		return document.getElementById(id);
	}
}