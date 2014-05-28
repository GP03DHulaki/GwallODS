/**
 * 饼图对象
 * 使用方法:
 *  var dpiec = new DrawPieChart("GchartPie1");		//GchartPie1s是界面某个对象的ID
	dpiec.init("这里是标题",250);	//标题,数据,颜色,半径 
	dpiec.show(true);
 */
var DrawPieChart = function( id, W, H ){
	this.isIE = !+ [ 1, ] ? true : false;
	this.id = id ? id : new Data().getTime();
	this.obj = document.getElementById(this.id);
	var Gchart = document.getElementById("CS_"+id);
	if(this.obj == null || Gchart == null) return;
	if(!W || !H || W === "auto" || H === "auto"){
		W = document.body.clientWidth;
		W -= W % 100;
		H = document.body.clientHeight;
		H -= H % 100 + 10;
	}
	Gchart.width = W+50;
	Gchart.height = H+50;
	this.obj.style.position = "relative";
	this.dataList = [[],[],[]];		//0是分类,1是对应谁,2.0是第0个分类的第1个中的数据
	this.data = [5,30,15,4,20,18,23,12,21];
	this.colors = ["24,41,206", "198,0,148", "214,0,0", "255,156,0", "33,156,0", "33,41,107", "115,0,90", "132,0,0", "165,99,0", "24,123,0","255,204,0","64,128,128","153,204,0","102,102,255","51,51,153"];
	this.sum = 0;		//求和的
	this.DHID = -1;		//动画循环调用函数终止ID
	this.isDH = false;	//是否动画
	this.startAngle = 0.01;	//方向
	this.title = "标题描述";
	this.width = W;
	this.height = H;
	this.time = null;		//刷新间隔
	this.isShowText = true;		//动画 且  文本为div 的时候只显示一次
	this.sd = 20;		//速度
	this.R = 250;		//圆的半径
	this.ctx = Gchart.getContext("2d");	
	this.type = 0;
	window["GPie_"+this.id] = this;	//用于切换不同类型的饼图
};
DrawPieChart.prototype = {
	init : function( title, isDH, R, dataList, colors, time ){	
		this.title = title;
		this.isDH = isDH;
		if(time != undefined && time > 0) this.time = time;		//刷新间隔
		if(dataList) this.dataList = dataList;
		if(colors != null) this.colors = colors;
		if(R) this.R = R;
	},
	show : function( type, isloadok ){		//是否动画,哪个分类.默认0
		if(this.DHID != -1){ //在运动.先终止再调用.
			this.stopDH();
		}
		if(!isloadok)
			this.createDiv();	//如果是点击切换的话就不用执行了
		this.sum = 0;		
		if(!type)this.type = 0; else this.type = type;
		for(var j=0,l=this.dataList[2].length;j<l;j++)this.sum += this.dataList[2][j][this.type];
		if(this.isDH && !this.isIE){
			this.startDH();
		}else{
			this.draw(this.startAngle);
		}
	},
	createDiv : function(){	//创建提供触发改变显示类型饼图事件的div
		var types = this.dataList[0];
		var div,x = 30,y = 60;
		for(var i=0,j=types.length;i<j;i++){
			div = document.createElement("div");
			div.style.position = 'absolute';
			div.innerHTML = "<a style='text-decoration:none;' title='显示"+this.title+"的"+types[i]+"饼图' href='javascript:void(0);' onclick='javascript:window.GPie_"+this.id+".show("+i+",true)'>"+types[i]+"</a>";
			div.style.top = y+"px";
			div.style.left = x+"px";
			y += 30;
			this.obj.appendChild(div);
		}
	},
	draw : function( startAngle ){
		if(startAngle < 0) return;
		var l = this.dataList[1].length,endAngle;	
	    this.ctx.clearRect(-10, -10, this.width+10, this.height+10);	//要求动画,就清除
	    this.drawBG();
	    var grd,yx = this.R+150,yy = this.R+50,yr = this.R,r;		//grd渐变填充,yx,yy圆坐标,yr半径,r计算显示值位置用
	    var bw = 60,bh = 30,bx = yx+yr+150,by = yy-yr+50;	//标识区的框框大小和定位
	    var drate,cp;		//drate计算显示值位置用,cp保存显示值坐标
	    for(var i=0;i<l;i++){
	    	this.ctx.beginPath();
	        r = this.dataList[2][i][this.type] / this.sum;
			endAngle = startAngle + (Math.PI/180) * 360*r;
			this.ctx.moveTo(yx,yy);
			this.ctx.lineTo(yx+yr * Math.cos(startAngle),yy+yr * Math.sin(startAngle));
			this.ctx.arc(yx,yy,yr,startAngle,endAngle,false);
			this.ctx.closePath();
	        grd = this.ctx.createRadialGradient(yx,yy,startAngle,yx,yy,yr);
	        grd.addColorStop(0, "rgba(" + this.colors[i] + ",1)");
	        grd.addColorStop(0.9, "rgba(" + this.colors[i] + ",0.8)");
	        grd.addColorStop(1, "rgba(" + this.colors[i] + ",1)");
	        this.ctx.fillStyle = grd;
	        this.ctx.fill();   
	        this.ctx.stroke();
			if(r <= 0.04) {
				drate = 0.7;
			} else if(r <= 0.05) {
				drate = 0.8;
			} else if(r <= 0.1) {
				drate = 0.7;
			} else if(r <= 0.15) {
				drate = 0.65;
			} else if(r <= 0.2){
				drate = 0.7;
			} else {
				drate = 0.5;
			}
			cp = {
				x: yx + ((yr+50) * drate) * Math.cos( (startAngle + endAngle) / 2 ),
				y: yy + ((yr+50) * drate) * Math.sin( (startAngle + endAngle) / 2 )
			};
			if(this.isIE){
				if(this.isShowText){
					this.setText(cp.x,cp.y,this.dataList[2][i][this.type],"#FFFFFF",20);		//图中文本
					this.drawFK(grd,bx,by,bw,bh,1,"#000000",this.colors[i]);		//标识框
					this.setText(bx+bw+5,by+bh-6,(this.dataList[1][i])+" "+(this.dataList[2][i][this.type])+" 占总体 "+((r*100).toFixed(0))+"%","#000000",15);				//说明文本
				}	
			}else{
				this.setText(cp.x,cp.y,this.dataList[2][i][this.type],"#FFFFFF",20);		//图中文本
				this.drawFK(grd,bx,by,bw,bh,1,"#000000",this.colors[i]);		//标识框
				this.setText(bx+bw+5,by+bh-6,(this.dataList[1][i])+" "+(this.dataList[2][i][this.type])+" 占总体 "+((r*100).toFixed(0))+"%","#000000",15);				//说明文本
			}
	        startAngle = endAngle;	//继续下一个扇形
	        if(startAngle < 0) return;
	        //标识区
	        if(i === 0){
	        	if(this.isIE){
					if(this.isShowText){
	        			this.setText(bx,by-20 > 1 ? by-20 : by - 10,this.title+"("+this.dataList[0][this.type]+")","#000000",15);
					}
	        	}else{
	        		this.setText(bx,by-20 > 1 ? by-20 : by - 10,this.title+"("+this.dataList[0][this.type]+")","#000000",20);
		        }
		    }
		    by += bh+5;
	    }
	    if(this.isIE)this.isShowText = false;		//只显示一次
	},
	startDH : function(){
		var sp = this.startAngle,js = 0.3;	//js步长		
		this.DHID = setInterval((function(param) {
			return function() {
				if(sp > 2){
					sp+=js;
					js -= 0.01;
					if(js <= 0) {
						param.draw(sp,true);		//是最后一次动画
						clearInterval(param.DHID);
						param.DHID = -1;
						return;
					}
				}else{
					sp+=js;
				}
				param.draw(sp);
			}
		})(this), this.sd);
	},
	stopDH : function(){
		if(this.DHID != -1)	clearInterval(this.DHID);
	},
	drawFK : function(grd,x,y,w,h){				//方框
		this.ctx.beginPath();		// 结束上次画画操作 
		this.ctx.moveTo(x,y);		// 将画笔定位到坐标
		this.ctx.lineJoin = 'round';//平滑路径的结合点
		this.ctx.strokeStyle = 'rgba(0,0,255,0.5)';//线条样式
		this.ctx.fillStyle = grd;
		this.ctx.lineWidth = 1;
		this.ctx.lineTo(x+w,y); 	
		this.ctx.lineTo(x+w,y+h);
		this.ctx.lineTo(x,y+h);
		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.stroke();		
	},
	setText : function(x,y,text,color,size){	//文本
		if(this.isIE){	//是否IE  
			var div = document.createElement("div");
			div.style.position = "absolute";
			div.style.margin = div.style.padding = "0";
			div.style.left = x + "px";
			div.style.top = (y-20) + "px";
			div.style.whiteSpace = "nowrap";
			div.style.overflow = "hidden";
			if(!size)size=12;
			div.innerHTML = "<b style='font-size:"+size+";color:"+color+"'>"+text+"</b>";
			this.obj.appendChild(div);
		}else{
			this.ctx.beginPath();
			this.ctx.fillStyle = color ? color : "";
			this.ctx.font = (size ? size : 10)+"pt Calibri";
			this.ctx.fillText(text,x,y);
			this.ctx.stroke();
		}
	},
	drawBG : function(){	//大的圆角背景
		var lineWidth = 2,x=20,y=30,w=this.width,h=this.height-10;
		var tox=x+w-lineWidth,toy=y+h-lineWidth,bj = lineWidth+10,pi=Math.PI/2,mpi=Math.PI;
		this.ctx.beginPath();
		this.ctx.fillStyle = "#F9F9F9";
		this.ctx.lineWidth = lineWidth;
		this.ctx.strokeStyle = "#333333";
		this.ctx.arc( tox,y, bj, 3*pi,2*mpi, false);
	  	this.ctx.arc( tox,toy, bj, 0, pi, false);
		this.ctx.arc( x,toy, bj, pi, mpi, false);
		this.ctx.arc( x,y, bj,mpi, 3*pi, false);
		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.stroke();
	}	
};