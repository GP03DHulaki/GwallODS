<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="../include/include_imp.jsp" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head> 
	    <title>更换用户</title>    
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">    
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="更换用户">	
		<script type="text/javascript">
			<!--
				function login(){			
					parent.location.href="../main.jsf";  	
				}
			//-->
		</script>
	</head>
  
	<body onload="login();">
	    ...更改用户<br>
	    <%
			session.invalidate();
			response.setHeader("Cache-Control","no-cache"); //HTTP 1.1 
			response.setHeader("Pragma","no-cache"); 		//HTTP 1.0 
			response.setDateHeader("Expires",0); 			//防止缓存在代理服务器上.
		%>
	</body>
</html>
