var CanvasContext = null; //画画工具,初始值为null不难第一次就当作要加入列队了
var ChartList = [];		//按顺序执行
var IEChartList = [];   //IE收集等到载入完成后执行
var fdChartList = [];	//收集数据用于显示在浮动中.
var animationTime = 40;	//柱状图的动画时间
var scid = null,obj = null;	//上次id,对象 用于在设置文本的时候获取用.
var isIE = !+ [ 1, ] ? true : false;
var isLoadCanvas = true;	
var pdt = null;	//pdt滚动条控制组件 
var fddiv = null; 	//浮动div
var isAjaxRequest = false;	//是否进入了ajax请求阶段
/**
 * 画线条
 * @param x		起始位置
 * @param y	
 * @param tox	目标位置
 * @param toy
 * @param width	线条宽度
 * @param color	线条颜色
 * @return
 */
function drawLine(x,y,tox,toy,width,color){	
	CanvasContext.beginPath();		// 结束上次画画操作 
	CanvasContext.lineWidth = width ?　width : 1;			//线条宽度
	CanvasContext.strokeStyle = color ? color : "red";	//颜色
	CanvasContext.moveTo(x,y);		// 将画笔定位到坐标
	CanvasContext.lineTo(tox,toy); 	// 从定位开始到这个位置
	CanvasContext.stroke();			// 显示到浏览器上
}
/**
 * 画虚线
 * @param x		开始位置
 * @param y
 * @param tox	结束位置
 * @param toy
 * @param width	线宽度
 * @param color	颜色
 * @return
 */
function drawDottedLine(x,y,tox,toy,width,color){	
	CanvasContext.beginPath();		// 结束上次画画操作 
	CanvasContext.lineWidth = width ?　width : 1;			//线条宽度
	CanvasContext.strokeStyle = color ? color : "red";	//颜色
	var dashArray = [1, 2];        
    CanvasContext.moveTo(x, y);        
    var dx = (tox - x), dy = (toy - y);        
    var slope = dy/dx;
    var distRemaining = Math.sqrt(dx * dx + dy * dy);        
    var dashIndex = 0, draw = true;        
    while (distRemaining >= 0.1) {            
        var dashLength = dashArray[dashIndex++ % 2];            
        if (dashLength > distRemaining) dashLength = distRemaining;
        if(dx == 0){
            var signal = (toy > y ? 1 : -1);
            y += dashLength * signal;
        }else{
            var xStep = Math.sqrt(dashLength * dashLength / (1 + slope * slope));             
            var signal = (tox > x ? 1 : -1);             
            x += xStep * signal;            
            y += slope * xStep * signal;       
        }
        CanvasContext[draw ? 'lineTo' : 'moveTo'](x, y);    
        distRemaining -= dashLength;            
        draw = !draw;
    }    
	CanvasContext.stroke();			// 显示到浏览器上
}

/**
 * 画点
 * @param x		位置
 * @param y
 * @param type	Square表示方点,其他表示圆点
 * @param size	点的大小,适中2-5
 * @param lineWidth		线宽
 * @param lineColor		线颜色
 * @param fillColor		填充颜色,不传就空心
 * @return
 */
function drawPoint(x,y,type,size,lineWidth,lineColor,fillColor){
	if(type === "F"){//方点
		drawSquare(x,y,size,size,lineWidth,lineColor,fillColor);
	}else{	//圆点
		drawRound(x,y,size,lineWidth,lineColor,fillColor);
	}
}
/**
 * 画圆形
 * @param x		位置
 * @param y
 * @param radius	半径
 * @param lineColor	线条颜色
 * @param fillColor	填充颜色,不传就空心
 * @return
 */
function drawRound(x,y,radius,lineWidth,lineColor,fillColor){	
	CanvasContext.beginPath();		// 结束上次画画操作 
	CanvasContext.fillStyle = fillColor ? fillColor : "";
	CanvasContext.lineWidth = lineWidth ? lineWidth : 0;
	CanvasContext.strokeStyle = lineColor ? lineColor : "";
	CanvasContext.arc(x,y,radius,0,Math.PI * 2,true);		// 在指定位置画一个圆
	CanvasContext.closePath();
	fillColor ? CanvasContext.fill() : null;
	CanvasContext.stroke();			// 显示到浏览器上
}
/**
 * 画方形
 * @param x		位置
 * @param y
 * @param w		宽度
 * @param h		高度
 * @param lineWidth	线宽
 * @param lineColor	线颜色
 * @param fillColor	填充颜色,不传就空心
 * @return
 */
function drawSquare(x,y,w,h,lineWidth,lineColor,fillColor){		
	CanvasContext.beginPath();		// 结束上次画画操作 
	CanvasContext.moveTo(x,y);		// 将画笔定位到坐标
	CanvasContext.lineJoin = 'round';//平滑路径的结合点
	CanvasContext.strokeStyle = 'rgba(0,0,255,0.5)';//线条样式
	var grd = CanvasContext.createLinearGradient(x, y, x+w, y+h);
	grd.addColorStop(0, "rgba(" + fillColor + ",1)");
    grd.addColorStop(0.5, "rgba(" + fillColor + ",0.2)");
    grd.addColorStop(1, "rgba(" + fillColor + ",1)");
	CanvasContext.fillStyle = grd;
	CanvasContext.lineWidth = lineWidth ? lineWidth : 2;
	CanvasContext.lineTo(x+w,y); 	
	CanvasContext.lineTo(x+w,y+h);
	CanvasContext.lineTo(x,y+h);
	CanvasContext.closePath();
	CanvasContext.fill();
	CanvasContext.stroke();			// 显示到浏览器上
}
/**
 * 画文本
 * @param id 	父对象的编号	用于IE中用div定位显示
 * @param x		坐标
 * @param y	
 * @param text	内容
 * @param color	颜色
 * @param size	字体大小
 * @return
 */
function drawText(id,x,y,text,color,size){	
	if(isIE){	//是否IE  
		var div = document.createElement("div");
		div.style.position = "absolute";
		div.style.margin = div.style.padding = "0";
		div.style.left = x + "px";
		div.style.top = (y-10) + "px";
		div.style.whiteSpace = "nowrap";
		div.style.overflow = "hidden";
		if(!size)size=12;
		div.innerHTML = "<span style='font-size:"+size+";color:"+color+"'>"+text+"</span>";
		if(scid === id) obj.appendChild(div);
		else{
			obj = document.getElementById(id);
			scid = id;
			obj.appendChild(div)
		}
	}else{
		CanvasContext.beginPath();
		CanvasContext.fillStyle = color ? color : "#000000";
		CanvasContext.font = (size ? size : 10)+"pt Calibri";
		CanvasContext.fillText(text,x,y);
		CanvasContext.stroke();
	}
}
/**
 * 圆角框
 * @param x	位置
 * @param y
 * @param w	大小
 * @param h
 * @param lineWidth	线宽
 * @param lineColor	线颜色
 * @param fillColor	填充色
 * @return
 */
function drawYJ(x,y,w,h,lineWidth,lineColor,fillColor){	
	lineWidth = lineWidth ? lineWidth : 2;
	var tox=x+w-lineWidth,toy=y+h-lineWidth,bj = lineWidth+10,pi=Math.PI/2,mpi=Math.PI;
	CanvasContext.beginPath();
	CanvasContext.fillStyle = fillColor ? fillColor : "";
	CanvasContext.lineWidth = lineWidth;
	CanvasContext.strokeStyle = lineColor ? lineColor : "";
	CanvasContext.arc( tox,y, bj, 3*pi,2*mpi, false);
  	CanvasContext.arc( tox,toy, bj, 0, pi, false);
	CanvasContext.arc( x,toy, bj, pi, mpi, false);
	CanvasContext.arc( x,y, bj,mpi, 3*pi, false);
	CanvasContext.closePath();
	fillColor ? CanvasContext.fill() : null;
	CanvasContext.stroke();
}
/**
 * 图表
 * @param X		位置
 * @param Y
 * @param W		宽度
 * @param H		高度
 * @param title		图表的标题
 * @param dataList	数据[ [X轴], [目标], [数据], [颜色] ]
 * @param type		显示什么图表:barchart柱状图,pieChart饼图,lineChart线形图
 * @param time 		柱状图的时候所带的参数:动画时间
 * @param isAjax	是否ajax请求
 * @return
 */
function drawChart(gid,X,Y,W,H,title,dataList,type,time,isAjax){
	//如果是ajax请求.特殊处理
	if(isIE && isAjax){	//HTML5是重新画图,其他的要删除原来的div文字.再画
		var div = document.getElementById(gid);
		var list = div.childNodes;
		for(var i=0,j=list.length;i<j;i++){
			if(list[i].tagName === "DIV"){	//在不支持HTML5的情况下,是用div定位来显示文本的.所以在ajax请求后,需要删除原有的.重新创建.
				div.removeChild(list[i]);
				j--;i=0;
			}
		}
	}
	if(!isAjax && isLoadCanvas && typeof gid != 'object'){	//借用下isLoadCanvas, 只要收集一次就行了.之后的调用就不要收集了. ajax就不需要加入了,重复了.
		fdChartList.push({id:gid,title:title,type:type,time:time});
	}
	if(isIE && isLoadCanvas){ //全部收集过来,然后等到界面全部载入完成后,就开始执行.因为excanvas.js要求载入完成后再执行.
		IEChartList.push({id:gid,X:X,Y:Y,W:W,H:H,title:title,dataList:dataList,type:type,time:time});
		return "等待canvas装载后执行";
	}
	if(type === "pieChart" || (typeof gid === 'object' && gid.type === "pieChart")){	//饼图是独立的一个组件.可以单独处理,不用加入到列队中等待执行.
		var id = gid.id ? gid.id : gid;
		var tl = gid.title ? gid.title : title;
		var tm = gid.time ? gid.time : time;
		var dl = gid.dataList ? gid.dataList : dataList;
		var R = isIE ? 220 : 250;
		var dpiec = new DrawPieChart(id);
		dpiec.init(tl,true,R,dl,null,tm);	//标题,动画,半径,数据,颜色,刷新间隔
		dpiec.show(0);	//0表示显示类型中的第0个 [X轴]
		return {dataList:dl};
	}	
	var Gchart = null,id = null;
	if(CanvasContext != null){	//说明已经有程序在画画了.去列队中等待!
		if(typeof gid === 'object' && X == undefined){
			ChartList.push(gid);
		}else{
			ChartList.push({id:gid,X:X,Y:Y,W:W,H:H,title:title,dataList:dataList,type:type,time:time});
		}
		return "已加入列队!";
	}else{
		if(typeof gid === 'object' && X == undefined){//从列队中来的
			X = gid.X;
			Y = gid.Y;
			W = gid.W == undefined ? "auto" : gid.W;
			H = gid.H == undefined ? "auto" : gid.H;
			title = gid.title;
			dataList = gid.dataList;
			type = gid.type;
			time = gid.time;
			id = gid.id;
		}else{
			id = gid;
		}
	}
	Gchart = document.getElementById("CS_"+id);
	if(W === "auto" || H === "auto"){
		W = document.body.clientWidth;
		W -= W % 100;
		H = document.body.clientHeight;
		H -= H % 100 + 10;
	}
	Gchart.width = W+50;
	Gchart.height = H+50;
	var obj = document.getElementById(id);
	obj.style.position = "relative";
	CanvasContext = Gchart.getContext("2d");
	if(dataList[3].length != dataList[2].length){
		var temp = ["255,0,0","0,255,0","0,0,255","255,0,255","102,0,255","0,255,255","128,128,0","255,255,0","128,64,64","255,204,0",
		            "64,128,128","153,204,0","102,102,255","51,51,153"];
		dataList[3] = [];
		for(var i=0,j=dataList[2].length;i<j;i++){
			if(i > 14){
				alert("单列最多只显示14条数据,请调整获的到数据方法!");
				break;
			}
			dataList[3].push(temp[i]);
		}
	}
	var xlist = dataList[0],ylist = dataList[1],data = dataList[2];
	var Mx = X+10,My = Y+H-20,Mw = W-20,Mh = 10;
	var Xx = Mx+20,Xy = My-50,Xw = Mw+Xx - 15,Xh = Xy;
	var Yw =  Xx,Yh = Y+20;
	var Tx = Mw/2-title.length-20,Ty = Y+10;	
	var sx = X+30,sy = H-24, ssy = H-20;
	drawYJ(X,Y,W,H,2,"#333333","#F9F9F9");	//大的圆角背景
	if(isIE){
		title = "<b>"+title+"</b>";
	}
	drawText(id,Tx,Ty,title,"#000000",18);		//标题
	drawLine(Xx,Xy,Yw,Yh,2,"blue");		//Y轴
	drawLine(Xx,Xy,Xw,Xh,2,"red");		//X轴
	drawYJ(Mx,My,Mw,Mh,2,"#FFCC99","#FFFFCC");	//表说明区	
	var max=0;
	for(var i=0,j=data.length;i<j;i++){
		for(var k=0,b=data[i].length;k<b;k++){
			if(data[i][k] > max){
				max = data[i][k];
			}
		}
	}
	max += 20; //20是 (38+2)/2 虚线间隔的一半,使之总比最多大值高一点.
	var XtdW,YtdH = 38;
	var length = H/(YtdH+2) - 1;	//Y轴分隔数量,减二是多出了显示区域
	var value = Math.ceil(max/(length-1));
	for(var i=0;i<length;i++){
		if(i!=0){//从Y.0开始到Y.N
			drawLine(Xx,Xy-(i*YtdH),X+20,Xy-(i*YtdH),1,"blue");			//分隔短线
			drawText(id,X-6,Xy-(i*YtdH)+4,i*value);								//分隔数值
			drawDottedLine(Xx,Xy-(i*YtdH),Xw,Xy-(i*YtdH),1,"#999999");	//虚线
		}else{
			drawText(id,X,Xy,0);
		}
	}
	length = xlist.length;	//X轴分隔数量.减一是多出了显示区域
	XtdW = Mw / length - 10;
	var tl = 0;
	for(var j=1;j<=length;j++){	//第0个不要
		drawLine(Xx+(j*XtdW),Xy,Xx+(j*XtdW),Xy+10,1,"red");	//分隔线
		tl = xlist[j-1].length;
		if(tl > 15) tl+=3; else if(tl < 5) tl-=1;			//X轴的文字显示位置问题.
		drawText(id,Mx+(j*XtdW)-(tl*10),Xy+22,xlist[j-1]);				//分隔值  (xlist[j-1].length*10-10)表示 4个字就是40-10=30 预留宽度
	}
	CanvasContext.save();	//保存画布区域
	//下面进行具体画图表
	var obj = {id:id,Xx:Xx,Xy:Xy,value:value,XtdW:XtdW,YtdH:YtdH,dataList:dataList};
	if(type === "barChart"){		//柱状图,有动画效果
		drawChartColumn(obj);
	}else
	if(type === "lineChart"){		//线形图,从零点画线
		drawChartLine(obj);
	}else
	if(type === "line2Chart"){		//线形图2,不从0点开始画线
		obj.startX = true;
		drawChartLine(obj);
	}
	return obj; 
}
/**
 * 画柱状图
 * @param Xx
 * @param Xy
 * @param value
 * @param XtdW
 * @param YtdH
 * @param dataList
 * @return
 */
function drawChartColumn( obj ){
	var xw = obj.XtdW+50;
	var x = 50, y = 0,kx,ky;
	var data = obj.dataList[2];
	var l,zw,tt,xx;	//xx开始绘画的目标位置
	var jj = 30,xk = 20;	//jj柱子的间距  xk柱子的宽度   它们的关系是 jj总是比xk 大于 10
	var data1 = obj.dataList[0].length;		//分类的数量.如果是1个,那就特殊显示在中间.
	if(data1 === 1){
		jj = obj.XtdW >= 1180 ? 80 : 50;
		xk = jj - 10;
	}else{
		if(data1 === 2){
			jj = obj.XtdW >= 600 ? 50 : 30;
			xk = jj - 10;
			if(jj === 50){
				if(obj.dataList[2].length < 11){
					jj = 70;
					xk =  60;
				}else
				if(obj.dataList[2].length > 11){
					jj = 45;
					xk = 35;
				}
			}
		}
	}
	var runFunList = "",fun = "";
	for(var i=0;i<data.length;i++){
		kx =obj.Xx;ky=obj.Xy;
		l = data[i].length; 
		zw = ((l-i)*jj)+jj;		
		for(var j=0;j<l;j++){
			x = (xw)*(j+1)-(j*50);
			y = Math.round(obj.Xy - (data[i][j] / obj.value * obj.YtdH)); //X轴位置  - 原始值  / Y轴分隔间距大小 * Y轴实际分隔大小 = 转换实际值到图表中坐标值 
			if(j === 0){	kx = x;ky = y; 		}
			xx = x-zw;
			if(xx - 300 > 50){		//在宽度很宽的情况下减掉300
				xx -= 320;
				if(data1 === 1){
					xx -= obj.XtdW >= 1180 ? 720 : 500;
				}else
				if(data1 === 2){
					xx -= 110;
					if(obj.dataList[2].length < 10){
						xx += 100;
					}
				}
			}
			fun = "drawSquare("+xx+","+y+","+xk+","+(obj.Xy-y-2)+",1,'"+obj.dataList[3][i]+"','"+obj.dataList[3][i]+"')";			
			if(data1 === 1) xx += 25;//上面剪掉了1000,柱子的宽度很宽了,要把文字显示调整下.
			else
				if(data1 === 2) xx += 10;
			fun += ";drawText('"+obj.id+"',"+(xx-5)+","+(y-8)+","+data[i][j]+",'#000000')";
			if(runFunList.length > 5) runFunList += "@";
			runFunList+=fun;
			kx = x;
			ky = y;
		}
	}
	addExplain(obj.id,obj.Xx, obj.Xy ,"F", obj.dataList);	
	lazyRunFun(runFunList);
}
/**
 * 延迟执行动画,完成后2秒执行保存并清除
 * @param Rlist
 * @return
 */
function lazyRunFun( lists ){
	var list = lists.split("@");
	setTimeout(list[0],1);
	lists = "";
	for(var i=1,l=list.length;i<l;i+=1){
		if(lists.length > 5) lists += "@";
		lists += list[i];
	}
	if(lists.length > 5){
		setTimeout("lazyRunFun(\""+lists+"\")",animationTime);
	}else{
		setTimeout("saveCanvas()",100);	//0.1秒后保存并清空,延迟保存清空是因为有可能还在执行画画.
	}
}
/**
 * 保存画布继续下一位
 * @return
 */
function saveCanvas(){
	CanvasContext.save();			// 保存操作
	CanvasContext = null;
	if(ChartList.length > 0){
		var obj = ChartList[0];
		ChartList = ChartList.slice(0,0).concat(ChartList.slice(1,ChartList.length));
		var y = document.getElementById(obj.id).offsetTop - 8;
		pdt.start("y",y);
		drawChart(obj);
	}else{
		if(!isAjaxRequest){	//进入ajax定时任务阶段.就不需要加载完成后,跳转到第一个图表了.
			fddiv.onclick(document.getElementById("fd_"+fdChartList[0].id+"_span"),fdChartList[0].id);	//滑倒第一个去.
			isAjaxRequest = true;
		}
	}
}
/**
 * 画线型图
 * @param Xx	图表的起点,也就是X轴的开始位置
 * @param Xy	图表的宽度,也就是X轴的线条的位置
 * @param value	Y轴的分隔间距表示大小
 * @param XtdW	X轴的分隔间距大小
 * @param YtdH	Y轴的分隔间距实际大小
 * @param dataList	这里只用到dataList[2]数据,dataList[3]颜色.
 * @param startX 是否从X开始默认不是
 * @return
 */
function drawChartLine( obj ){
	var xw = obj.XtdW+50;
	var x = 50, y = 0,kx,ky;	
	var data = obj.dataList[2];
	var jj = 20;
	for(var i=0;i<data.length;i++){
		kx =obj.Xx;
		ky=obj.Xy;
		l = data[i].length;	
		for(var j=0;j<l;j++){
			x = (xw)*(j+1)-(j*50);
			y = Math.round(obj.Xy - (data[i][j] / obj.value * obj.YtdH)); //X轴位置  - 原始值  / Y轴分隔间距大小 * Y轴实际分隔大小 = 转换实际值到图表中坐标值 
			if(obj.startX && j === 0){	kx = x;ky = y;  }  			
			drawLine(kx,ky,x,y,1,obj.dataList[3][i]);
			drawPoint(x,y,"",3,2,obj.dataList[3][i]);
			drawText(obj.id,x-8,y-8,data[i][j],obj.dataList[3][i],10);
			kx = x;
			ky = y;
		}
	}
	addExplain(obj.Xx, obj.Xy ,"X", obj.dataList);
}
/**
 * 图表说明
 * @param Xx	X轴位置	用于定位说明区域
 * @param Xy
 * @param type 	图表格式,F柱状,X线型,B饼图
 * @param dataList	数据
 * @return
 */
function addExplain(id, Xx, Xy, type, dataList ){
	var vx = Xx - 10, vy = Xy + Xx+3;
	for(var i=0;i<dataList[2].length;i++){
		if(type === "X"){
			drawLine(vx,vy,vx+=10,vy,1,dataList[3][i]);
			drawPoint(vx,vy,type,3,2,dataList[3][i]);
			drawLine(vx,vy,vx+=10,vy,1,dataList[3][i]);
			drawText(id,vx+5,vy+4,dataList[1][i],"#000000",isIE ? 12 : 10);
			vx+=80;
		}else
		if(type === "F"){
			drawPoint(vx+=10,vy-2,"F",8,2,dataList[3][i],dataList[3][i]);
			drawText(id,vx+14,vy+6,dataList[1][i],"#000000",isIE ? 12 : 10);
			vx+=80;
		}
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
			+' heft="javascript:void(0);" onclick="fddiv.onclick(this,\''+id+'\')"><b>'+title+'</b></a></span>';
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
	onclick : function(obj,id){
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
+"<a style='text-decoration:none;cursor:hand;padding-left:3;' title='立即更新以下图表' href='javascript:void(0);' onclick='updateGchart(\""+id+"\")'><b>立即更新</b></a></span>";
this.rightObj.innerHTML = "<a style='padding-right:4;text-decoration:none;cursor:hand;' heft='javascript:void(0)' title='点击我,立即更新当前图表'"
+" onclick='updateGchart(\""+id+"\")'><b style='font-size:"+(this.isIE ? "12" : "10")+"'>每隔["+time+"]秒自动更新</b></a>";
				}
			}
		};
		//开始进行定时刷新
		var l = fdChartList.length;
	    for(var i=0;i<l;i++){
	    	if(fdChartList[i].id === id){	//要求自动更新	
	    		this.task = new TimingTask(fdChartList[i].time,-1,fdChartList[i],function( obj ){
	    			updateGchart(obj.param.id,true);	//更新指定ID的图表
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
			fddiv.rightObj.innerHTML = "<a style='padding-right:4;text-decoration:none;cursor:hand;' heft='javascript:void(0)' title='点击我,立即更新当前图表'"
				+" onclick='updateGchart(\""+id+"\")'><b style='font-size:"+(fddiv.isIE ? "12" : "10")+"'>每隔["+time+"]秒自动更新</b></a>";
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
/**
 * 定时任务
 * 给个时间,给个方法,周期去调用方法.
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
						if(param.exectionCount > param.count){
							param.stop();
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
/**
 * 如果是IE就收集调用,待载入完成后一起调用.
 * 不能覆盖原有的载入完成函数
 * @return
 */
function onload(){
	fddiv = new FDdiv();
	document.body.style.overflow = "hidden";
	 pdt = new phydgdt();
	 var l = IEChartList.length;
     if(isIE && l > 0){
    	 isLoadCanvas = false;
	   	 for(var i=0;i<l;i++){
	   		drawChart( IEChartList[i] ); 
	   	 }
	   	 IEChartList = [];
     }
}
