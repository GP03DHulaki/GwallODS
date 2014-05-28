document.writeln('<div id=yyDateLayer style="position:absolute; width:142; height:166; z-index:9998; display:none">');
document.writeln('<span id=tmpSelectYearLayer style="z-index: 9999;position: absolute;top: 2; left: 18;display: none"></span>');
document.writeln('<span id=tmpSelectMonthLayer style="z-index: 9999;position: absolute;top: 2; left: 75;display: none"></span>');
document.writeln('<table border=0 cellspacing=1 cellpadding=0 width=142 height=160 bgcolor=#808080 onselectstart="return false">');
document.writeln('  <tr><td width=142 height=23 bgcolor=#FFFFFF><table border=0 cellspacing=1 cellpadding=0 width=140 height=23>');
document.writeln('      <tr align=center><td width=20 align=center bgcolor=#808080 style="font-size:12px;cursor: pointer;color: #FFD700" ');
document.writeln('        onclick="yyPrevM()" title="\u5411\u524d\u7ffb\u6708" onReg=y><b onReg=y>&lt;&lt;</b>');
document.writeln('        </td><td width=100 align=center style="font-size:12px;cursor:default" onReg=y>');
document.writeln('        <span onReg=y id=yyYearHead onclick="tmpSelectYearInnerHTML(this.innerText)"></span>&nbsp;\u5e74&nbsp;<span');
document.writeln('         id=yyMonthHead onReg=y onclick="tmpSelectMonthInnerHTML(this.innerText)"></span>&nbsp;\u6708</td>');
document.writeln('        <td width=20 bgcolor=#808080 align=center style="font-size:12px;cursor: pointer;color: #FFD700" ');
document.writeln('         onclick="yyNextM()" title="\u5f80\u540e\u7ffb\u6708" onReg=y><b onReg=y>&gt;&gt;</b></td></tr>');
document.writeln('    </table></td></tr>');
document.writeln('  <tr><td width=142 height=18 bgcolor=#808080>');
document.writeln('	<table border=1 cellspacing=0 cellpadding=0 width=140 height=1 style="cursor:pointer>');
document.writeln('	<tr align=center><td style="font-size:12px;color:#FFFFFF" onReg=y onmouseover="this.style.color=\'#0000FF\'" onmouseout="this.style.color=\'#FFFFFF\'" onclick="GoToday()">今    天</td></tr>');
document.writeln('	</table></td></tr>');
document.writeln('  <tr><td width=142 height=18 bgcolor=#808080>');
document.writeln('	<table border=0 cellspacing=0 cellpadding=0 width=140 height=1 style="cursor:default">');
document.writeln('	<tr align=center><td style="font-size:12px;color:#FFFFFF" onReg=y>\u65e5</td>');
document.writeln('	<td style="font-size:12px;color:#FFFFFF" onReg=y>\u4e00</td><td style="font-size:12px;color:#FFFFFF" onReg=y>\u4e8c</td>');
document.writeln('	<td style="font-size:12px;color:#FFFFFF" onReg=y>\u4e09</td><td style="font-size:12px;color:#FFFFFF" onReg=y>\u56db</td>');
document.writeln('	<td style="font-size:12px;color:#FFFFFF" onReg=y>\u4e94</td><td style="font-size:12px;color:#FFFFFF" onReg=y>\u516d</td></tr>');
document.writeln('	</table></td></tr>');
document.writeln('  <tr><td width=142 height=120>');
document.writeln('    <table border=0 cellspacing=1 cellpadding=0 width=140 height=120 bgcolor=#FFFFFF>');

var n=0;
for (j=0;j<5;j++){
	document.writeln (' <tr align=center>'); 
		for (i=0;i<7;i++){
			document.writeln('<td width=20 height=20 id=yyDay'+n+' style="font-size:12px" onReg=y onclick=yyDayClick(this.innerText)></td>');
			n++;
		}
	document.writeln('</tr>');
}

document.writeln('      <tr align=center><td width=20 height=20 style="font-size:12px" id=yyDay35 onReg=y ');
document.writeln('         onclick=yyDayClick(this.innerText)></td>');
document.writeln('        <td width=20 height=20 style="font-size:12px" id=yyDay36 onReg=y onclick=yyDayClick(this.innerText)></td>');
document.writeln('        <td colspan=5 align=right onReg=y><span onclick=closeLayer() style="font-size:12px;cursor: pointer"');
document.writeln('         onReg=y><u>\u5173\u95ed</u></span></td></tr>');
document.writeln('    </table></td></tr><tr><td>');
document.writeln('        <table border=0 cellspacing=1 cellpadding=0 width=100% bgcolor=#FFFFFF>');
document.writeln('          <tr>');
document.writeln('</tr></table></td></tr></table></div>');

var outObject;

document.onclick = function onclick(){
	with(window.event){
		//不是在要触发的控件内点击且不是特定的允许点击区域点击，日历层隐藏,.
		if ( srcElement != outObject && srcElement.getAttribute("onReg") != 'y'){
			document.all.yyDateLayer.style.display = "none";
		}
	}
}

document.onkeydown = function onkeydown(){
    if (window.event.keyCode==27){
    	document.all.yyDateLayer.style.display="none";
    }
}

function setday(obj){
	if (arguments.length > 1){
		//对不起，传入的参数太多

		alert("\u5bf9\u4e0d\u8d77\uff01\u4f20\u5165\u53c2\u6570\u592a\u591a\uff01");
		return;
	}
	
	if (arguments.length == 0){
		//对不起，没有参数传入
		alert("\u5bf9\u4e0d\u8d77\uff01\u6ca1\u6709\u53c2\u6570\u4f20\u56de\uff01");
		return;
	}
	
	var dads  = document.all.yyDateLayer.style;
	var ttop  = obj.offsetTop;
	var thei  = obj.clientHeight;
	var tleft = obj.offsetLeft;
	var ttype  = obj.type;
	var tmpobj = obj
	while (tmpobj = tmpobj.offsetParent){
		ttop += tmpobj.offsetTop;
		tleft += tmpobj.offsetLeft;
	}
	dads.top  = (ttype=="image") ? ttop+thei : ttop+thei+1;
	dads.left = tleft;
	
	outObject = obj;
	
	dads.display = '';
	event.returnValue=false;
}

var MonHead = new Array(12);         
    MonHead[0] = 31; MonHead[1] = 28; MonHead[2] = 31; 
    MonHead[3] = 30; MonHead[4]  = 31; MonHead[5]  = 30;
    MonHead[6] = 31; MonHead[7] = 31; MonHead[8] = 30; 
    MonHead[9] = 31; MonHead[10] = 30; MonHead[11] = 31;

var yyTheYear = new Date().getFullYear(); 
var yyTheMonth = new Date().getMonth()+1;
var yyTheDay = new Date().getDate();

var yyWDay=new Array(37);

function yyWriteHead(yy,mm){
	document.all.yyYearHead.innerText  = yy;
	document.all.yyMonthHead.innerText = mm;
}

function tmpSelectYearInnerHTML(strYear){
	if (strYear.match(/\D/)!=null){
		//年份的参数不是数字

		alert("\u5e74\u4efd\u53c2\u6570\u4e0d\u662f\u6570\u5b57\uff01");
		return;
	}
	var m = (strYear) ? strYear : new Date().getFullYear();
	
	if (m < 1000 || m > 9999) {
		//年份值不在1000 到 9999 之间
		alert("\u5e74\u4efd\u503c\u4e0d\u5728 1000 \u5230 9999 \u4e4b\u95f4\uff01");
		return;
	}
	var n = m - 10;
	if (n < 1000){
		n = 1000;
	}
	if (n + 26 > 9999){
		n = 9974;
	}
	var s = "<select onReg=y name=tmpSelectYear style='font-size: 12px' "
		s += "onblur='document.all.tmpSelectYearLayer.style.display=\"none\"' "
		s += "onchange='document.all.tmpSelectYearLayer.style.display=\"none\";"
		s += "yyTheYear = this.value; yySetDay(yyTheYear,yyTheMonth)'>\r\n";

	var selectInnerHTML = s;

	for (var i = n; i < n + 26; i++){
		if (i == m){
			selectInnerHTML += "<option value='" + i + "' selected>" + i + "\u5e74" + "</option>\r\n";
		} else {
			selectInnerHTML += "<option value='" + i + "'>" + i + "\u5e74" + "</option>\r\n";
		}
	}
	
	selectInnerHTML += "</select>";
	document.all.tmpSelectYearLayer.style.display="";
	document.all.tmpSelectYearLayer.innerHTML = selectInnerHTML;
	document.all.tmpSelectYear.focus();
}

function tmpSelectMonthInnerHTML(strMonth){
	if (strMonth.match(/\D/)!=null){
		//月份的参数不是数字

		alert("\u6708\u4efd\u53c2\u6570\u4e0d\u662f\u6570\u5b57\uff01");
		return;
	}
	var m = (strMonth) ? strMonth : new Date().getMonth() + 1;
	var s = "<select onReg=y name=tmpSelectMonth style='font-size: 12px' "
		s += "onblur='document.all.tmpSelectMonthLayer.style.display=\"none\"' "
		s += "onchange='document.all.tmpSelectMonthLayer.style.display=\"none\";"
		s += "yyTheMonth = this.value; yySetDay(yyTheYear,yyTheMonth)'>\r\n";
	var selectInnerHTML = s;
	for (var i = 1; i < 13; i++){
		if (i == m){
			selectInnerHTML += "<option value='"+i+"' selected>"+i+"\u6708"+"</option>\r\n";
		} else {
			selectInnerHTML += "<option value='"+i+"'>"+i+"\u6708"+"</option>\r\n";}
	}
	selectInnerHTML += "</select>";
	document.all.tmpSelectMonthLayer.style.display="";
	document.all.tmpSelectMonthLayer.innerHTML = selectInnerHTML;
	document.all.tmpSelectMonth.focus();
}

function closeLayer(){
    document.all.yyDateLayer.style.display="none";
}

function IsPinYear(year){
    if (0==year%4&&((year%100!=0)||(year%400==0))){
    	return true;
    } else {
    	return false;
    }
}

function GetMonthCount(year,month){
    var c=MonHead[month-1];
    if((month==2)&&IsPinYear(year)){
    	c++;
    }
    return c;
}

function GetDOW(day,month,year){
    var dt=new Date(year,month-1,day).getDay()/7;
    return dt;
}

function yyPrevY(){
    if(yyTheYear > 999 && yyTheYear <10000){
    	yyTheYear--;
    } else {
    	//年份超出范围(1000 - 9999)!
    	alert("\u5e74\u4efd\u8d85\u51fa\u8303\u56f4\uff081000-9999\uff09\uff01");
    }
    yySetDay(yyTheYear,yyTheMonth);
}

function yyNextY(){
    if(yyTheYear > 999 && yyTheYear <10000){
    	yyTheYear++;
    } else{
    	//年份超出范围(1000 - 9999)!
    	alert("\u5e74\u4efd\u8d85\u51fa\u8303\u56f4\uff081000-9999\uff09\uff01");
    }
    yySetDay(yyTheYear,yyTheMonth);
}

function yyToday(){
    yyTheYear = new Date().getFullYear();
    yyTheMonth = new Date().getMonth()+1;
    yyTheDay = new Date().getDate();
    yySetDay(yyTheYear,yyTheMonth);
}

function yyPrevM(){
    if(yyTheMonth>1){yyTheMonth--}else{yyTheYear--;yyTheMonth=12;}
    yySetDay(yyTheYear,yyTheMonth);
}

function yyNextM(){
    if(yyTheMonth==12){yyTheYear++;yyTheMonth=1}else{yyTheMonth++}
    yySetDay(yyTheYear,yyTheMonth);
}

function yySetDay(yy,mm){
	yyWriteHead(yy,mm);
	for (var i = 0; i < 37; i++){yyWDay[i]=""};
	var day1 = 1,firstday = new Date(yy,mm-1,1).getDay(); 
	for (var i = firstday; day1 < GetMonthCount(yy,mm)+1; i++){yyWDay[i]=day1;day1++;}
	for (var i = 0; i < 37; i++){
	  	var da = eval("document.all.yyDay"+i)   
	    if (yyWDay[i]!=""){
	    	da.innerHTML = "<b>" + yyWDay[i] + "</b>";
	        da.style.backgroundColor = (yy == new Date().getFullYear() &&
	        mm == new Date().getMonth()+1 && yyWDay[i] == new Date().getDate()) ? "#FFD700" : "#ADD8E6";
	        da.style.cursor="pointer"
		}else{
			da.innerHTML="";da.style.backgroundColor="";da.style.cursor="default"
		}
	}
}

function GoToday(){
	yyToday();
    yyDayClick(yyTheDay);
}

function yyDayClick(n){
	var yy = yyTheYear;
	var mm = yyTheMonth;
	if (mm < 10){mm = "0" + mm;}
	if (outObject){
		if (!n) {outObject.value=""; return;}
		if ( n < 10){n = "0" + n;}
		outObject.value= yy + "-" + mm + "-" + n ;
		closeLayer(); 
	} else {
		closeLayer();
		//您所要输入的控件对象并不存在!
		alert("\u60a8\u6240\u8981\u8f93\u51fa\u7684\u63a7\u4ef6\u5bf9\u8c61\u5e76\u4e0d\u5b58\u5728\uff01");
	}
}

yySetDay(yyTheYear,yyTheMonth);
