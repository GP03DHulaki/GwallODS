<%@ page language="java" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h"%>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f"%>
<%@ taglib uri="/WEB-INF/GWallTag" prefix="g"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>charts</title>
		<link rel="stylesheet"
			href="<%=request.getContextPath()%>/js/amcharts/style.css"
			type="text/css">
		<script src="<%=request.getContextPath()%>/GwallJS/Gchart/charts.js"
			type="text/javascript"></script>
		<script src="<%=request.getContextPath()%>/js/amcharts/amcharts.js"
			type="text/javascript"></script>
	</head>
	<body bgcolor="#D1FAFD">
		<f:view>
			<g:Gchart gid="chart0" gversion="1" gdebug="false" width="100%"
				height="600" showType="barChart" time="600" title="复核图表" key="chna"
				fields="{spcount:'商品数量',ddcount:'订单数量'}"
				gsql="SELECT b.chna AS chna,CONVERT(INT,SUM(a.fqty)) AS spcount,COUNT(b.soco) AS ddcount FROM rede a 
	JOIN rema b ON a.biid=b.biid WHERE b.flag='11'
	AND convert(VARCHAR(20),b.chdt,120) >='nowDate 00:00'
	AND convert(VARCHAR(20),b.chdt,120) <='nowDate 23:59'
	GROUP BY chna" />
			<g:Gchart gid="chart1" gversion="1" gdebug="false" width="100%"
				height="600" showType="pieChart" time="600" title="复核图表" key="chna"
				fields="{spcount:'商品数量',ddcount:'订单数量'}"
				gsql="SELECT b.chna AS chna,CONVERT(INT,SUM(a.fqty)) AS spcount,COUNT(b.soco) AS ddcount FROM rede a 
	JOIN rema b ON a.biid=b.biid WHERE b.flag='11'
	AND convert(VARCHAR(20),b.chdt,120) >='nowDate 00:00'
	AND convert(VARCHAR(20),b.chdt,120) <='nowDate 23:59'
	GROUP BY chna" />
			<g:Gchart gid="gchart3" gversion="1" gdebug="false" width="100%"
				height="600" showType="lineChart" time="600" title="拣货图表" key="crna"
				fields="{spcount:'商品数量',ddcount:'订单数量'}"
				gsql="SELECT b.crna,CONVERT(INT,SUM(a.qty)) AS spcount,COUNT(DISTINCT a.pbid) AS ddcount FROM pkde a 
	JOIN pkma b ON a.biid=b.biid WHERE
	convert(VARCHAR(20),b.crdt,120) >='nowDate 00:00'
	AND convert(VARCHAR(20),b.crdt,120) <='nowDate 23:59'
	GROUP BY crna" />
			<g:Gchart gid="gchart4" gversion="1" gdebug="false" width="100%"
				height="600" showType="pieChart" time="600" title="上架图表" key="chna"
				fields="{spcount:'商品数量'}"
				gsql="SELECT b.chna AS chna,CONVERT(INT,SUM(a.qty)) AS spcount FROM slde a 
		JOIN slma b ON a.biid=b.biid WHERE b.flag='11'
		AND convert(varchar(20),b.chdt,120) >='nowDate 00:00'
		AND convert(varchar(20),b.chdt,120) <='nowDate 23:59'
		GROUP BY chna" />
			<g:Gchart gid="gchart5" gversion="1" gdebug="false" width="100%"
				height="600" showType="serialChart" time="600" title="交接图表"
				key="crna" fields="{spcount:'商品数量',ddcount:'订单数量'}"
				gsql="SELECT b.crna,CONVERT(INT,SUM(a.qty)) AS spcount,COUNT(DISTINCT a.obid) AS ddcount FROM lode a 
	JOIN loma b ON a.biid=b.biid WHERE 
	convert(varchar(20),b.crdt,120) >='nowDate 00:00'
	AND convert(varchar(20),b.crdt,120) <='nowDate 23:59'
	GROUP BY crna" />

			<g:Gchart gid="chart0" gversion="1" gdebug="false" width="100%"
				height="600" showType="barChart" time="600" title="复核图表" key="chna"
				fields="{spcount:'包裹数量'}"
				gsql="
					SELECT '待处理包裹' as chna,
					COUNT(a.biid) AS spcount
					FROM obma a WHERE a.eddt>='2012-11-11' AND a.flag='11' OR a.flag='13'
					UNION ALL
					SELECT '已处理包裹' as chna,
					COUNT(a.biid) AS spcount
					FROM obma a WHERE a.eddt>='2012-11-11' and (a.flag='17' OR a.flag='19' OR a.flag='31')
				" />
		</f:view>
	</body>
</html>
