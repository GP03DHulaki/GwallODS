<%@page contentType="text/html;charset=UTF-8"%>

<html>
	<head>
		<title></title>
		<meta http-equiv="content-type" content="text/html; charset=gb2312">
		<script type="text/javascript" src="treeback.js"></script>
		<link href="tree.css" type="text/css" rel="stylesheet">
		<link rel="stylesheet" href="<%=request.getContextPath()%>/css/style.css">		
		<style>
			a:active{font-weight: bold;font-size: 10pt;}
			a:hover{color:#ffffff;text-decoration: none;font-size: 10pt;font-weight: bold;}
		</style>
	</head>
	
	<body onload="Tree.init()" background="../images/face/bg01.jpg" leftmargin="0" topmargin="0" ondragstart="return false">
		<table cellspacing="1" cellpadding="1" width="100%" border="0" background="<%=request.getContextPath()%>/images/face/menu1.JPG">
			<tr>
				<td width="100%" align="center" height="20">
					<font color="white">
						<b></b>
					</font>
				</td>
			</tr>
		</table>
		<div id="treeInit" style="white-space:nowrap"></div>
	</body>
</html>




