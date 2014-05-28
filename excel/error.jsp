<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>错误提示</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="错误提示">
  </head>
  <body style="background-color:#C4DDFF">
  	<table align="center" style="margin-top:100px;" border="1px" width="600px" height="200px">  	
  		<tr>
  			<td align="center">
  				<font size="5" face="华文彩云" color="blue">生&nbsp;成&nbsp;报&nbsp;表&nbsp;时&nbsp;出&nbsp;错!</font>
  			</td>
  		</tr>
  		<tr>
  			<td>可能发生的错误如下：</td>
  		</tr>
  		<tr>
  			<td>
  				<ul type="circle" style="color:green;">
	  				<li>遇到以零作除数错误</li>
	  				<li>导出时文件路径错误</li>
	  				<li>程序运行时错误</li>
	  			</ul>
  			</td>
  		</tr>
  	</table>
  </body>
</html>
