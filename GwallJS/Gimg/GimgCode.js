var Gimg = {
	ajaxURL:'GwallJS/Gimg/upFile.jsp',W:0, H:0, imgW:78, imgH:88, countW:8, countH:1.4, 
	selectedStr:"", upFileID:1, isIE:false, selectPathList:"",submitfn:null,Gwin: parent.Gwin,
	/**
	 * 初始化
	 * @param nameList     路径@文件名称;文件名称;
	 * @return
	 */
	init: function ( path ) {
		this.ajaxURL += (path === 'undefined' || path === 'null') ? "?savePath=null" : "?savePath="+path;
		if(!+ [ 1, ])this.isIE = true; 
		this.W = (this.imgW + 6) * this.countW; // 边框2,2,2 滚动条20
		this.H = (this.imgH + 6) * this.countH; // 边框2,2,2 滚动条20
		var bodyw = document.body.offsetWidth;
		var bodyh = document.body.clientHeight;
		while (this.W > this.bodyw) {
			this.countW--;
			this.W = (this.imgW + 6) * this.countW; // 边框2,2,2 滚动条20
		}
		while (this.H > this.bodyh) {
			this.countH--;
			this.H = (this.imgH + 6) * this.countH; // 边框2,2,2 滚动条20
		}
		this.W++;
		var imgList = $("imgList");
		var upbox = $("upbox");
		var selectList = $("selectList");
		var c = 6;
		if(this.isIE){this.W -= 20; c += 4;} 
		imgList.style.height = this.H;
		imgList.style.width = this.W;
		selectList.style.width = this.W + c ;
		upbox.style.width = this.W + c;
		selectList.style.height = this.imgH + c;
	},
	/**
	 * 设置默认选中的图片
	 * 
	 * @param pathList
	 *            路径为项目根文件夹开始到文件(如:images/007.jpg;images/008.gif;)以;分隔
	 * @return
	 */
	setSelect: function ( pathList ){
		this.selectPathList = pathList;
		var paths = pathList.split(";");
		var nlength = paths.length - 1;
		var list = [];
		for ( var i = 0; i < nlength; i++) {
			list[i] = {
				path : paths[i]
			};
		}
		var selectList = $("selectList");
		var list1 = selectList.children;
		for ( var i = 0; i < list1.length; i++) {
			selectList.removeChild(list1[i]);
			i = -1;
		}
		this.selectPathList = "";
		$("imgscount").innerHTML = imgList.childNodes.length;
		$("selectcount").innerHTML = selectList.childNodes.length;
		if(list.length > 0){
			this.createImgToList(list, false, "selectList", true);
		}
		$("bottombutton").style.display = "none";
	},
	/**
	 * ajax中返回数据时候调用载入图片
	 * 
	 * @param nameList
	 * @return
	 */
	loadImg: function (nameList) {
		var arrays = nameList.split("@");
		var path = arrays[0];
		var names = arrays[1].split(";");
		var nlength = names.length - 1;
		var list = [];
		for ( var i = 0; i < nlength; i++) {
			list[i] = {
				path : path + names[i]
			};
		}
		this.createImgToList(list, false, "imgList", false);
	},
	/**
	 * 确认
	 * @return
	 */
	getImgPathList: function () {
		var list = $("selectList").children;
		var path = "";
		for ( var i = 0; i < list.length; i++) {
			path += list[i].getAttribute("imgPath") + ";";
		}
		if(this.submitfn != null && typeof  this.submitfn === 'function'){				
			this.submitfn( path );//------------------------------------确认函数.
		}
		return path;
	},
	/**
	 * 清空选择
	 * 
	 * @return
	 */
	clearSelectImg: function () {
		if($("selectList").children.length == 0)return;
		if(Gimg.Gwin){
			Gimg.Gwin.confirm("showMsg002","系统提示","确定要清空已选中的图片吗?","?",parent.document,
					[{lable:'确定',click:function(){
						var imgList = $("imgList");
						var selectList = $("selectList");
						var list = selectList.children;
						for ( var i = 0; i < list.length; i++) {
							imgList.appendChild(list[i]);
							list = selectList.children;
							i = -1;
						}
						Gimg.selectPathList = "";
						$("imgscount").innerHTML = imgList.childNodes.length;
						$("selectcount").innerHTML = selectList.childNodes.length;
						$("bottombutton").style.display = "";
						Gimg.Gwin.close("showMsg002");
					}},{lable:'取消',click:function(){
							Gimg.Gwin.close("showMsg002");
					}}]);		
		}else
		if(confirm("确定要清空已选中的图片吗?")){
			var imgList = $("imgList");
			var selectList = $("selectList");
			var list = selectList.children;
			for ( var i = 0; i < list.length; i++) {
				imgList.appendChild(list[i]);
				list = selectList.children;
				i = -1;
			}
			this.selectPathList = "";
			$("imgscount").innerHTML = imgList.childNodes.length;
			$("selectcount").innerHTML = selectList.childNodes.length;
			$("bottombutton").style.display = "";
		}
	},
	/**
	 * 右键最大化显示图片
	 * 
	 * @return
	 */
	showImg: function () {
		$("viewbox").style.display = 'none';
		$("imgbox").style.display = '';
		return false;
	},
	/**
	 * 往已有图片列表中添加图片.
	 * 
	 * @param list
	 * @param bool
	 *            true 表示是通过本地选取的,
	 * @param objID
	 *            要放入哪个对象中
	 * @param isSelect 是否设置选中的
	 * @return
	 */
	createImgToList: function (list, bool, objID, isSelect) {
		var imgList = $(objID);
		var id = imgList.childNodes.length;
		var fileobj = null;
		if (bool) {
			fileobj = list;
			list = [ {
				path : list.value
			} ];
		}
		var path,img;
		for ( var i in list) {
			path = list[i].path.replace(/\r\n/ig,'');;
			if(objID != "selectList" && this.selectPathList.indexOf(path) != -1){
				id++;
				continue;
			}
			img = document.createElement("span");
			img.id = (isSelect ? "img_s" : "img_")+(bool ? fileobj.id : (id++));
			imgList.appendChild(img);
			try {
				img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod = scale)";
				img.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = path;
			} catch (e) {
				var imgid = img.id;
				imgList.removeChild(img);
				img = document.createElement("img");
				img.id = imgid;
				imgList.appendChild(img);
				img.src = bool ? "" : path;
			}
			img.setAttribute("imgType", "null");
			img.style.width = this.imgW + "px";
			img.style.height = bool ? 5 + "px" : this.imgH + "px";
			img.style.border = "#FFFFFF 2px solid";
			img.setAttribute("imgPath", path);
			img.onclick = function() {
				if (this.getAttribute("imgType") == "null") {
					this.style.border = "#FF0000 2px solid";
					Gimg.selectedStr += this.id + ";";
					var type = "upselected";
					if (this.parentNode.id == "selectList")
						type = "downselected";
					this.setAttribute("imgType", type); // 图片的状态为选中
				} else {
					this.style.border = "#FFFFFF 2px solid";
					var length = Gimg.selectedStr.indexOf(this.id + ";");
					Gimg.selectedStr = Gimg.selectedStr.substring(0, length)
							+ Gimg.selectedStr.substring(length + this.id.length + 1,
									Gimg.selectedStr.length);
					this.setAttribute("imgType", "null"); // 图片的状态为选中
				}
			};
			img.onmouseout = function() {
				if (this.getAttribute("imgType") == "null") {
					this.style.border = "#FFFFFF 2px solid";
				}
			}, img.onmouseover = function() {
				if (this.getAttribute("imgType") == "null") {
					this.style.border = "#FF0000 2px solid";
				}
			}, img.oncontextmenu = function() {
				$("imgbox").style.display = "none";
				$("viewbox").style.display = "";
				$("viewimg").src = this.getAttribute("imgPath");
				return false;
			};
			img.setAttribute("isUpImg", ""+bool);  // true 要上传的图片
			$("imgscount").innerHTML = $("imgList").childNodes.length;
			$("selectcount").innerHTML = $("selectList").childNodes.length;
		}
	},
	/**
	 * 获取服务器某个文件夹下的所有图片.
	 * 
	 * @param type
	 *            delFile | getFileList
	 * @param value
	 *            参数 getFileList时候表示要获取什么扩展名的文件:gif;jpg;
	 * @param ids
	 *            删除操作后,要执行删除的ID集合
	 * @return
	 */
	getServersData: function (type, value, ids) {
		var url;
		if (type == "delFile") {
			url = this.ajaxURL+"&type=delFile&value=" + value + "&time="
					+ new Date().getTime();
		} else {
			url = this.ajaxURL+"&type=getFileList&value=" + value + "&time="
					+ new Date().getTime();
		}
		var xmlHttp;
		if (window.XMLHttpRequest) {
			xmlHttp = new XMLHttpRequest(); // FireFox、Opera等浏览器支持的创建方式
		} else {
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP"); // IE浏览器支持的创建方式
		}
		xmlHttp.open("post", url, true);
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
				if (type != "delFile") {
					var loadingmsg = $("loadingMsg");
					$("upbox").appendChild(loadingmsg);
					loadingmsg.style.display = "none";
					$("imgList").innerHTML = "";
					Gimg.loadImg(xmlHttp.responseText);
				} else {
					if (xmlHttp.responseText.length > 0) {
						Gimg.delImg(ids);
						if(Gimg.Gwin){
							Gimg.Gwin.alert("系统提示","删除图片成功!","Y",parent.document);
						}else{alert("删除图片成功!");}
					} else {
						if(Gimg.Gwin){
							Gimg.Gwin.alert("系统提示","删除图片失败!","X",parent.document);
						}else{alert("删除图片失败!");}
					}
				}
			} else {
				if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
					if(Gimg.Gwin){
						Gimg.Gwin.alert("系统提示","ajax错误:" + xmlHttp.status,"X",parent.document);
					}else{alert("ajax错误:" + xmlHttp.status);}
				}
			}
		};
		xmlHttp.send(null);
	},
	/**
	 * 删除图片集合中选择的图片.
	 * 
	 * @return
	 */
	delImgFiles: function () {
		var count = this.selectedStr.split(";").length - 1;
		if(count > 0){
			if(Gimg.Gwin){
				Gimg.Gwin.confirm("showMsg001",'系统提示',"确定要删除选中的图片吗?(选中了" + ( count ) + "张)",
						"?",parent.document,
						[{lable:'确定',click:function(){
							var paths = Gimg.moveImg("upselected", "del"); // 上面删除
							if(paths == "@"){
								Gimg.Gwin.alert("系统提示","存在于已选列表中,请放弃选择再删除!","!",parent.document);
							}else{
								var list = paths.split("@");
								Gimg.getServersData("delFile", list[0], list[1]);
							}
							Gimg.Gwin.close("showMsg001");
							}},{lable:'取消',click:function(){
								Gimg.Gwin.close("showMsg001");
						}}]);				
			}else{
				if (confirm("确定要删除选中的图片吗?(选中了" + ( count ) + "张)")) {
					var paths = this.moveImg("upselected", "del"); // 上面删除
					if(paths == "@"){
						alert("存在于已选列表中,请放弃选择再删除!");	
						return;
					}
					var list = paths.split("@");
					this.getServersData("delFile", list[0], list[1]);
				}
			}
		}
	},
	/**
	 * 服务器上删除后;就删除
	 * 
	 * @param ids
	 * @return
	 */
	delImg: function (ids) {
		var ids = ids.split(";");
		var imgList = $("imgList");
		for ( var i = 0; i < ids.length - 1; i++) {
			imgList.removeChild($(ids[i]));
		}
		$("imgscount").innerHTML = $("imgList").childNodes.length;
	},
	/**
	 * 点击上传按钮,展开上传box,进度条box
	 * 
	 * @return
	 */
	addImgFiles: function (obj) {
		var upFileBox = $("upFileBox");
		var str = upFileBox.style.display;
		upFileBox.style.display = str == "none" ? "" : "none";
		var ilist = $("imgList");
		var slist = $("selectList");
		var ibtitle = $("imgboxtitle");
		if(str == "none"){
			if(Gimg.Gwin && !Gimg.Gwin.focusWin.winState.max)Gimg.Gwin.max(Gimg.Gwin.focusWin.id);
			ilist.style.height = (this.imgH + 6) * 3 - 2;
			if (this.isIE){
				upFileBox.style.filter="alpha(opacity=1)";
				ibtitle.style.width = ilist.style.width = this.W + 10;
				slist.style.width = this.W + 18;
			}else{
				upFileBox.style.opacity = 0.1;
			}
			this.setDivOpacity();
		}else{
			if(Gimg.Gwin && Gimg.Gwin.focusWin.winState.max)Gimg.Gwin.rese(Gimg.Gwin.focusWin.id);
			ilist.style.height = this.H; 
			ibtitle.style.width = ilist.style.width = this.W;
			slist.style.width = this.isIE ? this.W + 10 : this.W + 6;
		}
	},
	/**
	 * 透明渐变
	 * 
	 * @return
	 */
	setDivOpacity: function (){
		var upFileBox = $("upFileBox");
		if(upFileBox.style.display == "none")return;
		var al,time = 100;
		if (this.isIE){
			var value = upFileBox.style.filter.split("=")[1]; 
			al = value.split(")")[0]*1 + 20;
			if(parent.Gwin){
				al = 101;
			}
			upFileBox.style.filter="alpha(opacity="+al+")";
			time = 0;
		}else{
			al = parseFloat(upFileBox.style.opacity) + 0.1;
			upFileBox.style.opacity = al;
		}
		if(al > 100){
			upFileBox.style.filter= "";
			return;
		}
		else
		if(al >= 1 && al < 1.2){
			return;
		}
		setTimeout("Gimg.setDivOpacity()", time);
	},
	/**
	 * 点击添加按钮,展示服务器上的所有图片,提供选择.
	 * 
	 * @return
	 */
	showAllImg: function ( obj ){
		var imgList = $("imgList");
		var updownbtn = $("updownbtn");
		var upFileBox = $("upFileBox");
		var upbox = $("upbox");
		if(obj.value == "添加"){
			obj.value = "隐藏";
			updownbtn.style.display = imgList.style.display = upbox.style.display = "";
			if(imgList.getAttribute("isLoad") != "true"){
				updownbtn.setAttribute("W",updownbtn.offsetWidth);
				imgList.style.height = this.H;
				imgList.setAttribute("isLoad","true");
				var loadingmsg = $("loadingMsg");
				imgList.appendChild(loadingmsg);
				loadingmsg.style.display = "";
				this.getServersData("getFileList", "gif;jpg;png;");
			}else{
				updownbtn.style.width = updownbtn.getAttribute("W");
			}
		}else{
			obj.value = "添加";
			upFileBox.style.display = updownbtn.style.display = imgList.style.display = upbox.style.display = "none";
		}
	},
	/**
	 * 刷新列表
	 * 
	 * @return
	 */
	refreshImgList: function (){
		this.getServersData("getFileList", "gif;jpg;png;");
	},
	/**
	 * 提交上传文件
	 * 
	 * @return
	 */
	upImgFiles: function () {
		$("loadimgcount").innerHTML = $("upimgcount").innerHTML;
		for ( var i = 1; i < 6; i++) {
			if ($("upFile" + i).value.length > 0) {
				this.loading("loading" + i);
				this.loadImgFun("img_upFile" + i);
				$("upImgForm" + i).submit();
			}
		}
	},
	/**
	 * 上传完成
	 * 
	 * @param obj
	 * @return
	 */
	upFlieFinish: function (obj) {
		var i = obj.id.split("hidden_frame")[1];
		var dom = obj.contentWindow.document;
		var state = dom.getElementById("upImgState");
		if (state) {
			var imgobj = $("img_upFile" + i);
			var loadobj = $("loading" + i);
			var btnobj = $("upFile" + i + "" + i);
			if (state.value == "null") {
				imgobj.setAttribute("state", false); // 让自动真高函数去修改为5再停止运行.
				loadobj.style.width = 202; // 让自动加宽函数去修改为200再停止运行.
				loadobj.innerHTML = "失败!";
				loadobj.style.backgroundColor = "#FF0000";
				btnobj.value = "重试";
			} else {
				loadobj.style.width = 204; // 成功
				loadobj.innerHTML = "100%";
				imgobj.style.height = this.imgH;
				imgobj.setAttribute("isUpImg", "false"); // 上传完成
				imgobj.setAttribute("imgPath", state.value);
				if (imgobj.filters == undefined) {
					imgobj.src = state.value;
				}
				imgobj.id = "img_" + $("imgList").childNodes.length;
				btnobj.style.display = "none";
				$("upFile" + i).outerHTML = $("upFile" + i).outerHTML;// 清空文件选择
				$("upFile" + i).value = ""; // Firefox用
				var count = $("loadimgcount").innerHTML * 1 - 1;
				count = count < 0 ? 0 : count;
				$("upimgcount").innerHTML = $("loadimgcount").innerHTML = count;
			}
		}
	},
	/**
	 * 全部取消上传
	 * 
	 * @param obj
	 * @return
	 */
	canceUpImg: function (obj) {
		var i = obj.id.charAt(obj.id.length - 1);
		if (obj.id == "cancelAll") { // 取消全部上传
			for ( var j = 1; j < 6; j++) {
				if ($("upFile" + j).value.length > 0) {
					this.canceUpFile(j);
				}
			}
		} else {
			if (obj.value == "重试") {
				var loadobj = $("loading" + i);
				var imgobj = $("img_upFile" + i);
				loadobj.style.backgroundColor = "#99FF72";
				loadobj.style.width = 0;
				this.loading(loadobj.id);
				this.loadImgFun("img_upFile" + i);
				$("upImgForm" + i).submit();
				obj.value = "取消";
			} else { // 取消上传
				this.canceUpFile(i);
			}
		}
	},
	/**
	 * 取消上传
	 * 
	 * @return
	 */
	canceUpFile: function (i) {
		var loadobj = $("loading" + i);
		var imgList = $("imgList");
		var imgobj = $("img_upFile" + i);
		if (imgobj != null)
			imgList.removeChild(imgobj);
		$("imgscount").innerHTML = imgList.childNodes.length;
		loadobj.style.backgroundColor = "#99FF72";
		var frame = $("hidden_frame" + i);
		frame.src = ""; // 终止传数据
		loadobj.style.width = 203; // 让自动加宽函数去修改为200再停止运行.
		var upimgcount = $("upimgcount");
		var loadimgcount = $("loadimgcount");
		var count = upimgcount.innerHTML * 1 - 1;
		loadimgcount.innerHTML = upimgcount.innerHTML = count < 0 ? 0 : count;
		$("upFile" + i).outerHTML = $("upFile" + i).outerHTML;// 清空文件选择
		$("upFile" + i).value = ""; // Firefox用
	},
	/**
	 * 选择文件
	 * 
	 * @param obj
	 * @return
	 */
	selectFile: function (obj) {
		var reams = "gif;GIF;jpg;JPG;png;PNG;";
		var value = obj.value.toLowerCase();
		var k = value.length - 1;
		while (value.charAt(k) != ".")
			k--;
		var ream = value.substring(k + 1, value.length); // 转换下;全部为小写.
		if (reams.indexOf(ream) == -1) {
			obj.outerHTML = obj.outerHTML;// 清空文件选择
			obj.value = ""; // Firefox用
			if(Gimg.Gwin){
				Gimg.Gwin.alert("系统提示","只允许上传gif,jpg,png图片文件!","X",parent.document);
			}else alert("只允许上传gif,jpg,png图片文件!");
			return;
		}
		var count = 0;
		var upimgcount = $("upimgcount");
		for ( var i = 1; i < 6; i++) {
			$("upFile" + i).value.length > 0 ? count++ : false;
		}
		upimgcount.innerHTML = count;
		var fileimg = $("img_" + obj.id);
		if (fileimg) {
			try {
				fileimg.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = obj.value;
			} catch (e) {
				// 除了IE其他的就有问题.不用管,有处理.
			}
			fileimg.setAttribute("imgPath", obj.value);
		} else {
			this.createImgToList(obj, true, "imgList", false)
		}
		var id = obj.id + obj.id.charAt(obj.id.length - 1); // upFile11
		var btnobj = $(id);
		var loading = $("loading" + obj.id.charAt(obj.id.length - 1));
		loading.innerHTML = "";
		loading.style.width = 0;
		btnobj.value = "取消";
		btnobj.style.display = "";
	},
	/**
	 * 将选择的图片进行位置移动.
	 * 
	 * @param type
	 *            upselected | downselected
	 * @param operate
	 *            move | del
	 * @return
	 */
	moveImg: function (type, operate) {
		var list = this.selectedStr.split(";");
		var length = list.length - 1; // 最后多了个;
		var img, x, paths = "", ids = ""; // ids用于保存要删除的ID
		var selectList = $("selectList");
		var imgList = $("imgList");
		for ( var i = 0; i < length; i++) {
			img = $(list[i]);
			if (img != null && img.getAttribute("imgType") == type) {
				img.style.border = "#FFFFFF 2px solid";
				img.setAttribute("imgType", "null");
				x = this.selectedStr.indexOf(img.id + ";");
				this.selectedStr = this.selectedStr.substring(0, x)
						+ this.selectedStr.substring(x + img.id.length + 1,
								this.selectedStr.length);
				paths += img.getAttribute("imgPath") + ";";
				if (type == "upselected") {
					if (operate == "move") {
						if (img.getAttribute("isUpImg") != "false") { // 不能是还没有上传的图片.
							if(Gimg.Gwin){
								Gimg.Gwin.alert("系统提示","选择的图片中存在为还未上传的图片,请上传后再选择!","X",parent.document);
							}else alert("选择的图片中存在为还未上传的图片,请上传后再选择!");
							paths = paths.substring(0, paths.length
									- img.getAttribute("imgPath").length - 1);
						} else {
							var imgpath = img.getAttribute("imgPath").replace(/\r\n/ig,'')+";";
							if(this.selectPathList.indexOf(imgpath) == -1){
								this.selectPathList += imgpath;
								selectList.appendChild(img);
							}
						}
					} else if (operate == "del") {
						if (img.getAttribute("isUpImg") != "false") { // 不能是还没有上传的图片.
																		// 删除情况,就不弹出提示了.
							paths = paths.substring(0, paths.length
									- img.getAttribute("imgPath").length - 1);
						} else {
							ids += img.id + ";";
						}
					}
				} else {
					if (operate == "move") {
						var imgpath = img.getAttribute("imgPath").replace(/\r\n/ig,'')+";";
						x = this.selectPathList.indexOf(imgpath);
						this.selectPathList = this.selectPathList.substring(0, x)
						+ this.selectPathList.substring(x + img.id.length + 1,
								this.selectPathList.length);
						imgList.appendChild(img);
					}
				}
			}
		}
		if (operate == "del") {
			paths += "@" + ids;
		}
		$("imgscount").innerHTML = $("imgList").childNodes.length;
		$("selectcount").innerHTML = $("selectList").childNodes.length;
		return paths;
	},
	/**
	 * 向下
	 * 
	 * @return
	 */
	downClick: function () {
		this.moveImg("upselected", "move");
		$("bottombutton").style.display = "";
	},
	/**
	 * 向上
	 * 
	 * @return
	 */
	upClick: function () {
		this.moveImg("downselected", "move");
		$("bottombutton").style.display = "";
	},
	/**
	 * 上传时候的图片渐变
	 * 
	 * @param id
	 * @return
	 */
	loadImgFun: function (id) {
		var img = $(id);
		if (img == null)
			return; // 上传完成后,就把ID给改了.
		if (img.offsetHeight < this.imgH) {
			if (img.getAttribute("state") == false) { // 上传失败了. || 取消了
				img.setAttribute("state", null);
				img.style.height = 5;
				return;
			}
			img.style.height = img.offsetHeight + 1;
		} else {
			img.style.height = 0;
		}
		setTimeout("Gimg.loadImgFun('" + id + "')", 200);
	},
	/**
	 * 上传时候的进度条
	 * 
	 * @param id
	 * @return
	 */
	loading: function (id) {
		var loadbox = $(id);
		if(loadbox == null)return;
		var w = loadbox.offsetWidth;
		if (w < 200) {
			loadbox.style.width = w + 1;
			loadbox.innerHTML = w % 2 == 0 ? w / 2 + "%" : w / 2 - 0.5 + "%";
		} else {
			if (w == 202) { // 失败
				loadbox.style.width = 200;
				return;
			}
			if (w == 203) { // 终止
				loadbox.innerHTML = "";
				loadbox.style.width = 0;
				return;
			}
			if (w == 204) { // 成功
				loadbox.innerHTML = "100%";
				loadbox.style.width = 200;
				return;
			}
			loadbox.style.width = 0;
			loadbox.innerHTML = "";
		}
		setTimeout("Gimg.loading('" + id + "')", 100);
	}
};
function $(id) {
	return document.getElementById(id);
}