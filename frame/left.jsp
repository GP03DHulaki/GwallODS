<%@page contentType="text/html;charset=UTF-8"%>
<html>
	<head>
		<%
			String skin = (String)request.getSession().getAttribute("GwallSkin");
			if(skin == null)skin = "blue";
			String path = request.getContextPath();
		%>
		<title>Left</title>
		<meta http-equiv="content-type" content="text/html; charset=gbk">
		<link href="<%=path%>/css/style.css" type="text/css" rel="stylesheet">
		<link id="skin" href="<%=path%>/skin/<%=skin %>/tree_<%=skin%>.css" type="text/css" rel="stylesheet">
		<script type="text/javascript" src="<%=path%>/js/Gbase.js"></script>
		<script type="text/javascript" src="<%=path%>/frame/tree.js"></script>
		<style>
			BODY {BACKGROUND-ATTACHMENT: fixed;}
			#footer {
				BORDER: #99bbe8 1px solid; BACKGROUND: #eef3fb; WIDTH: 179px;POSITION: fixed; TEXT-ALIGN: center;
			}
			#footer {
				CLEAR: both; BOTTOM: auto; POSITION: absolute; ; 
					TOP: expression(eval(document.compatMode &&	document.compatMode=='CSS1Compat') ?
					documentElement.scrollTop
					+(documentElement.clientHeight-this.clientHeight) - 2
					: document.body.scrollTop
					+(document.body.clientHeight-this.clientHeight) - 2)
			}
			#progress_mask { 
				position:absolute;
				width:100%;
				height:100%;
				top:0;
				left:0;
				right:0;
				bottom:0;
				z-index:1;
				filter:alpha(opacity=80);
				opacity:0.8;
				background:#FFFFFF;
			}
	
			#progress_image {
				position:absolute;
				width:100%;
				top:100;
				left:0;
				z-index:1;
			}
		</style>
	</head>
	<body onload="Tree.init();document.body.style.backgroundColor=parent.Gskin.skinObj.color;" leftmargin="0" onclick="parent.closeShowMenu()" topmargin="0" style="overflow-X:hidden;overflow-Y:scroll;scrollbar-base-color:#e5ecef;" ondragstart="return false" >
		<div id="skin_welcome" style="background-image:url(../skin/<%=skin %>/images/welcome.gif);background-repeat:no-repeat;height:60px;width:180px;margin-left:0px;">
			<center style="padding-top: 15px;padding-left:50px;">欢迎您<br/>
				<strong><%=session.getAttribute("username")%></strong>
			</center></div>
			<%--  <br />[ 您来自：<a href="#"><%=session.getAttribute("deptName")%></a>] --%>
		<div id="treeInit" style="white-space:nowrap "></div>
	</body>
</html>