function table2(total,table_x,table_y,all_width,all_height,line_no)
{
//参数含义(传递的数组，横坐标，纵坐标，图表的宽度，图表的高度,折线条数)
//纯ASP代码生成图表函数2——折线图
//作者：龚鸣(Passwordgm) QQ:25968152 MSN:passwordgm@sina.com Email:passwordgm@sina.com
//本人非常愿意和ASP,VML,FLASH的爱好者在HTTP://topclouds.126.com进行交流和探讨
//版本1.0 最后修改日期 2003-8-11
//非常感谢您使用这个函数，请您使用和转载时保留版权信息，这是对作者工作的最好的尊重。
//***************************************************************************************
//修改说明：
//    本代码经原作者同意，由 awaysrain（绝对零度）修改为javascript。
//    最后修改日期 2003-9-22，测试环境为IE 6.0.2500.1106
//    因本人水平有限，修改中难免有错误，请大家及时指正。  
//***************************************************************************************
var line_color = "#69f";
var left_width = 70;
var total_no = total[1].length
var temp1,temp2,temp3
temp1 = 0;
for(var i=1;i<total_no;i++)
{
 for(var j=1;j<=line_no;j++)
 {
  if(temp1<total[j][i])
   temp1 = total[j][i];
 }
}
temp1 = parseInt(temp1);
if(temp1>9)
{
 temp2 = temp1.toString().substr(1,1);
 if(temp2>4)
 {
  temp3 = (parseInt(temp1/(Math.pow(10,(temp1.toString().length-1))))+1)*Math.pow(10,(temp1.toString().length-1));
 }
 else
 {
  temp3 = (praseInt(temp1/(Math.pow(10,(temp1.toString().length-1))))+0.5)*Math.pow(10,(temp1.toString().length-1))
 }
}
else
{
 if(temp1>4)
 {
  emp3 = 10; 
 }
 else
 {
  temp3 = 5;
 }
}
temp4 = temp3;
document.write("<v:rect id='_x0000_s1027' alt='' style='position:absolute;left:" + (table_x + left_width) + "px;top:" + table_y + "px;width:" + all_width + "px;height:" + all_height + "px;z-index:-1' fillcolor='#9cf' stroked='f'><v:fill rotate='t' angle='-45' focus='100%' type='gradient'/></v:rect>");
for(var i=0;i<all_height;i += all_height/5)
{
 document.write("<v:line id='_x0000_s1027' alt='' style='position:absolute;left:0;text-align:left;top:0;flip:y;z-index:-1' from='" + (table_x + left_width + length) + "px," + (table_y + all_height - length - i) + "px' to='" + (table_x + all_width + left_width) + "px," + (table_y + all_height - length - i) + "px' strokecolor='" + line_color + "'/>");
 document.write("<v:line id='_x0000_s1027' alt='' style='position:absolute;left:0;text-align:left;top:0;flip:y;z-index:-1' from='" + (table_x + (left_width - 15)) + "px," + (table_y + i) + "px' to='" + (table_x + left_width) + "px," + (table_y + i) + "px'/>");
 document.write("<v:shape id='_x0000_s1025' type='#_x0000_t202' alt='' style='position:absolute;left:" + table_x + "px;top:" + (table_y + i) + "px;width:" + left_width + "px;height:18px;z-index:1'>");
 document.write("<v:textbox inset='0px,0px,0px,0px'><table cellspacing='3' cellpadding='0' width='100%' height='100%'><tr><td align='right'>" + temp4 + "</td></tr></table></v:textbox></v:shape>");
 temp4 = temp4 - temp3/5;
}
document.write("<v:line id='_x0000_s1027' alt='' style='position:absolute;left:0;text-align:left;top:0;flip:y;z-index:-1' from='" + (table_x + left_width) + "px," + (table_y + all_height) + "px' to='" + (table_x + all_width + left_width) + "px," + (table_y + all_height) + "px'/>");
document.write("<v:line id='_x0000_s1027' alt='' style='position:absolute;left:0;text-align:left;top:0;flip:y;z-index:-1' from='" + (table_x + left_width) + "px," + table_y + "px' to='" + (table_x + left_width) + "px," + (table_y + all_height) + "px'/>");
var tmpStr = ""
for(i=1;i<=line_no;i++)
{
 var re  = /,/g;
 tmpStr += ",[\"" + total[i][0].replace(re,"\",\"") + "\"]"
}
tmpStr = tmpStr.substr(1,tmpStr.length-1)
var line_code = eval("new Array(" + tmpStr + ")")
for(var j=1;j<=line_no;j++)
{
 for(var i=1;i<total_no-1;i++)
 {
  var x1 = table_x + left_width + all_width * (i - 1)/(total_no-1)
  var y1 = table_y + (temp3 - total[j][i]) * (all_height/temp3)
  var x2 = table_x + left_width + all_width * i/(total_no-1)
  var y2 = table_y + (temp3 - total[j][i+1]) * (all_height/temp3)
  
  document.write("<v:line id='_x0000_s1025' alt='' style='position:absolute;left:0;text-align:left;top:0;z-index:1' from='" + x1 + "px," + y1 + "px' to='" + x2 + "px," + y2 + "px' coordsize='21600,21600' strokecolor='" + line_code[j-1][0] + "' strokeweight='" + line_code[j-1][1] + "'>");
  switch (parseInt(line_code[j-1][2]))
  {
   case 1:
    break;
   case 2:
    document.write("<v:stroke dashstyle='1 1'/>");
    break;
   case 3:
    document.write("<v:stroke dashstyle='dash'/>");
    break;
   case 4:
    document.write("<v:stroke dashstyle='dashDot'/>");
    break;
   case 5:
    document.write("<v:stroke dashstyle='longDash'/>");
    break;
   case 6:
    document.write("<v:stroke dashstyle='longDashDot'/>");
    break;
   case 7:
    document.write("<v:stroke dashstyle='longDashDotDot'/>");
    break;
  }
  
  document.write("</v:line>");
  
  switch (parseInt(line_code[j-1][3]))
  {
   case 1:
    break;
   case 2:
    document.write("<v:rect id='_x0000_s1027' style='position:absolute;left:" + (x1 - 2) + "px;top:" + (y1 - 2) + "px;width:4px;height:4px; z-index:2' fillcolor='" + line_code[j-1][0] + "' strokecolor='" + line_code[j-1][0] + "'/>");
    break;
   case 3:
    document.write("<v:oval id='_x0000_s1026' style='position:absolute;left:" + (x1 - 2) + "px;top:" + (y1 - 2) + "px;width:4px;height:4px;z-index:1' fillcolor='" + line_code[j-1][0] + "' strokecolor='" + line_code[j-1][0] + "'/>");
    break;
  } 
  
 }
  switch (parseInt(line_code[j-1][3]))
  {
   case 1:
    break;
   case 2:
    document.write("<v:rect id='_x0000_s1027' style='position:absolute;left:" + (x2 - 2) + "px;top:" + (y2 - 2) + "px;width:4px;height:4px; z-index:2' fillcolor='" + line_code[j-1][0] + "' strokecolor='" + line_code[j-1][0] + "'/>");
    break;
   case 3:
    document.write("<v:oval id='_x0000_s1026' style='position:absolute;left:" + (x2 - 2) + "px;top:" + (y2 - 2) + "px;width:4px;height:4px;z-index:1' fillcolor='" + line_code[j-1][0] + "' strokecolor='" + line_code[j-1][0] + "'/>");
    break;
  }
}
 
for(var i=0;i<total_no-1;i++)
{
 document.write("<v:line id='_x0000_s1027' alt='' style='position:absolute;left:0;text-align:left;top:0;flip:y;z-index:-1' from='" + (table_x + left_width + all_width * (i)/(total_no-1)) + "px," + (table_y + all_height) + "px' to='" + (table_x + left_width + all_width * (i)/(total_no-1)) + "px," + (table_y + all_height + 15) + "px'/>");
 document.write("<v:shape id='_x0000_s1025' type='#_x0000_t202' alt='' style='position:absolute;left:" + (table_x + left_width + all_width * (i)/(total_no-1)) + "px;top:" + (table_y + all_height) + "px;width:" + (all_width/(total_no-1)) + "px;height:18px;z-index:1'>");
 document.write("<v:textbox inset='0px,0px,0px,0px'><table cellspacing='3' cellpadding='0' width='100%' height='100%'><tr><td align='left'>" + total[0][i] + "</td></tr></table></v:textbox></v:shape>");
}
var tb_height = 30
document.write("<v:rect id='_x0000_s1025' style='position:absolute;left:" + (table_x + all_width + 20) + "px;top:" + table_y + "px;width:100px;height:" + (line_no * tb_height + 20) + "px;z-index:1'/>");
for(var i=0;i<line_no;i++)
{
 document.write("<v:shape id='_x0000_s1025' type='#_x0000_t202' alt='' style='position:absolute;left:" + (table_x + all_width + 25) + "px;top:" + (table_y + 10+(i) * tb_height) + "px;width:60px;height:" + tb_height + "px;z-index:1'>");
 document.write("<v:textbox inset='0px,0px,0px,0px'><table cellspacing='3' cellpadding='0' width='100%' height='100%'><tr><td align='left'>" + line_code[i][4] + "</td></tr></table></v:textbox></v:shape>");
 document.write("<v:rect id='_x0000_s1040' alt='' style='position:absolute;left:" + (table_x + all_width + 80) + "px;top:" + (table_y + 10+(i) * tb_height + 4) + "px;width:30px;height:20px;z-index:1' fillcolor='" + line_code[i][0] + "'><v:fill color2='" + line_code[i][0] + "' rotate='t' focus='100%' type='gradient'/></v:rect>");
}
}


function drawLine(x0, y0, x1, y1, color) {
	var rs = "<div style='position:absolute;height:15;width:25;font-size:12;top:"+(y0-20)+";left:"+(x0-20)+";'>("+x0+","+y0+")</div>"
	+"<div style='position:absolute;height:15;width:25;font-size:12;top:"+(y1-20)+";left:"+(x1-20)+";'>("+x1+","+y1+")</div>"
	+"<div style='background-color:" + color + ";height:5;width:5;top:"+(y0-2)+";left:"+(x0-2)
	+";position:absolute;line-height:5px;overflow:hidden;'></div><div style='background-color:"+color+";height:5;width:5;top:"
	+(y1-2)+";left:"+(x1-2)+";position:absolute;line-height:5px;overflow:hidden;'></div>";
	if (y0 == y1) {// 画横线
		rs += "<div style='background-color:"+color+";height:1;width:"+Math.abs(x1-x0)+";top:"+y0+";left:"+x0+";position:absolute;line-height:1px;overflow:hidden;'></div>";
	} else if (x0 === x1) {// 画竖线
		rs += "<div style='background-color:"+color+";width:1;height:"+Math.abs(y1-y0)+";top:"+y0+";left:"+x0+";position:absolute;line-height:1px;overflow:hidden;'></div>";
	} else {
		var lx = x1 - x0, ly = y1 - y0;
		var l = Math.sqrt(lx * lx + ly * ly), p, px, py;
		for ( var i = 0; i < l; i++) {
			p = i / l;
			px = x0 + lx * p;
			py = y0 + ly * p;
			rs += "<div style='width:1px;height:1px;top:"+py+";left:"+px+";position:absolute;background-color:"+color+";line-height:1px;overflow:hidden;'></div>";
		}
	}
	return rs;
}
function getline() {
	var x0 = $("x0");
	var y0 = $("y0");
	var x1 = $("x1");
	var y1 = $("y1");
	$("line").innerHTML += drawLine(x0.value * 1, y0.value * 1, x1.value * 1,
			y1.value * 1, $("color").value);
	x0.value = x1.value;
	y0.value = y1.value;
	x1.value = y1.value = "";
}
function delline() {
	$("line").innerHTML = "";
}
function $(id) {return document.getElementById(id); }

function start() {
	var x0 = $("x0");
	var y0 = $("y0");
	var x1 = $("x1");
	var y1 = $("y1");
	x0.setAttribute("isOK", "1");
	x0.value = y0.value = x1.value = y1.value = "";
	document.body.onmousemove = function() {
		if (x0.getAttribute("isOK") == "1") {
			x0.value = event.clientX;
			y0.value = event.clientY;
		} else {
			x1.value = event.clientX;
			y1.value = event.clientY;
		}
	}
	document.body.onclick = function() {
		if (x0.getAttribute("isOK") == "1") {
			x0.value = event.clientX;
			y0.value = event.clientY;
			if (x1.value.length != 0) {
				x0.setAttribute("isOK", "2");
			} else {
				x1.value = x0.value;
			}
		} else {
			x1.value = event.clientX;
			y1.value = event.clientY;
			getline();
		}
	}
	document.body.onkeyup = function() {
		$("x0").setAttribute("isOK", "1");
	}
}