var Gskin = {
		skinObj : {skin : "skin_blue",skinName : "blue", color : "#DEE8F4",winBorder : "#24AEFF"},
		skinPath : "",linkHref : "",changeSkinFun:{},
		skinBtnObj : [
		      {className:"skin_blue",title:"蓝色"},
		      {className:"skin_pink",title:"粉红"},
		      {className:"skin_orange",title:"橙色"},
		      {className:"skin_purple",title:"紫色"}
		],
		skinColor : {
			skin_blue: "#DEE8F4",wb_blue : "#24AEFF",
			skin_pink: "#FFCCFF",wb_pink : "#FE5BF4",
			skin_orange: "#FBCFA2",wb_orange : "#FDB42F",
			skin_purple: "#DCCAF4",wb_purple : "#B253DA"
		},
		init: function (){
			var skin = this.getCookie("GwallSkin");
			var winBorder = "wb_"+(skin ? skin.split("skin_")[1] : "blue");
			this.skinObj = {
				skin : skin ? skin : "skin_blue",
				skinName : skin ? skin.split("skin_")[1] : "blue",
				color : this.skinColor[skin],
				winBorder : this.skinColor[winBorder]
			};
			this.skinPath = window.location.href.split("/main.j")[0];
			this.linkHref = this.skinPath + "/skin/"+this.skinObj.skinName+"/"+this.skinObj.skin+".css";
		},
		addSkinBtn: function( dom ){
			var html="",aobj,skinDiv = dom.getElementById("skin_div");
			for(var i=this.skinBtnObj.length-1;i>=0;i--){
				aobj = this.skinBtnObj[i];
				html+='<a id="a'+aobj.className+'" class="'
				+aobj.className+(this.skinObj.skin == aobj.className ? "2" : "")+'" onclick="setSkin(this)" title="'+aobj.title+'"></a>';
			}
			skinDiv.innerHTML = html;
		},
		/**
		 * 添加监听改变皮肤后调用 fun 方法,面向全部的,可能很多界面要求监听.
		 * key目前对应窗口id,
		 * 弹出窗口就监听切换皮肤,关闭窗口,就去掉.
		 */
		changeSkin: function( key, fun ){
			this.changeSkinFun[key] = fun;
		},
		/**
		 * 切换皮肤后更新配套颜色.
		 * @param color
		 * @return
		 */
		updateSkin: function ( upid, id ) {
			var skin = id.split("skin_")[1];
			this.skinObj = {skin:id,skinName:skin,color:this.skinColor[id],winBorder:this.skinColor["wb_"+skin]};
			this.linkHref = this.skinPath + "/skin/"+skin+"/"+id+".css";
			var treeSkinDom = document.getElementById("folderForm").contentWindow.document;
			treeSkinDom.getElementById("div_autohide").style.background = treeSkinDom.body.style.backgroundColor = this.skinObj.color;
			treeSkinDom.getElementById("skin").href = this.skinPath+"/skin/"+skin+"/tree_"+skin+".css";
			treeSkinDom.getElementById("skin_welcome").style.backgroundImage = "url("+this.skinPath+"/skin/"+skin+"/images/welcome.gif)";
			document.getElementById("skin").href = this.skinPath+"/skin/"+skin+"/main_"+skin+".css";
			document.getElementById("main").style.backgroundImage = "url("+this.skinPath+"/skin/"+skin+"/images/point.gif)";
			var img = document.getElementById("ImgArrow");
			img.src = img.src.replace(upid.split("skin_")[1],skin);
			document.getElementById("mainForm").contentWindow.document.getElementById("skin").href = this.linkHref;
			//以上完成设置top,left,头部按钮栏的皮肤切换.以下对内容界面进行动态切换.
			var mdi = Gmdi.arrMDI,link;
			for(var i=1,l=mdi.length;i<l;i++){
				try{this.setLink(mdi[i].id+"_frame");}catch(e){}
			}
			for(var key in this.changeSkinFun){
				try{this.changeSkinFun[key]();}catch(e){}
			}
		},
		setLink: function( frameid ){
			var dom = document.getElementById(frameid).contentWindow.document;
			if(dom){
				var links = dom.getElementsByTagName("link"),link,href;
				for(var i=0,l=links.length;i<l;i++){
					link = links[i];
					href = link.href;
					if(href.indexOf("/skin_") != -1){
						link.href = this.linkHref;
						return link;
					}
				}
			}
			return null;
		},
		/**
		 * 所有内容界面中调用此方法,用于显示对应的皮肤.
		 */
		setSkinCss: function ( dom, frame ){
			if(frame){
				dom = frame.contentWindow.document;
			}
			var link = dom.getElementById("skin");
			if(link){
				link.href = this.linkHref;
			}else{
				link = dom.createElement("link");
				link.id = "skin";
				link.rel = "stylesheet";
				link.href = this.linkHref;
				dom.getElementsByTagName("HEAD").item(0).appendChild(link);
			}
		},
		upDateCookie: function (name, value, days) {
			var expires = "";
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				expires = "; expires=" + date.toGMTString();
			}
			document.cookie = name + "=" + value + expires + "; path=/";
		},
		getCookie: function (name) {
			var nameCK = name + "=";
			var ca = document.cookie.split(';');
			for ( var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ')
					c = c.substring(1, c.length);
				if (c.indexOf(nameCK) == 0)
					return c.substring(nameCK.length, c.length);
			}
			return null;
		},
		removeCookie: function (name) {
			createCookie(name, "", -1);
		}
};