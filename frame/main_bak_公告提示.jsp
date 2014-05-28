<%@page contentType="text/html;charset=UTF-8"%>
<jsp:directive.page import="com.gwall.core.GDatabase" />
<jsp:directive.page import="java.sql.ResultSet" />
<jsp:directive.page import="java.util.Vector" />
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

				String head, test;

				rs = db.executeQuery(sql);
				if (rs.next()) {
					head = rs.getString("syva");
					test = rs.getString("sylp");
				} else {
					head = "巨软科技";
					test = "FALSE";
				}

				String userid = (String) session.getAttribute("userid")
						.toString().toUpperCase();
				if (test.equals("TEST")) {
					head = head + "--测试系统";
				} else if (test.equals("CLOSE")) {
					if (!userid.equals("ADMIN")) {
						session.setAttribute("userid", "");
						session.setAttribute("username", "");
					}
				}
				db = null;
			%> 
		<%=head%></title>

		<STYLE type=text/css>

#tabDiv {
	border: #b2c9d3 1px solid;
	BACKGROUND: #ffffff;
	overflow: hidden;
	width: 100%;
	POSITION: relative;
}

#tabsHead {
	height: 18px;
	background-image: url(images/tab-bg.gif);
	BORDER-BOTTOM-COLOR: #8db2e3;
	color: #cedff;
	line-height: 18px;
	overflow: hidden;
}

.tabh_left {
	position: absolute;
	top: 0;
	left: 0;
	height: 18px;
	width: 18px;
	background-image: url(images/scroll-left.gif);
	background-position: 0px -3px;
	z-index: 1;
	cursor: pointer;
}

.tabh_right {
	position: absolute;
	top: 0;
	right: 0;
	height: 18px;
	width: 18px;
	background-image: url(images/scroll-right.gif);
	background-position: 19px -3px;
	z-index: 1;
	cursor: pointer;
}

.tabh_left_disable {
	position: absolute;
	top: 0;
	left: 0;
	height: 18px;
	width: 18px;
	background-image: url(images/scroll-left.gif);
	background-position: 0px -3px;
	z-index: 1;
	filter: alpha(opacity = 40);
}

.tabh_right_disable {
	position: absolute;
	top: 0;
	right: 0;
	height: 18px;
	width: 18px;
	background-image: url(images/scroll-right.gif);
	background-position: 19px -3px;
	z-index: 1;
	filter: alpha(opacity = 40);
}

#tabsHead_wrap {
	height: 18px;
	background-image: url(images/tab-bg.gif);
	BORDER-BOTTOM-COLOR: #8db2e3;
	color: #cedff;
	line-height: 18px;
	margin-left: 18px;
	margin-right: 18px;
	overflow: hidden;
	width: 100%;
	position: relative;
}

.curtab {
	text-align: center;
	width: 120px;
	padding: 0px 10px 0px 10px;
	border-right: #b2c9d3 1px solid;
	font-weight: bold;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	background: #ffffff;
}

.tab {
	text-align: center;
	width: 120px;
	padding: 0px 10px 0px 10px;
	border-right: #c1d8e0 1px solid;
	font-weight: normal;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.tab_close {
	filter: alpha(opacity = 60);
	position: absolute;
	float: right;
	right: 5px;
	cursor: pointer;
}
		</STYLE>
	</head>
	<script src="frame/gmdi.js"></script>
	<link href="<%=request.getContextPath()%>/frame/mainframe.css"
		rel="stylesheet" type="text/css" />
	<script src="<%=request.getContextPath()%>/js/Gbase.js"></script>
	<script src='<%=request.getContextPath()%>/js/Gwallwin.js'></script>

	<script>
		function Submit_onclick(){
			var ImgArrow = $("ImgArrow");
			var navigate = $("navigate");

			if (ImgArrow.className == "ImgArrow_H"){
				ImgArrow.src = "images/switch_right.gif"
				ImgArrow.alt="打开左侧导航栏";
				ImgArrow.className = "ImgArrow_S"
				navigate.style.display = "none"
			} else {
				ImgArrow.src = "images/switch_left.gif"
				ImgArrow.alt="隐藏左侧导航栏";
				ImgArrow.className = "ImgArrow_H"
				navigate.style.display = "block"
			}
		}
		
		function openmodule(itemid,url){
			frames['folderForm'].Tree.openModule(itemid,url); 
		}
		
		function gmessage(){
			$("msg:btn").click();
		}
		
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
			
			$("msg:btn").click();
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
	</script>
	<body menubar="no" onload="init();">
		<div id="alertmsg" class="alertmsg" onclick="alertclick(this);">
			<br />
			<br />
			<br />
			<br />
			<font style="color: #060606; font-size: 13px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您有新的通知,请点击查阅.....</font>
		</div>
		<div id=container>
			<div id=header>
				<IFRAME id=bannerForm style="HEIGHT: 50px"
					src="<%=request.getContextPath()%>/frame/top.jsf" frameBorder=0
					width="100%" scrolling=no></IFRAME>
			</div>
			<div id=main
				style="position: absolute; clear: both; background-image: url(images/point.gif);">
				<div id=navigate>
					<IFRAME id=folderForm
						src="<%=request.getContextPath()%>/frame/left.jsp"
						onload="height = this.document.body.clientHeight - 50;"
						frameBorder=0 width="100%"></IFRAME>
				</div>
				<div style="POSITION: relative; FLOAT: LEFT; top: 20%">
					<div id="switchpic" style="">
						<br />
						<br />
						<br />
						<br />
						<br />
						<br />
						<br />
						<br />
						<a href="javascript:Submit_onclick()"> <img
								src="images/switch_left.gif" border="0" alt="隐藏左侧导航栏"
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
							<div id="tab0_content" class="content" style="display: block">
								<IFRAME id=mainForm name=mainForm
									onload="height = this.document.body.clientHeight - 70;"
									src="<%=request.getContextPath()%>/frame/welcome.jsf"
									frameBorder=0 width="100%"></IFRAME>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div style="display: none">
			<f:view>
				<h:form id="msg">
					<a4j:commandButton id="btn" action="#{bmb.checkBulletin}"
						oncomplete="getMSG();" reRender="newMSG" />
					<a4j:commandButton id="vw" action="#{bmb.getPOPBulletin}"
						reRender="bmsg" />
					<h:inputHidden id="viewflag" value="N"></h:inputHidden>
					<h:inputHidden id="selectid" value="#{bmb.selectid}"></h:inputHidden>

					<a4j:outputPanel id="output">
						<h:inputText id="newMSG" value="#{bmb.newMSG}"></h:inputText>
					</a4j:outputPanel>

					<div id=viewbulletin style="display: none;">
						<a4j:outputPanel id="bmsg">
							<table>
								<tr>
									<td>
										主题:
										<input id="vc_substance" type="text" readonly
											value="${bmb.bulletinBean.vc_substance}" style="width: 360px"
											class="inputtext" />
									</td>
								</tr>
								<tr>
									<td>
									</Td>
								</tr>
								<Tr>
									<td>
										<h:inputTextarea readonly="true" id="vc_content"
											value="#{bmb.bulletinBean.vc_content}" rows="16" cols="110" />
									</td>
								</tr>
							</table>
						</a4j:outputPanel>
					</div>
				</h:form>
			</f:view>
		</div>
	</body>
</html>
