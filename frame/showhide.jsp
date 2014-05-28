<%@page contentType="text/html;charset=UTF-8"%>
<html>
	<head>
		<title>显示/隐藏左侧导航栏</title>
		<meta http-equiv="content-type" content="text/html; charset=gbk">
		
<style type="text/css">
#switchpic {
	cursor:pointer;
	clear: both;
	vertical-align: bottom;
	margin-top: 220px;
}

body {
	padding-left: 0px;
	padding-right: 0px;
	padding-top: 0px;
	padding-bottom: 0px;
	margin: 0px;
}
		
a { color:#0000FF; font-family: "宋体"; font-style: normal; font-weight: normal;  text-decoration: none}
a:hover { color: #0000FF; background-color: none }
		</style>
	</head>
	<script language="JavaScript">
		<!--
			function Submit_onclick(){
				if(parent.myFrame.cols == "198,18,*") {
					parent.myFrame.cols="0,18,*";
					document.getElementById("ImgArrow").src="../images/switch_right.gif";
					document.getElementById("ImgArrow").alt="打开左侧导航栏";
				} else {
					parent.myFrame.cols="198,18,*";
					document.getElementById("ImgArrow").src="../images/switch_left.gif";
					document.getElementById("ImgArrow").alt="隐藏左侧导航栏";
				}
			}
		//-->			
	</script>
	<body style="background:#ffffff;">
		<div id="switchpic"><a href="javascript:Submit_onclick()"><img src="../images/switch_left.gif" border="0" alt="隐藏左侧导航栏" id="ImgArrow"/></a></div>
	</body>
</html>




