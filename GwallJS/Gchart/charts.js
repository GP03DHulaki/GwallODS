var isIE = !+ [ 1, ] ? true : false;
var fdChartList = [];	//浮动要用有哪些图表对象
var pdt = null;		//pdt滚动条控制组件 
var fddiv = null; 	//浮动div组件
var ccTask = null;	//自动切换图表
var iPhone = navigator.userAgent.toLowerCase().indexOf("iphone") != -1;	//是不是通过iPhone浏览
if(iPhone){
	window.onload = function(){
		Charts.onload();
	}
}else{
	document.onreadystatechange = function(){
		if(document.readyState == "complete"){
			Charts.onload();
			initClickChart();	//初始化自动切换图表
		}
	}
}
var Charts = {
	Chart : function( id ){
		this.id = id;
		this.chart = null;
		this.ledend = null;
		this.showType = null;
		this.width = document.body.clientWidth;
		this.height = document.body.clientHeight;
		this.obj = document.getElementById(id);
		if(this.obj){
			this.obj.style.height = this.height;
		}
	},
	chartList : [],		//存放所有的chart对象,根据id为key取已有的chart对象
	/**
	 * 图表的入口
	 * @param id			编号				该图图表放入界面中的哪个ID对象中
	 * @param title			标题				图表的标题
	 * @param type			图表类型			pieChart,barChart,lineChart,serialChart
	 * @param time			请求间隔			ajax刷新的时间间隔
	 * @param key			主角				根据data这里的key=name
	 * @param fields		其他字段描述		{po:'采购单',so:'销售单',rn:'退货单'}
	 * @param data			数据				[{name:'张三',po:44,so:45,rn:88},{...},{...}]
	 * @return
	 */
	loadChart : function(id,title,type,time,key,fields,data){
		var chart = this.chartList[id];
		if(chart){	
			chart.dataProvider = data; 
			chart.validateData();		//更新数据
			//为了体现更新了.更改下3D效果.
			if(type === "pieChart"){
				 chart.depth3D = 0;			//去掉3D效果
				 chart.angle = 30;			//角度
				 chart.validateNow();		//更新配置设置
				 var change3D = new TimingTask(0.4,1,chart,function(chartObj){	//0.4秒后改回3D效果
					 var chart = chartObj.param;
					 chart.depth3D = 25;
					 chart.angle = 30;			//角度
					 chart.validateNow();		//更新配置设置
				 });
				 change3D.start();	//执行
			}
			
		}else{
			fdChartList.push({id:id,title:title,type:type,time:time});
			chart = new this.Chart(id);
			if(type === "pieChart"){
				var vfield;
				if(typeof fields === 'object'){
					for(var item in fields){
						vfield = item;
						break;
					}
				}else{
					vfield = fields;
				}
				chart.pieChart(title,data,key,vfield,false);
			}else
			if(type === "barChart"){
				chart.barChart(title,data,key,fields);
			}else
			if(type === "serialChart"){
				chart.serialChart(title,data,key,fields);
			}else
			if(type === "lineChart"){
				chart.lineChart(title,data,key,fields);
			}
		}
	},
	/**
	 * 初始化浮动div对象,平滑移动滚动条对象
	 */
	onload : function(){		
		if(iPhone){
			//不显示浮动div
			//滚动条滚动到一个图表的一半多一点的时候,自动定位到此图表的下一图表位置		
			fddiv = new FDdiv();
			pdt = new phydgdt();
			fddiv.obj.style.display = "none";
			window.onscroll = function(){	//滚动条滚动的时候
				alert(document.body.scrollTop);
			}
		}else{
			document.body.style.overflow = "hidden";
			fddiv = new FDdiv();
			pdt = new phydgdt();
			if(fdChartList.length > 0){
				fddiv.onclick(fdChartList[0].id);
			}
		}
	},
	/**
	 * 这里是Ajax更新指定图表
	 * @param id
	 * @param isAutoTask	是否定时任务
	 * @return
	 */
	ajaxUpdateChart : function( id, isAutoTask ){
		if(!isAutoTask){
			if(fddiv.task != null){
				fddiv.task.stop();		//终止定时刷新
			}
		}
		 var ajax = new Ajax();
	     ajax.post("?GchartID="+id,function(html){
			var si = html.indexOf("><script>Charts.loadChart(");
			if(si != -1){
				html = html.substring(si+9); //到Charts.loadChart位置
				var ei = html.indexOf(";</script></div>");
				if(ei != -1){
					html = html.substring(0,ei);
					eval(html);
					if(!isAutoTask){
						if(fddiv.task != null){
							fddiv.task.start();	//重新启动定时刷新
						}
					}
				}
			}
		 },function(state){
			 alert("请求错误:"+state);
		 });
	}
}
Charts.Chart.prototype = {
	/**
	 * 当数据更新时候
	 * 需要就实现这个方法
	 */	
	dataUpdated : null,
	/**
	 * 图表初始化完成后
	 */
	init : null,
	lineChart : function(title,data,key,fields){
		// SERIAL CHART
	    this.chart = new AmCharts.AmSerialChart();
	    this.chart.dataProvider = data;
	    this.chart.categoryField = key;
	    this.chart.startDuration = 0.5;
	    this.chart.balloon.color = "#000000";
	    this.chart.pathToImages = "../js/amcharts/images/";
	    // AXES
	    // category
	    var categoryAxis = this.chart.categoryAxis;
	    categoryAxis.fillAlpha = 1;
	    categoryAxis.fillColor = "#FAFAFA";
	    categoryAxis.gridAlpha = 0;
	    categoryAxis.axisAlpha = 0;
	    categoryAxis.gridPosition = "start";
	    // GRAPHS
	    // first graph
	    var graph = null;
	    for(var item in fields){
	    	graph = new AmCharts.AmGraph();
 	 	    graph.title = fields[item];
            graph.valueField = item;
            graph.balloonText = "[[title]]: [[value]] ([[percents]]%)";
            graph.lineAlpha = 1;
            graph.bullet = "round";
            this.chart.addGraph(graph);
	    }
	    // CURSOR
        var chartCursor = new AmCharts.ChartCursor();
        chartCursor.cursorPosition = "mouse";
        this.chart.addChartCursor(chartCursor);
        //Scrollbar
	    var chartScrollbar = new AmCharts.ChartScrollbar();
        chartScrollbar.color = "#000000";
        chartScrollbar.autoGridCount = true;
        this.chart.addChartScrollbar(chartScrollbar);
	    // LEGEND
	    var legend = new AmCharts.AmLegend();
	    legend.markerType = "circle";
	    this.chart.addLegend(legend);
	    this.chart.write(this.id);
	},
	/**
	 * 堆叠式线形填充图
	 * @param title	 图表的标题
	 * @param data	 数据		[{name:"张三",A:11,B:23,C:44},{name:"李四",A:44,B:46,C:97}];
	 * @param key	 主角		name
	 * @param fields 字段含义	{A:'销售单',B:'采购单',C:'退货单'}
	 * @return
	 */
	serialChart : function(title,data,key,fields){	
		this.obj = document.getElementById(this.id);
		if(this.obj.innerHTML.length > 0)this.obj.innerHTML = "";
		this.chart = new AmCharts.AmSerialChart();
		this.chart.pathToImages = "../js/amcharts/images/";
		this.chart.zoomOutButton = {
	        backgroundColor: "#000000",
	        backgroundAlpha: 0.15
	    };
		this.chart.dataProvider = data;
		this.chart.categoryField = key;		//数据中的组标志,	
		if(this.dataUpdated != null){
        	this.chart.addListener("dataUpdated", this.dataUpdated);	//数据更新时候
        }
        if(this.init != null){
        	this.chart.addListener("init",this.init);	//初始化后
        }
		//this.chart.addTitle(title, 15);	
	    // AXES
	    // Category
	    var categoryAxis = this.chart.categoryAxis;
	    categoryAxis.gridAlpha = 0.07;
	    categoryAxis.axisColor = "#DADADA";
	    categoryAxis.startOnAxis = true;
	    // Value
	    var valueAxis = new AmCharts.ValueAxis();
	    valueAxis.stackType = "100%";
	    valueAxis.gridAlpha = 0.07;
	    this.chart.addValueAxis(valueAxis);
	    // GRAPHS
	    // first graph
	    var graph = null;
	    for(var item in fields){
	    	graph = new AmCharts.AmGraph();
	 	    graph.type = "line"; 
	 	    graph.title = fields[item];
	 	    graph.valueField = item;
	 	    graph.balloonText = "[[title]]: [[value]] ([[percents]]%)";	//销售单: 11 (12.23%)
	 	    graph.lineAlpha = 0;
	 	    graph.fillAlphas = 0.6; 
	 	    this.chart.addGraph(graph);
	    }
	    // LEGEND
	    var legend = new AmCharts.AmLegend();
	    legend.align = "center";
	    this.chart.addLegend(legend);
	    // CURSOR
        var chartCursor = new AmCharts.ChartCursor();
        chartCursor.cursorPosition = "mouse";
        this.chart.addChartCursor(chartCursor);
	    //Scrollbar
	    var chartScrollbar = new AmCharts.ChartScrollbar();
	    chartScrollbar.color = "#000000";
        chartScrollbar.autoGridCount = true;
        this.chart.addChartScrollbar(chartScrollbar);
	    // CURSOR
	    var chartCursor = new AmCharts.ChartCursor();
	    chartCursor.zoomable = false; // as the chart displayes not too many values, we disabled zooming
	    chartCursor.cursorAlpha = 0;
	    this.chart.addChartCursor(chartCursor);		 
	    this.chart.write(this.id);
	    Charts.chartList[this.id] = this.chart;
	},
	/**
	 * 饼图
	 * @param title		标题
	 * @param data		数据			[{name:'张三',po:23},{name:'李四',po:16}];
	 * @param tFiled	文本字段		name
	 * @param vFiled	数值字段 	po
	 * @param isKX		是否空心		
	 * @return
	 */
	pieChart : function(title,data,tField,vFiled,isKX){
		this.obj = document.getElementById(this.id);
		if(this.obj.innerHTML.length > 0)this.obj.innerHTML = "";
		this.chart = new AmCharts.AmPieChart();
		//this.chart.addTitle(title, 15);	//标题          
		if(this.dataUpdated != null){
        	this.chart.addListener("dataUpdated", this.dataUpdated);	//数据更新时候
        }
        if(this.init != null){
        	this.chart.addListener("init",this.init);	//初始化后
        }
		this.chart.dataProvider = data;	//数据源
		this.chart.titleField = tField;	//绑定标题
        this.chart.valueField = vFiled;	//绑定值
	    this.chart.depth3D = 25;		//厚度
	    this.chart.angle = 30;			//角度
	    this.chart.sequencedAnimation = true;
	    this.chart.startEffect = "elastic";
	    if(isKX)this.chart.innerRadius = "20%";	//是否空心
        this.chart.startDuration = 1;	//动画速度 越大越慢
        this.chart.labelRadius = 30;
	    this.legend = new AmCharts.AmLegend();		//描述区域
	    this.legend.align = "center";
	    this.legend.markerType = "circle";
	    this.legend.switchType = "v";
	    this.chart.addLegend(this.legend);
	    this.chart.write(this.id);
	    Charts.chartList[this.id] = this.chart;
	},
	/**
	 * 3D柱状图
	 * @param title	 图表的标题
	 * @param data	 数据		[{name:"张三",A:11,B:23,C:44},{name:"李四",A:44,B:46,C:97}];
	 * @param key	 主角		name
	 * @param fields 字段含义	{A:'销售单',B:'采购单',C:'退货单'}
	 * @return
	 */
	barChart : function(title,data,key,fields,is3D){
		this.obj = document.getElementById(this.id);
		if(this.obj.innerHTML.length > 0)this.obj.innerHTML = "";
		 // SERIAL CHART
		this.chart = new AmCharts.AmSerialChart();
		this.chart.pathToImages = "../js/amcharts/images/";
        //this.chart.addTitle(title, 15);	//标题          
        this.chart.dataProvider = data;
        this.chart.categoryField = key;
        this.chart.plotAreaBorderAlpha = 0.2;
        this.chart.startDuration = 1;
        if(this.dataUpdated != null){
        	this.chart.addListener("dataUpdated", this.dataUpdated);	//数据更新时候
        }
        if(this.init != null){
        	this.chart.addListener("init",this.init);	//初始化后
        }
        // AXES
        // category
        var categoryAxis = this.chart.categoryAxis;		//X轴
        categoryAxis.gridAlpha = 0.1;
        categoryAxis.axisAlpha = 0;
        //categoryAxis.position = "top";		//显示在上方...如果显示在上方,就取消标题的显示.
        categoryAxis.gridPosition = "start";

        // value
        var valueAxis = new AmCharts.ValueAxis();
        valueAxis.stackType = "regular";
        valueAxis.gridAlpha = 0.1;
        valueAxis.axisAlpha = 0;
        this.chart.addValueAxis(valueAxis);

        var graph = null;
	    for(var item in fields){
	    	graph = new AmCharts.AmGraph();
	 	    graph.type = "column"; 
	 	    graph.title = fields[item];
	 	    graph.labelText = "[[value]]";
	 	    graph.valueField = item;
	 	    graph.balloonText = "[[title]]: [[value]] ([[percents]]%)";	//销售单: 11 (12.23%)
	 	    graph.lineAlpha = 0;
	 	    graph.fillAlphas = 0.6; 
	 	    this.chart.addGraph(graph);
	    }
	    
        // LEGEND                  
        var legend = new AmCharts.AmLegend();
        legend.borderAlpha = 0.2;
        legend.horizontalGap = 10;
        this.chart.addLegend(legend);
        // CURSOR
        var chartCursor = new AmCharts.ChartCursor();
        chartCursor.cursorPosition = "mouse";
        this.chart.addChartCursor(chartCursor);
        //Scrollbar
	    var chartScrollbar = new AmCharts.ChartScrollbar();
        chartScrollbar.color = "#000000";
        chartScrollbar.autoGridCount = true;
        this.chart.addChartScrollbar(chartScrollbar);
        this.chart.write(this.id); 
        Charts.chartList[this.id] = this.chart;
        if(is3D){
	        setTimeout((function(that){
	        	return function(){
		        	that.chart.depth3D = 25;		//厚度
		        	that.chart.angle = 30;			//角度
		        	that.chart.validateNow();		//更新修改后的配置
	        	}
	        })(this),1200);
        }
	},
	setData : function( data ){
		this.chart.dataProvider = data; 
		this.chart.validateData();		//更新数据
	},
	setField : function(title,value){
		this.chart.titleField = title;	//绑定标题
		this.chart.valueField = value;	//绑定值
		this.chart.validateNow();		//更新修改后的配置
	},
	show : function(){
		this.obj.style.display = "";
	},
	hide : function(){
		this.obj.style.display = "none";
	}
}
/**
 * 平滑移动滚动条
 * 如果是IE就直接跳吧.慢死了.
 */
var phydgdt = function(){
	this.w = document.body.scrollWidth;	//滚动条的总宽度
	this.h = document.body.scrollHeight;	//滚动条的总高度
	this.x = document.body.scrollLeft;	//滚动条横向位置
	this.y = document.body.scrollTop;	//滚动条纵向位置
	this.id = -1;
	this.list = [];
	this.isIE = !+ [ 1, ] ? true : false;
}
phydgdt.prototype = {
	start : function(type,to){
		if(this.id != -1){
			this.list.push({type:type,to:to});
			return "等待";
		}
		this.bool = to > (type === "x" ? this.x : this.y);	//是用加还是用减
		this.sd = 15;	//每次移动的大小
		this.time = 1;
		if(to < 0)to = 0;
		if(this.isIE){		//IE直接条
			if(this.type === "x"){
				scrollTo(to,this.y);
			}else{
				scrollTo(this.x,to);
			}
			fddiv.update();
			this.stop();
			return;
		}
		this.id = setInterval((function(param) {
			return function() {
				if(param.type === "x"){
					if(param.bool){
						param.x += param.sd;
						if(param.x < to){
							scrollTo(param.x,param.y);
						}else{
							scrollTo(to,param.y);
							param.stop();
						}
					}else{
						param.x -= param.sd;
						if(param.x > to){
							scrollTo(param.x,param.y);
						}else{
							scrollTo(to,param.y);
							param.stop();
						}
					}
				}else{
					if(param.bool){
						param.y += param.sd;
						if(param.y < to){
							scrollTo(param.x,param.y);
						}else{
							scrollTo(param.x,to);
							param.stop();
						}
					}else{
						param.y -= param.sd;
						if(param.y > to){
							scrollTo(param.x,param.y);
						}else{
							scrollTo(param.x,to);
							param.stop();
						}
					}
				}
				fddiv.update();
			}
		})(this), this.time)
	},
	stop : function(){
		if(this.id != -1){
			clearInterval(this.id);
			this.id = -1;
		}
		this.x = document.body.scrollLeft;	//滚动条横向位置
		this.y = document.body.scrollTop;	//滚动条纵向位置
		if(this.list.length > 0){
			var obj = this.list[0];
			this.list = this.list.slice(0,0).concat(this.list.slice(1,this.list.length));
			this.start(obj.type,obj.to);
		}
	},
	gotoObj : function( id ){
		if(id){
			var el = document.getElementById(id);
			var tl = el.offsetTop - 8;
			this.start("y",tl);
		}
	}
};
/**
 * 浮动div
 */
var FDdiv = function(){
	this.obj = document.createElement("div");
	this.task = null;	//记录上一个定时任务的对象.用于点击后,结束上个任务的执行.
	this.x = 20;
	this.y = 1;
	this.isIE = !+ [ 1, ] ? true : false;
	this.obj.style.bgcolor = "#CCCCCC";
	this.obj.align = "center";
	this.obj.style.position = "absolute";
	this.obj.style.left = this.x;
	this.obj.style.top = this.y;
	this.obj.style.width = document.body.offsetWidth - 20;
	this.obj.style.height = "20px";
	this.obj.style.border = "blue 1px solid";
	this.obj.innerHTML = "<table width='100%'><tr><td align='left'></td><td align='center'></td><td align='right'></td></tr></table>";
	this.leftObj = this.obj.childNodes[0].rows[0].cells[0];			//左边的td
	this.centerObj = this.obj.childNodes[0].rows[0].cells[1];		//中间的td
	this.rightObj = this.obj.childNodes[0].rows[0].cells[2];		//右边的td
	if(fdChartList.length > 0){
		var o;
		for(var i=0,j=fdChartList.length;i<j;i++){
			o = fdChartList[i];
			this.add(o.id,o.title,o.type);
		}
	}
	document.body.appendChild(this.obj);
}
FDdiv.prototype = {
	add : function( id, title, type ){
		var tl = type === "pieChart" ? "饼图" : type === "barChart" ? "柱状图" : "线形图";
		var html = '<span id=\'fd_'+id+'_span\' style="padding-right:30px;cursor:hand;" onmouseover="fddiv.onmover(this);"'
			+' onmouseout="fddiv.onmout(this);"><a title="查看'+title+'['+tl+']" style="text-decoration:none;"'
			+' heft="javascript:void(0);" onclick="fddiv.onclick(\''+id+'\')"><b>'+title+'</b></a></span>';
		var sp = document.createElement("span");
		sp.innerHTML = html;
		this.centerObj.appendChild(sp.childNodes[0]);
	},
	onmout : function(obj){
		if(obj.getAttribute("STATE")!="T"){
			obj.style.color = "";
		}
	},
	onmover : function(obj){
		obj.style.color = "red";
	},
	onclick : function(id){
		if(this.task != null){	//说明切换了几个,存在上次定时任务对象.需要终止.
			this.task.stop();	//终止上次的定时任务.
		}
		pdt.gotoObj(id);
		var temp;
		for(var i=0,j=fdChartList.length;i<j;i++){
			temp = document.getElementById("fd_"+fdChartList[i].id+"_span");
			if(fdChartList[i].id != id){
				temp.setAttribute("STATE","F");
				temp.style.color = "";
			}else{
				temp.setAttribute("STATE","T");
				temp.style.color = "red";
				var time = fdChartList[i].time;
				if(time != undefined && time > 0){
this.leftObj.innerHTML = "<span style='font-size:"+(this.isIE ? "12" : "10")+"'><b>重设间隔:</b><input id='GchartTimeID' style='height:"+
+(this.isIE ? "18" : "16")+"px;' type='text' size='1' value='"+time+"'/>"
+"<a style='text-decoration:none;cursor:hand;padding-right:3;' title='重新设置自动更新以下图表的时间间隔' href='javascript:void(0);' onclick='submitRTime(\""+id+"\")'><b>提交</b></a>"
+"<a style='text-decoration:none;cursor:hand;padding-left:3;' title='立即更新以下图表' href='javascript:void(0);' onclick='Charts.ajaxUpdateChart(\""+id+"\")'><b>立即更新</b></a></span>";
this.rightObj.innerHTML = "<a style='padding-right:4;text-decoration:none;cursor:hand;' heft='javascript:void(0)' title='点击我,自动切换图表'"
				+" onclick='startQH()'><b style='font-size:"+(fddiv.isIE ? "12" : "10")+"'>启动切换</b></a>&nbsp;"
				+"<a style='padding-right:4;text-decoration:none;cursor:hand;' heft='javascript:void(0)' title='点击我,停止切换图表'"
				+" onclick='stopQH()'><b style='font-size:"+(fddiv.isIE ? "12" : "10")+"'>停止切换</b></a>";
				}
			}
		};
		//开始进行定时刷新
		var l = fdChartList.length;
	    for(var i=0;i<l;i++){
	    	if(fdChartList[i].id === id){	//要求自动更新	
	    		this.task = new TimingTask(fdChartList[i].time,-1,fdChartList[i],function( obj ){
	    			Charts.ajaxUpdateChart(obj.param.id,true);	//更新指定ID的图表
	    		});
	    		this.task.start();	//启动定时任务
	    		break;
	    	}
	    }
	},
	update : function(){
		var t = document.body.scrollTop;	//滚动条纵向位置
		this.obj.style.top = this.y + t;
	}		
};
/**
 * 重置定时任务时间间隔
 * @return
 */
function submitRTime( id ){
	var temp;
	var time = document.getElementById("GchartTimeID").value*1;
	for(var i=0,j=fdChartList.length;i<j;i++){
		temp = fdChartList[i];
		if(temp.id === id){
			temp.time = time;
			fdChartList[i] = temp;
			fddiv.task.stop();
			fddiv.task.time = time*1000;
			fddiv.task.start();
			fddiv.rightObj.innerHTML = "<a style='padding-right:4;text-decoration:none;cursor:hand;' heft='javascript:void(0)' title='点击我,自动切换图表'"
				+" onclick='startQH()'><b style='font-size:"+(fddiv.isIE ? "12" : "10")+"'>启动切换</b></a>&nbsp;&nbsp;&nbsp;"
				+"<a style='padding-right:4;text-decoration:none;cursor:hand;' heft='javascript:void(0)' title='点击我,停止切换图表'"
				+" onclick='stopQH()'><b style='font-size:"+(fddiv.isIE ? "12" : "10")+"'>停止切换</b></a>";
			break;
		}
	}
}
/**
 * 这里是Ajax更新指定图表
 * @param id
 * @param isAutoTask	是否定时任务
 * @return
 */
function updateGchart( id, isAutoTask ){
	if(!isAutoTask){
		if(fddiv.task != null){
			fddiv.task.stop();		//终止定时刷新
		}
	}
	 var ajax = new Ajax();
     ajax.post("?GchartID="+id,function(html){
		var si = html.indexOf("</canvas><script>drawChart(");
		if(si != -1){
			html = html.substring(si+17); //到drawChart位置
			var ei = html.indexOf(";</script></div>");
			if(ei != -1){
				html = html.substring(0,ei);
				eval(html);
				if(!isAutoTask){
					if(fddiv.task != null){
						fddiv.task.start();	//重新启动定时刷新
					}
				}
			}
		}
	 },function(state){
		 alert("请求错误:"+state);
	 });
}
var chartIndex = 0;	//要切换哪个图表
/**
<<<<<<< .mine
 * 自动点击图表,定时切换图表
 */
var initClickChart = function(){
	ccTask = new TimingTask( 60 ,-1,null,function( obj ){
	    			fddiv.onclick(fdChartList[chartIndex].id);	//切换到哪个图表
	    			chartIndex++;
	    			if(chartIndex >= fdChartList.length) chartIndex = 0;
	    		});
	ccTask.start();	//启动定时任务
}
/*手动开始切换*/
function startQH(){
	if(ccTask == null){
		initClickChart();
		alert("启动自动切换图表成功!");
	}else{
		alert("已经是启动状态!");
	}
}
/*手动开始切换*/
function stopQH(){
	ccTask.stop();
	ccTask = null;
	alert("停止自动切换图表成功!");
}
/**
=======
 * 自动点击图表,定时切换图表
 */
var initClickChart = function(){
	ccTask = new TimingTask( 3 ,-1,null,function( obj ){
	    			fddiv.onclick(fdChartList[chartIndex].id);	//切换到哪个图表
	    			chartIndex++;
	    			if(chartIndex >= fdChartList.length) chartIndex = 0;
	    		});
	ccTask.start();	//启动定时任务
}
/*手动开始切换*/
function startQH(){
	if(ccTask == null){
		initClickChart();
		alert("启动自动切换图表成功!");
	}else{
		alert("已经是启动状态!");
	}
}
/*手动开始切换*/
function stopQH(){
	ccTask.stop();
	ccTask = null;
	alert("停止自动切换图表成功!");
}
/**
>>>>>>> .r3525
 * 定时任务
 * 间隔时间,执行次数,要带的参数,要执行的函数.
 */
var TimingTask = function(time,count,param,fun){
	this.id = -1;			//编号
	this.exectionCount = 0;	//执行了多少次
	if(typeof time === 'function'){
		this.fun = time;
		this.time = 3000;
		this.count = -1;
	}else
	if(typeof param === 'function'){
		this.time = time;
		this.count = count;
		this.fun = param;
	}else
	if(typeof count === 'function'){
		this.time = time*1000;
		this.fun = count;
		this.count = -1;
	}else{
		this.time = time*1000;
		this.count = count;
		this.param = param;
		this.fun = fun;
	}
}
TimingTask.prototype = {
	add : function(time,count,fun){	//间隔秒数,执行次数,执行方法
		if(typeof time === 'function'){
			this.fun = time;
		}else
		if(typeof count === 'function'){
			this.time = time;
			this.fun = count;			
		}else{
			this.time = time;
			this.count = count;
			this.fun = fun;
		}
	},
	start : function(){
		if(this.id === -1){	//说明还没开始
			this.exectionCount = 0;
			this.id = setInterval((function(param) {
				return function() {
					if(param.count > 0){
						if(param.exectionCount >= param.count){
							param.stop();
							return;
						}
					}
					param.exectionCount ++;
					param.fun(param);
				}
			})(this), this.time);
		}
	},
	stop : function(){
		clearInterval(this.id);
		this.id = -1;
	}
};
/**
 * Ajax
 */
var Ajax = function(){
	this.isIE = !+ [ 1, ] ? true : false;
	this.xmlHttpList = [];
};
Ajax.prototype = {
	ajaxConnection : 0,
	getXmlHttp : function( count ){
		count = count != undefined ? count : 5;
		var bool = this.xmlHttpList.length === 0,i;
		var length = bool ? count : this.xmlHttpList.length;
		for(i=0;i<length;i++){
			if(bool){
				this.xmlHttpList.push(this.isIE ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest()); 
			}else{
				if(this.ajaxConnection > length){//高并发时候,少了就添加连接
					this.xmlHttpList.push(this.isIE ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest());
					i = length;
					break;
				}
				if(this.xmlHttpList[i].readyState === 0)break;
			}
		}
		return this.xmlHttpList[ bool ? 0 : i ];
	},
	post : function(url,yesFun,noFun){
		this.ajax("post",url,yesFun,noFun);
	},
	get : function(url,yesFun,noFun){
		this.ajax("get",url,yesFun,noFun);
	},
	ajax : function(type,url,yesFun,noFun){
		var xmlHttp = this.getXmlHttp();
		xmlHttp.open(type, url, true);
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
				if( yesFun && typeof yesFun === 'function' ){
					yesFun( xmlHttp.responseText );
				}
				xmlHttp.abort();
				Ajax.ajaxConnection --;
			}else{
				if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
					if( noFun && typeof noFun === 'function' ){
						noFun( xmlHttp.readyState );
					}
					xmlHttp.abort();
					Ajax.ajaxConnection --;
				}
			}
		};
		xmlHttp.send(null);
	}
};
