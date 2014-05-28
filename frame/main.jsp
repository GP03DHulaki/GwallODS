<%@page contentType="text/html;charset=UTF-8"%>
<jsp:directive.page import="com.gwall.core.GDatabase" />
<jsp:directive.page import="java.sql.ResultSet" />
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f"%>
<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h"%>
<%@ taglib uri="https://ajax4jsf.dev.java.net/ajax" prefix="a4j"%>
<html>
	<head>
		<title>
			<%
				GDatabase db = new GDatabase();
				ResultSet rs = null;
				String sql = "Select syva,isnull(sylp,'FAlSE') As sylp From syco Where syit = 'company'";
				//String sql = "Select syva,sylp From syco Where syit = 'company'";
				String head, test;
				rs = db.executeQuery(sql);
				if (rs.next()) {
					head = rs.getString("syva");
					test = rs.getString("sylp");
				} else {
					head = "巨软科技";
					test = "FALSE";
				}
				String userid = (String) session.getAttribute("userid").toString()
						.toUpperCase();
				if (test.equals("TEST")) {
					head = head + "--测试系统";
				} else if (test.equals("CLOSE")) {
					if (!userid.equals("ADMIN")) {
						session.setAttribute("userid", "");
						session.setAttribute("username", "");
					}
				}
				db.close();
			%> <%=head%></title>
	</head>
		<%
			Cookie cookies[]=request.getCookies();
			String skin = "blue";
			for(int i=0,l=cookies.length;i<l;i++){
				if(cookies[i].getName().equals("GwallSkin")){
					skin = cookies[i].getValue().split("skin_")[1];
					request.getSession().setAttribute("GwallSkin",skin);
				}
			}
			String path = request.getContextPath();
		%>
	<link id="skin" href="<%=path%>/skin/<%=skin %>/main_<%=skin %>.css" rel="stylesheet" type="text/css" />
	<link href="<%=path%>/frame/main.css" rel="stylesheet" type="text/css" />
	<link href="<%=path%>/frame/mainframe.css" rel="stylesheet" type="text/css" />
	<script src="<%=path%>/js/Gbase.js"></script>
	<script src='<%=path%>/js/Gwallwin.js'></script>
	
	<link href="<%=path%>/GwallJS/Gwin/default.css"	rel="stylesheet" type="text/css" />
	<script src='<%=path%>/GwallJS/Gwin/Gwin.js'></script>
	<script src="<%=path%>/GwallJS/Gskin.js"></script>
	<script src="<%=path%>/frame/gfav.js"></script>
	<script src="<%=path%>/frame/gmdi.js"></script>
	<script>
		Gskin.init();	//	初始化皮肤变量.
		function Submit_onclick(){
			var ImgArrow = $("ImgArrow");
			var navigate = $("navigate");
			if (ImgArrow.className == "ImgArrow_H"){
				ImgArrow.src = "skin/"+Gskin.skinObj.skinName+"/images/switch_right.gif";
				ImgArrow.alt="打开左侧导航栏";
				ImgArrow.className = "ImgArrow_S";
				navigate.style.display = "none";
				document.getElementById("wrapper").style.width=winWid-6+"px";
			} else {
				ImgArrow.src = "skin/"+Gskin.skinObj.skinName+"/images/switch_left.gif";
				ImgArrow.alt="隐藏左侧导航栏";
				ImgArrow.className = "ImgArrow_H";
				navigate.style.display = "block";
				document.getElementById("wrapper").style.width=winWid-202+"px";
			}
		}
		
		function openmodule(itemid,url){
			frames['folderForm'].Tree.openModule(itemid,url); 
		}
		
		function gmessage(){
			$("msg:btn").click();
		}
		var winWid 
		function init(){
			var t = '<%=test%>';
			var u = '<%=userid%>';

			//定时器刷新
			//setInterval(gmessage,300000);
			
			if (t == "TEST"){
				alert('注意：你正在使用测试系统.');
			} else if (t == "CLOSE"){
				if ( u != "ADMIN" ){
					alert("系统维护中，请稍后再访问......");
					window.location = 'index.jsp';
				} else {
					alert("系统维护......");		
				}
			}
			
			//公告
			//$("msg:btn").click();
			//初始页面元素调整
			onResize();
		}
		function onResize(){
			var ImgArrow = $("ImgArrow");
			winWid= document.body.clientWidth;
			if (ImgArrow.className == "ImgArrow_H") {
				document.getElementById("wrapper").style.width=winWid-202+"px";
			}
			else {
				document.getElementById("wrapper").style.width=winWid-6+"px";
			}
			var childHeight=document.getElementById("main").clientHeight-50+"px";
			document.getElementById("navigate").style.height=childHeight;
			document.getElementById("wrapper").style.height=childHeight;
			document.getElementById("tabsContent").style.height=document.getElementById("main").clientHeight-50-20+"px";
		}
		
		function alertclick(obj){
			obj.style.display = "none";
			
			//查看按钮
			$("msg:vw").click();
			
			Gwallwin.winShow("viewbulletin","查看通知",600);
			
			//强制定位到首页
			//Gmdi.showTab('tab0');
		}
		
		function getMSG(){
			var msg = $("msg:newMSG").value;
			var objflag = $("msg:viewflag");
			
			if (msg != "" && objflag.value == "N"){
				var obj = $("alertmsg");
				
				$("msg:selectid").value = msg;
				
				//objflag.value = "Y";
				obj.style.display = "block";
			}
		}
		
		var req;
		function sendXmlHttp(url){
			if (window.XMLHttpRequest) { 
				req = new XMLHttpRequest(); 
			}else if (window.ActiveXObject) { 
				req = new ActiveXObject("Microsoft.XMLHTTP"); 
			} 
			if(req){ 
				req.open("GET",url, true); 
				req.onreadystatechange = complete; 
				req.send(null); 
			}
		}
		
		function complete(){
			if (req.readyState == 4) { 
				if (req.status == 200) { 
					var result = req.responseText;
    				alert(result);
				}
			}
		}
		
		function Addfav(){
			var s = $("selid").value;
			var tab ;
			if (!(s == null || s == '')){
				tab = $(s);
				var itemid = tab.itemid; 
				var url = "servlet/updateFavAjax?method=1&itemid="+itemid+"&time="+new Date().getTime(); 
				sendXmlHttp(url);
				var g = $("gmenu");
				if (g != null){
					g.style.display = "none";
				}
				//$("fav:moid").value = itemid;
						
				//$("fav:addfav").click();
			}
		}
		
		function Delfav(){
			var s = $("selid").value;
			var tab ;
			
			if (!(s == null || s == '')){
				tab = $(s);
				var itemid = tab.itemid; 
				var url = "servlet/updateFavAjax?method=0&itemid="+itemid+"&time="+new Date().getTime(); 
				sendXmlHttp(url);
				var g = $("gmenu");
				if (g != null){
					g.style.display = "none";
				}
				
				//$("fav:moid").value = itemid;
				//$("fav:delfav").click();
			}
		}
		
		function Closetab(){
			Gmdi.CloseallTab();
			var g = $("gmenu");
			if (g != null){
				g.style.display = "none";
			}
		}
		
		function enddo(){
			var g = $("gmenu");
			if (g != null){
				g.style.display = "none";
			}
			alert($("fav:msg").value);
		}
		
		function changOver(event){
		obj = event.srcElement ? event.srcElement : event.target;
			if(obj.id!= null && obj.id!=''){
				var srceid = (obj.id).toString();
				if(document.getElementById(srceid)){
					var sremenu = document.getElementById(srceid);
				}
				if(sremenu){
					sremenu.className = sremenu.className + " x-menu-item-active";
				}
			}
		}
		
		function changOut(event){
		obj = event.srcElement ? event.srcElement : event.target;
			if(obj != null && obj){
				obj.className = obj.className.replace(" x-menu-item-active","")
			}
		}
		
		function closeThis(){
			var s = $("selid").value;
			var tab ;
			if (!(s == null || s == '')){
				tab = s.split('_')[0];
				var g = $("gmenu");
				if (g != null){
					g.style.display = "none";
				}
				Gmdi.removeTab(tab);
			}
		}
		
		function closeOther(){
			var s = $("selid").value;
			var tab ;
			if (!(s == null || s == '')){
				tab = s.split('_')[0];
				Gmdi.closeOtherTab(tab);
				var g = $("gmenu");
				if (g != null){
					g.style.display = "none";
				}
			}	
		}
		/**
		 * 当菜单为打开状态时候,点击其他就关闭该菜单.
		 */
		function closeShowMenu(){
			if($("gmenu") && $("gmenu").style.display == ""){
				$("gmenu").style.display = "none";
			}
		}
		var waitData = new Array();//等待处理的数据集合
		var waitCount = 0;//计数用,
		var waitIndex = 0;//处理顺序
		/**
		 * 切换界面,联动选中功能节点
		 */
		function onMenuLinkage(obj){
			var treeobj = document.getElementById("folderForm").contentWindow.document; //取值用
			var tree = obj.tree,node = obj.node,path = obj.path;
			var autohide = treeobj.getElementById("autohide").checked;
			if(autohide){
				var oldTree = treeobj.getElementById("selectedTree").value;//上次的功能模块区
				if (oldTree != '') {		//原先选中的模块
					var preobj = treeobj.getElementById(oldTree);
					preobj.setAttribute("showheight",preobj.scrollHeight);
					if (oldTree.indexOf('_child') > 0 ){
						treeobj.getElementById(oldTree.split("_children")[0]).className = 'title_shrink';		
					}
					preobj.style.display = "none";
				}
			}
			var unselected = treeobj.getElementById("selecteditem").value;
			if (unselected != '') {		//原先选中的节点
				if(treeobj.getElementById(unselected)) //存在二级节点问题
					treeobj.getElementById(unselected).className = "item";
			}
			//以上把原先展开的,选中的给还原.
			treeobj.getElementById("selectedTree").value = tree;  //设置为当前模块
			treeobj.getElementById("selecteditem").value = node;  //设置为当前子节点
//------------------------以上缩起,以下处理展开---------------------------//
			var bool = false; //是否要请求加载数据
			var startIndex = 0; //默认要从倒数第一个开始.最外层
			if(treeobj.getElementById(tree)){ //模块存在
				try{
					treeobj.getElementById(tree).style.display = "";  //展开模块
					//节点存在,但是,该节点存在于模块目录下(多级).需要将子目录都展开.
					var temp = path.split("/");
					for(var i=temp.length-2;i > 0;i--){  //从倒数第2个开始,依次展开.第一个已经在上面展开了.
						startIndex = i;//进入一层,以下抛异常了就说明某层要请求数据.
						treeobj.getElementById(temp[i]).style.display = "";  //展开模块
					}
					treeobj.getElementById(node).className = "item_click";  //选中子节点
					treeobj.getElementById(tree.split("_children")[0]).className = 'title_expand';
				}catch(ee){
					bool = true;
				}
			}else{
				bool = true;
			}
			if(bool){
				waitData = new Array();
				waitIndex = waitCount = 0;//回位.
				//以下会产生一个待处理的数据集合.
				var a1=path,a2=waitData;
				var temp = path.split("/");
				var tempObj;
				var start = startIndex == 0 ? temp.length-2 : startIndex; //默认从倒数第2个开始.
				for(var i=start;i > 0;i--){  //从倒数第2个开始,依次展开.倒数第一用来做准备好数据后的触发用.如果以上尝试异常了,就从startIndex开始
					tempObj = new Object();
					tempObj.id = temp[i].split("_children")[0];
					tempObj.type = 0;
					waitData[waitCount++] = tempObj;
				}
				tempObj = new Object();
				tempObj.id = temp[0];
				tempObj.type = 1;
				waitData[waitCount++] = tempObj;
				startIndex == 0 ? startIndex = temp.length-1 : true;//不等于0说明是存在数据,但是某一层不存在.要从某一层开始获取.
				//以上的操作已经使功能列表还原状态了,在调用一下,之后就触发waitAjaxData方法.
				frames['folderForm'].Tree.getChildren(temp[startIndex].split("_children")[0]);//加载并展开
			}
		}
		var TreeDataLoadOkFun = null;	//自动打开菜单用
		/**
		 * ajax返回数据回调(在tree添加方法中加入了一条调用本方法的语句.)
		 * 
		 **/
		function waitAjaxData(bool){
			if(bool === false && TreeDataLoadOkFun != null){
				TreeDataLoadOkFun();	//加载完成了就继续
			}
			var a1=waitIndex,a2=waitCount,a3=waitData;
			if(waitCount > 0 && waitIndex < waitCount){
				var a = document.getElementById("folderForm").contentWindow.document;
				if(waitData[waitIndex].type == 0){
					//在调用一下,之后就触发waitAjaxData方法
					frames['folderForm'].Tree.getChildren(waitData[waitIndex++].id);//加载并展开
				}else{
					//说明是节点了.待处理数据也清空了.
					try{
						a.getElementById(waitData[waitIndex].id).className = "item_click";  //选中子节点
						if(bool){
							//这里是在同一个模块下,存在打开多个目录里节点,585行,他不回调,我自己调了下,所以要重新设置显示.
							a.getElementById(waitData[waitIndex-1].id+"_children").style.display = "";  
						}
					}catch(eeff){}
				}
			}
		}
		/**
		 * 根据URL参数,自动打开并定位菜单. 
		 * url = "../outsys/outorder/outorder.jsf"
		 */
		function autoOpenTree( menu, node ){
			var dom = document.getElementById("folderForm").contentWindow.document; //left中的document
			var obj = dom.getElementById(menu);		//菜单对象
			if(obj){
				if(obj.className != "title_expand"){	//是否已经打开了
					obj.children[0].click();			//打开最外层菜单
					obj = dom.getElementById(node+"_span");	//节点
					if(obj){
						obj.click();
					}
				}else{
					obj = dom.getElementById(node+"_span");	//节点
					if(obj){
						obj.click();
					}else{
						Gwin.alert("系统提示","这个错误是没有处理子文件夹问题,该方法应用只在基础资料.","X",document);
					}
				}
				TreeDataLoadOkFun = function(){//这里要等待是否加载完成.
					obj = dom.getElementById(node+"_span");	//节点
					if(obj){
						obj.click();				//完事
					}else{							//可能在文件夹中,目前应用之处只是在基础资料中.这里的处理暂时不用.
						Gwin.alert("系统提示","这个错误是没有处理子文件夹问题,该方法应用只在基础资料.","X",document);
					}
				}
			}
		}
	</script>
	<body menubar="no" onload="init();" onResize ='onResize()'>
		<div id=container>
			<div id=header>
				<div style="display: none">
					<f:view>
						<h:form id="fav">
							<h:inputHidden id="msg" value="#{mainMB.msg}"></h:inputHidden>
							<h:inputHidden id="moid" value="#{mainMB.moid}"></h:inputHidden>

							<a4j:commandButton value="收藏夹" type="button" id="addfav"
								reRender="msg" action="#{mainMB.addFav}" oncomplete="enddo();"
								requestDelay="50" />
							<a4j:commandButton value="收藏夹" type="button" id="delfav"
								reRender="msg" action="#{mainMB.delFav}" oncomplete="enddo();"
								requestDelay="50" />
						</h:form>
					</f:view>
					<input id="selid" value="" />
				</div>
				<IFRAME id=bannerForm style="HEIGHT: 50px;overflow: hidden;"
					src="<%=path%>/frame/top.jsf" frameBorder=0
					width="100%" scrolling=no></IFRAME>
			</div>
			<div id=main style="position: absolute; clear: both; background-image: url(skin/<%=skin%>/images/point.gif);height: 100%">
				<div id=navigate>
					<IFRAME id=folderForm
						src="<%=path%>/frame/left.jsp"
						  height="100%"
						frameBorder=0 width="100%"></IFRAME>
				</div>
				<div style="POSITION: relative; FLOAT: LEFT; top: 20%">
					<div id="switchpic" style="" >
						<br />
						<br />
						<br />
						<br />
						<br />
						<br />
						<br />
						<br />
						<a href="javascript:Submit_onclick()"> <img 
								src="skin/<%=skin%>/images/switch_left.gif" border="0" alt="隐藏左侧导航栏"
								id="ImgArrow" class="ImgArrow_H" /> </a>
						<br />
						<br />
						<br />
						<br />
						<br />
						<br />
						<br />
						<br />
					</div>
				</div>
				<div id=wrapper>
					<!--tab控件-->
					<div id="tabDiv">
						<!--tab头-->
						<div id="tabsHead">
							<div id="tabh_left" class="tabh_left"
								onclick="javascript:Gmdi.scrollTab('R',0);"></div>
							<div id="tabh_right" class="tabh_right"
								onclick="javascript:Gmdi.scrollTab('L',0);"></div>
							<div id="tabsHead_wrap">
								<ul id="tabsHead_wrap_ul" style="display: block; width: 5000px;">
									<li>
										<span id="tab0_head" class="curtab"> <a
											href="javascript:Gmdi.showTab('tab0')">首页</a> </span>
									</li>
								</ul>
							</div>
						</div>
						<div id="tabsContent">
							<div id="tab0_content" class="content" style="display: block;">
							<f:view>
								<f:verbatim>
								<IFRAME id=mainForm name=mainForm
									src="<%=path%>/frame/welcome.jsf"  height="100%" 
									frameBorder=0 width="100%"></IFRAME>
								</f:verbatim>		
							</f:view>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>