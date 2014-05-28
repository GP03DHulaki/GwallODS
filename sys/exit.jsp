<%@ page language="java" pageEncoding="gbk"%>
<%@ include file="../include/include_imp.jsp" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
	    <title>退出系统</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">    
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="退出系统">
		<script type="text/javascript">
			<!--
				function exit(){					
					window.parent.close();
					window.parent.location.href='<%=request.getContextPath()%>/main.jsf';			
				}
			//-->
		</script>
	</head>
	
	<body onload="exit();">
	    ...退出系统<br>
	    <%
			session.invalidate();
			response.setHeader("Cache-Control","no-cache"); //HTTP 1.1 
			response.setHeader("Pragma","no-cache"); 		//HTTP 1.0 
			response.setDateHeader("Expires",0); 			//prevents caching at the proxy server
		%>
	</body>
</html>
