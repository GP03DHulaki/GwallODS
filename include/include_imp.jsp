<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.gwall.util.MBUtil"%>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f"%>
<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h"%>
<%@ taglib uri="/WEB-INF/GWallTag" prefix="g"%>
<%@ taglib uri="https://ajax4jsf.dev.java.net/ajax" prefix="a4j"%>
<%@ taglib uri="http://www.gwall.cn" prefix="gw"%>
<%@ taglib uri="http://myfaces.apache.org/tomahawk" prefix="t"%>
<%
    String srcPath = request.getContextPath();
%>
<script type='text/javascript' src='<%=srcPath%>/gwall/all.js'></script>
<link rel="stylesheet" type="text/css" href="<%=srcPath%>/gwall/all.css">
<script type="text/javascript" src="<%=srcPath%>/js/TailHandler.js"></script>
<script type="text/javascript" src="<%=srcPath%>/js/GtableJs.js"></script>
<script type="text/javascript" src="<%=srcPath%>/js/checkboxsel.js"></script>