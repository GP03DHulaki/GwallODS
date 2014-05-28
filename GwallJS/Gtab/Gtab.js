var Gtab = {
		GtabList: {},	//存放对应title,context
		fnclick: null,	//点击事件
		/**
		 * ids: 以,分隔;处理多个选项卡
		 */
		init: function( ids ){	
			var list = ids.split(",");
			var obj;
			for(var i=0;i<list.length;i++){
				obj = $(list[i]);
				if(obj.getAttribute("gtype") == "Gtab"){
					this.tabProcess( obj );
				}
			}
		},
		/**
		 * 生成结构,包括样式
		 */
		tabProcess: function( obj ){
			var tdiv = document.createElement("div");
			tdiv.id = "Gtab_title_"+obj.id;
			tdiv.style.textAlign = obj.getAttribute("gplace") ? obj.getAttribute("gplace") : "left";
			tdiv.style.borderBottom = "#66CCFF 2px solid";
			var cdiv = document.createElement("div");
			cdiv.id = "Gtab_context_"+obj.id;
			cdiv.className = "Gtab_context";
			var list = obj.children,id,span,bool=true,titleid,contextid,j=0;
			for(var i=0;i<list.length;i++){
				id = list[i].id.length > 0 ? list[i].id : "Gtab_context_"+obj.id+"_"+j;
				list[i].id = id;
				list[i].style.padding = "2px";
				list[i].style.widht = "100%";
				list[i].style.height = "93%";
				list[i].style.border = "#66CCFF 2px solid";
				list[i].style.borderTop = 0;
				span = document.createElement("span");
				span.id = "Gtab_title_"+obj.id+"_"+j++;
				this.GtabList[span.id] = {title:span.id,context:id};
				span.innerHTML = list[i].getAttribute("glable");
				span.style.padding = "2px";
				span.style.width = "80px";
				span.style.height = "9%";
				span.style.fontSize = "12px";
				span.style.border = "#66CCFF 2px outset";
				span.style.borderBottom = 0;
				span.style.cursor = "pointer";
				span.style.textAlign = "center";
				span.onclick = this.titleclick;
				span.onmouseover = this.titleover;
				span.onmouseout = this.titleout;
				list[i].style.display = "none";
				if(bool){
					titleid = span.id;
					contextid = list[i].id;
					bool = false;
				}
				tdiv.appendChild(span);
				cdiv.appendChild(list[i]);
				i--;
			}
			obj.appendChild(tdiv);
			obj.appendChild(cdiv);
			try{
				$(titleid).click();
			}catch(e){
				$(titleid).onclick();
			}
		},
		setSelectID: function( id ){
			for(var item in this.GtabList){
				if(this.GtabList[item].context == id){
					try{
						$(this.GtabList[item].title).click();
					}catch(e){
						$(this.GtabList[item].title).onclick();
					}
					return true;
				}
			}
			return false;
		},
		titleover: function(){
			var select = this.getAttribute("select")+"" == "true" ? false : true;
			if(select)
				this.style.backgroundColor = "#66CCFF";
		},
		titleout: function(){
			var select = this.getAttribute("select")+"" == "true" ? false : true;
			if(select)
				this.style.backgroundColor = "";
		},
		titleclick: function(){
			var tab = this.parentNode.parentNode;
			var ids = Gtab.GtabList[this.id];
			var context = $(ids.context);
			context.style.display = "";
			this.style.backgroundColor = "#66CCFF";
			this.setAttribute("borderbtm",this.style.borderBottom);
			this.style.borderBottom = 0;
			var upid = tab.getAttribute("selectID");
			tab.setAttribute("selectID",this.id);
			if(upid && upid != this.id){
				ids = Gtab.GtabList[upid];
				$(ids.context).style.display = "none";
				var obj = $(ids.title);
				if(obj){
					obj.style.backgroundColor= "";
					obj.style.borderBottom = obj.getAttribute("borderbtm");
					obj.setAttribute("select",false);
				}
			}
			this.setAttribute("select",true);
			if(Gtab.fnclick){
				try{Gtab.fnclick(context);}catch(e){}
			}
		}
}
function $(id){
	return document.getElementById(id);
}