<%@ page contentType="text/html; charset=UTF-8"%>
<%@ include file="../include/include_imp.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>公告信息</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="公告信息">
		<script>parent.Gskin.setSkinCss(document);</script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/DatePicker/WdatePicker.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/amcharts/amstock.js"></script>
		<script src="<%=request.getContextPath()%>/GwallJS/Gchart/charts.js"
			type="text/javascript"></script>
		<link rel="stylesheet"
			href="<%=request.getContextPath()%>/js/amcharts/style.css"
			type="text/css">
	</head>
	<script type="text/javascript">
		function doView(parm){
			document.getElementById("list:id").value=parm;
			var itemBut=document.getElementById("list:wid");
			itemBut.click();
		}
		
		function clearData(){ 
	   		if(document.getElementById('list:strat_date')!=null)
	     		document.getElementById('list:strat_date').value="";
	   		if(document.getElementById('list:end_date')!=null)
	   			document.getElementById('list:end_date').value="";
	   		if(document.getElementById('list:search_vc_substance')!=null){
	   			document.getElementById('list:search_vc_substance').value="";
	   			document.getElementById("list:search_vc_substance").focus();
	   		}
	   		if(document.getElementById("list:id")!=null)
	   			document.getElementById("list:id").value="";
		}
		
		function checkList(){
			var startDate =document.getElementById("list:strat_date").value;
			var enddate =document.getElementById("list:end_date").value;

			if(startDate.Trim().length > 0 && enddate.Trim().length > 0){
				if(enddate<=startDate){
					alert("结束日期应大于开始日期!!");
					document.getElementById("list:strat_date").value="";
					document.getElementById("list:end_date").value="";
					document.getElementById("list:strat_date").focus();
					return false;
				}
			}
			return true;
		}
		
		String.prototype.Trim=function(){
			return this.replace(/(^\s*)|(\s*$)/g, "");
		}
		
		String.prototype.LTrim = function(){
			return this.replace(/(^\s*)/g, ""); 
		}
		
		String.prototype.RTrim = function(){
			return this.replace(/(\s*$)/g, "");
		} 
	</script>

	<script type="text/javascript">
		AmCharts.ready(function () {
			generateChartData();
			createStockChart();
		});

		var chartData = [];
		var chart;

		function generateChartData() {
			var firstDate = new Date(2012, 0, 1);
			firstDate.setDate(firstDate.getDate() - 500)
			firstDate.setHours(0, 0, 0, 0);

			for (var i = 0; i < 500; i++) {
				var newDate = new Date(firstDate);
				newDate.setDate(newDate.getDate() + i);

				var value = Math.round(Math.random() * (40 + i)) + 100 + i;

				chartData.push({
					date: newDate,
					value: value
				});
			}
		}


		function createStockChart() {
			chart = new AmCharts.AmStockChart();
			chart.pathToImages = "../js/amcharts/images/";

			// DATASETS //////////////////////////////////////////
			var dataSet = new AmCharts.DataSet();
			dataSet.color = "#b0de09";
			dataSet.fieldMappings = [{
				fromField: "value",
				toField: "value"
			}];
			dataSet.dataProvider = chartData;
			dataSet.categoryField = "date";

			chart.dataSets = [dataSet];

			// PANELS ///////////////////////////////////////////                                                  
			var stockPanel = new AmCharts.StockPanel();
			stockPanel.showCategoryAxis = true;
			stockPanel.title = "订单量";
			stockPanel.eraseAll = false;

			var graph = new AmCharts.StockGraph();
			graph.valueField = "value";
			graph.bullet = "round";
			stockPanel.addStockGraph(graph);

			var stockLegend = new AmCharts.StockLegend();
			stockLegend.valueTextRegular = " ";
			stockLegend.markerType = "none";
			stockPanel.stockLegend = stockLegend;
			stockPanel.drawingIconsEnabled = true;

			chart.panels = [stockPanel];


			// OTHER SETTINGS ////////////////////////////////////
			var scrollbarSettings = new AmCharts.ChartScrollbarSettings();
			scrollbarSettings.graph = graph;
			scrollbarSettings.updateOnReleaseOnly = true;
			chart.chartScrollbarSettings = scrollbarSettings;

			var cursorSettings = new AmCharts.ChartCursorSettings();
			cursorSettings.valueBalloonsEnabled = true;
			chart.chartCursorSettings = cursorSettings;


			// PERIOD SELECTOR ///////////////////////////////////
			var periodSelector = new AmCharts.PeriodSelector();
			periodSelector.position = "bottom";
			periodSelector.periods = [{
				period: "DD",
				count: 10,
				label: "10天"
			}, {
				period: "MM",
				count: 1,
				label: "1个月"
			}, {
				period: "YYYY",
				count: 1,
				label: "1年"
			}, {
				period: "YTD",
				label: "一天"
			}, {
				period: "MAX",
				label: "全部"
			}];
			chart.periodSelector = periodSelector;

			var panelsSettings = new AmCharts.PanelsSettings();
			chart.panelsSettings = panelsSettings;

			//chart.write('chartdiv');
		}
		
		function setData(){
        	var data = $('edit:jsonData').innerHTML;
        	chartData = eval("("+data+")");
        	for(var i=0;i<chartData.length;i++){
        		chartData[i].date = new Date(chartData[i].date);
        	}
        	chart.dataProvider = chartData;
        	chart.validateData();
        	createStockChart();
        	//chart.animateAgain();
        }
	</script>

	<body id=mmain_body onload="clearData();">
		<f:view>
			<h:form id="edit">
				<DIV>
					<div id="chartdiv" style="width: 100%; height: 600px;"></div>
					<table align="center" cellspacing="20" style="display: none;">
						<tr>
							<td>
								<input type="radio" checked="true" name="group" id="rb1"
									onclick="setLabelPosition()">
								外部说明
								<input type="radio" name="group" id="rb2"
									onclick="setLabelPosition()">
								内部说明
							</td>
							<td>
								<input type="radio" name="group2" id="rb3" onclick="set3D()">
								3D
								<input type="radio" checked="true" name="group2" id="rb4"
									onclick="set3D()">
								2D
							</td>
							<td>
								图例类型:
								<input type="radio" checked="true" name="group3" id="rb5"
									onclick="setSwitch()">
								x
								<input type="radio" name="group3" id="rb6" onclick="setSwitch()">
								v
							</td>
						</tr>
					</table>
				</DIV>
			</h:form>
		</f:view>
	</body>
</html>