/**
 * 更新表格数据
 * data是一个对象{tabID:是哪个表格的,list:数据集合,page:这是哪一页的数据,pageSize:多少行}
 */
function GtableUpdate( data,columnList ){
	var tabID = data.tabID;
	var tabBody = $(tabID+"_body");
	if(tabBody){
		columnList = stringToJson($(id+"_columnList").innerHTML);
		var html = getGtableContext(columnList,data);
		try{
			tabBody.innerHTML = html;
		}catch(e){	//IE不兼容用以下方式.
			 var dc = document.createElement('div');
			 dc.innerHTML = '<table><tbody>'+html+'</tbody></table>';
			 while(tabBody.firstChild) tabBody.removeChild(tabBody.firstChild);
			 var tbody = dc.firstChild.firstChild;
			 while(tbody.firstChild) tabBody.appendChild(tbody.firstChild);
		}
		//更新了Gtable的数据.这里就要更新分页代码.
		GtableUpdatePage({tabID:tabID,page:data.page,pageSize:data.pageSize,size:data.size,region:columnList.gregion});	
		getSummary(tabID);		//进行计算合计行
	}else{	//不存在就创建;
		createGtable( data, columnList );
		addColumnListDiv( tabID );
		init();	//准备好Ajax环境
	}
}
/**
 * 将string转换为json对象
 */
function stringToJson(str){return (new Function("return " + str))();};
/**
 * 用于导出
 */
function addColumnListDiv( id ){
	var main = $(id+"_Main");
	var js = $(id+"_exeFun").innerHTML;
	var columnList = js.split("   ,   ")[1];
	var div = document.createElement("div");
	div.id = id+"_columnList";
	div.style.display = "none";
	div.innerHTML = columnList;
	main.appendChild(div);
}
function $(id){return document.getElementById(id)};
/**
 * 根据Gtable的ID,来获取其中的属性值.
 * 
 */
function createGtable( dataObj, columnList ){
	var tabID = dataObj.tabID;
	gpage = columnList.gpage.replace(/[ ]/g,"");	//gpage
	if(window.GtableObj);else window.GtableObj = {};							//用于存放公共的事件操作对象
	var ii = gpage.indexOf("showpage"),showPage = 1;
	if(ii != -1){
		var str = gpage.substring(ii).split("=")[1];
		for(ii=0;ii<str.length;ii++){
			if(str.charAt(ii)==')' || str.charAt(ii)==',')break;
		}
		showPage = str.substring(0,ii)*1;
	} 
	dataObj.page = showPage;
	GtableObj[tabID+"_pageParam"] = "&sort="+(columnList.gsort ? columnList.gsort : "")+"&sortmethod="
	+(columnList.gsortmethod ? columnList.gsortmethod : "");	//排序参数
	if(columnList.gregion === "CN"){
		GtableObj[tabID+"_gregion"] = ["上页 ","下页","共","页","条记录"," 每页","跳到"];
	}else{
		if(columnList.gregion ==="EN"){
			GtableObj[tabID+"_gregion"] = ["Up ","Next","Total"," page","Records"," Every","Jump to"];
		}else{
			GtableObj[tabID+"_gregion"] = ["上頁 ","下頁","共","頁","條記錄"," 每頁","跳到"];
		}
	}
	var list = columnList.gcolumn;
	var col,imageBool = false,gwidthBool,tabWidth = columnList.gwidth;
	tabWidth = tabWidth.length >0 ? tabWidth*1 : 0; //是否自定义了表格的宽度
	gwidthBool = tabWidth != 0 ? false : true;	//是否要进行计算宽度
	GtableObj[tabID+"_summary"] = []; //存放对应table的合计行有哪些.存放对象:{col:那一列,type:'int || float',align:'对齐方式',dataformat:数据格式};
	for(var i=0;i<list.length;i++){
		col = list[i];
		if(col){
			if(gwidthBool && col.headtype != "HIDDEN" && col.width.length > 0){	//后台已经处理头部或者其他是hidden就全部hidden
				tabWidth += col.width*1;
			}
			if(col.summary === "THIS"){
				GtableObj[tabID+"_summary"].push({isSum:true,col:i,datatype:col.datatype,align:col.align,dataformat:col.dataformat});	//datatype只能是int或者float
			}
			if(col.type === "IMAGE"){imageBool = true;}
		}
	}
	if(imageBool){ 					//table中有图片就创建一个浮动显示图片的div
		var showDiv = document.createElement("div");
		 showDiv.id = "Gtable_showImgDiv";
		 showDiv.style.cssText = "position:absolute;display:none;z-index:9999;border:#CCCCCC 4px solid";
		 document.body.appendChild(showDiv);
	}
	GtableObj["GtableMenu"] = null;			//菜单对象
	GtableObj["columnN"] = -1;				//当前操作列
	GtableObj["sortType"] = "string";		//列的排序方式[string,int,float]
	GtableObj["tabID"] = tabID;				//是哪个表
	createDiv();							//创建菜单,其中会赋值给上面的GtableMenu
	GtableInit( tabID, tabWidth, columnList, dataObj );	//初始化表格	////////////////////////////应用需修改
}
/**
 * 初始化table
 */
function GtableInit( tabID, tabWidth, columnList, data ){
	var html = getGtableHtml(tabID, tabWidth, columnList,data);
	var div = $(tabID);
	div.innerHTML = '<div id="'+tabID+'_line" style="position:absolute;display:none;width:2;filter:alpha(opacity=30);'
	+'background:#3399cc"> </div>'+html;
	getSummary(tabID);	//载入完成后,就开始计算合计行的值.如果有就显示.木有算了.
}
/**
 * 构建table的HTML
 */
function getGtableHtml( tabID, tabWidth, columnList, data ){
	return '<table id="'+tabID+'_table" oncontextmenu="getColumn(event);return false;" '
	+'class="default_table" cellspacing="1" cellpadding="0" width="'+tabWidth+'">'
	+getGtableHead(tabID,columnList)
	+'<tbody id="'+tabID+'_body">'+getGtableContext(columnList,data)+'</tbody>'
	+getGtableFoot(tabID,columnList,data)+'</table>';
}
/**
 * 获取头部
 */
function getGtableHead( tabID, columnList ){
	var isIE = !+ [ 1, ];
	var tds = '<thead id="'+tabID+'_head"><tr id="'+tabID+'_g@r0" class="default_head" onselectstart="return false;">';
	var obj,gcolumn = columnList.gcolumn,cl = gcolumn.length;
	var j = document.location.pathname.split("/").length,path="",htext;
	while(--j > 2){
		path+="../";
	}
	for(var i=0;i<cl;i++){
		obj = gcolumn[i];
		tds += '<td id="'+tabID+'_'+obj.name+'_0_td" align="'+obj.headalign+'" onmouseup="Gtable.stopResize(\''+tabID
		+'\',this,event)" onmousemove="Gtable.Resizing(\''+tabID+'\',this,event)" onmousedown="Gtable.startResize(\''+tabID
		+'\',this,event)" onmouseout="window.document.body.style.cursor=\'default\'" type="'+obj.headtype+'" datatype="'+obj.datatype+'" width="'+obj.width+'"';
		if(obj.headtype === "CHECKBOX"){
			tds +='><span id="'+tabID+"_"+obj.name+"_0_s"+'" class="default_span" value="'+obj.name+'" text="selall" datatype="'+obj.datatype+'">'
			+'<input type="checkbox" id="checkboxall" name="checkboxall" value="selall" '+(isIE ? 'onpropertychange' : 'onchange')+'="GtableCheckBoxFun(\''+tabID+'\',this,\'all\');" /></span></td>';
		}else{
			if(obj.headtype === "HIDDEN"){
				tds+=" style='display:none;'";
			}
			htext = obj.headtext.split("#G#");
			tds +='><span id="'+tabID+"_"+obj.name+"_0_s"+'" class="default_span" value="'+obj.name+'" text="'+obj.headtext+'" datatype="'+obj.datatype+'">'
			+'<a class="default_a" href="javascript:GtableColClick(\''+tabID+'\',\''+obj.name+'\','+i+','+cl+')">'+
			(htext.length == 1 ? htext[0] : (htext[0]+"<br>"+htext[1]))+'</a>'
			+'<img id="'+tabID+'_0_'+i+'_i" style="display:none;" src="'+path+'images/arrow_down.gif"></span></td>';
		}
	}
	return tds+"</tr></thead>";
}
/**
 * 获取尾部
 * 第一行是合计行,第二行是分页行
 */
function getGtableFoot( tabID, columnList, data ){
	var pageSize = data.pageSize,size = data.size;	//每页显示多少
	var pageCount = size / pageSize; 						//可以分多少页
	var gcolumn = columnList.gcolumn;
	var grn = columnList.gregion;
	var cols = gcolumn.length;
	if(pageSize > 0){	//防止gpage = (pageSize=-1)
		if(size%pageSize != 0){pageCount++;pageCount = parseInt(pageCount);}
		if(size == 0)pageCount=1;
	}else{
		pageSize = size;pageCount=1;
	}
	var html = '<tfoot id="'+tabID+'_foot"><tr id="'+tabID+'_summary_tr" class="default_body"'
	+' style="display:none"><td align="right">'+(grn === "CN" ? "小计" : (grn === "EN" ? "Total" : "小計"))+'</td>';
	for(var i=1;i<cols;i++){
		html+='<td id="'+tabID+'_summary_'+gcolumn[i].gcid+'_td" '
		+(gcolumn[i].headtype=="HIDDEN" ? 'style="display:none"' : '')+'><span id="'+tabID+'_summary_'
		+gcolumn[i].gcid+'_s" value=0>&nbsp;</span></td>';
	}
	html += '</tr><tr id="'+tabID+'_page_tr" class="default_foot" onselectstart="return false;">'
	+'<td id="'+tabID+'_page_td" colspan="'+cols+'" align="center">'
	+getPageHtml(tabID,data.page,pageCount,pageSize,size,grn)+'</td></tr></tfoot>';
	return html;
}
/**
 * 分页HTML
 * table的id,当前页,分页数,页行数,总行数
 */
function getPageHtml(tabID,page,pageCount,pageSize,size,region){
	var regions = GtableObj[tabID+"_gregion"];
	var str = ' class="default_a" target="_self"';
	var count = 5*(parseInt(page%5 !=0 ? page/5 :(page/5-1))+1),index = count - 5;
	if(count > pageCount)count = pageCount;
	var html = page-5 > 1 ? ('<a href="javascript:GtableGotoPage(\''+tabID+'\','+page+','+pageSize+',\'left\')"'+str
			+'">&lt;&lt; </a>') : "&lt;&lt; ";
	html += page > 1 ? ('<a href="javascript:GtableGotoPage(\''+tabID+'\','+(page-1)+','+pageSize+')"'
			+str+'>'+regions[0]+' </a> ') : regions[0]+" ";
	for(var i=index+1;i<=count;i++){
		html += '<a id="'+tabID+'_page_a_'+i+'" href="javascript:GtableGotoPage(\''+tabID+'\','+i+','+pageSize+',\'goto\')"'+str+'>'+(i != page ? i : ('<strong style="color: #FF0000">'+i+'</strong>'))+'</a> ';
		if(i<count){
			html += ' - ';
		}
	}
	html += '</span>';
	html += page < pageCount ? (' <a href="javascript:GtableGotoPage(\''+tabID+'\','+(page+1)+','+pageSize+',\'goto\')"'+str
			+'>'+regions[1]+'</a>') : " "+regions[1];
	html += page+5 < pageCount ? ('<a href="javascript:GtableGotoPage(\''+tabID+'\','+page+','+pageSize+',\'right\')"'+str
			+'>&gt;&gt;</a> ') : ' &gt;&gt;';
	return html + regions[2]+' <span style="font-weight:bold;">'+pageCount+'</span> '+regions[3]+' <span style="font-weight:bold;">'+size
	+'</span> '+regions[4]+regions[5]+'<input type="text" size="3" maxlength="6" class="default_linkinput" pageSize='+pageSize+' value="'+pageSize+'" onfocus="this.select();" onblur="setPageHtml(\''+tabID+'\',this)"/>'
	+'&nbsp;'+regions[4]+'&nbsp;&nbsp;'+regions[6]+'&nbsp;'
	+'<input type="text" pageSize='+pageSize+' page='+page+' pageCount='+pageCount+' id="'+tabID+'_page" size="3" value='+page+' maxlength="6" class="default_linkinput"/>'+regions[3]
	+'<input type="button" value="Go" onclick="GtableGotoPage(\''+tabID+'\',0,'+pageSize+',\'to\')" style="font-size:12px;border:1px solid #000000"/>';
}
/**
 * 重新划分 分页
 * tabID表格id
 * pageSize每页多少行
 */
function setPageHtml( tabID, obj ){
	if(!/^[\d]+$/.test(obj.value)){
		obj.value = obj.getAttribute("pageSize");
		return;
	}
	showPageData(tabID,1,obj.value*1);
}
/**
 * 分页处理
 */
function GtableGotoPage(tabID,page,pageSize,type){
	if(type === "left"){
		page -= 5;
		if(page < 0)page = 1;
	}else
	if(type === "right"){
		page += 5;
	}else
	if(type === "to"){
		var obj = $(tabID+"_page"),vv = obj.value,pg = obj.getAttribute("page")*1,pc=obj.getAttribute("pageCount")*1;
		if(!/^[\d]+$/.test(vv)){
			obj.value = pg;
			return;
		}
		vv*=1;
		if(vv > pc){
			vv = pc;
			obj.value = vv;
			if(vv == pg)return;
		}
		if(vv < 1){
			vv = 1;
			obj.value = vv;
			if(vv == pg)return;
		}
		showPageData(tabID,vv,pageSize);
		return;
	}else{
		showPageData(tabID,page,pageSize);
		return;
	}
	var index = (5*(parseInt(page%5 !=0 ? page/5 :(page/5-1))+1))-4;
	showPageData(tabID,index,pageSize);
}
/**
 * 得到结果后,更新界面分页部分
 * @param obj
 * @param type
 * @return
 */
function GtableUpdatePage( obj ){
	var pageCount = obj.size / obj.pageSize; 						//可以分多少页
	if(obj.size%obj.pageSize != 0){
		pageCount++;
		pageCount = parseInt(pageCount);
	}
	if(obj.size === 0){
		obj.page = pageCount = 1;
	}
	$(obj.tabID+'_page_td').innerHTML = getPageHtml(obj.tabID,obj.page,pageCount,obj.pageSize,obj.size,obj.region);
}
/**
 * 显示表格的指定页
 * tabID指定表格
 * type 什么操作:gotoPage翻页,gruopPage翻组
 * pageSize每页行数
 */
function showPageData( tabID, page, pageSize ){
	var pageURL = "?ajaxid="+tabID+"&page="+page+"&pagesize="+pageSize+GtableObj[tabID+"_pageParam"];
	ajax({type:"get",url:pageURL,successFun:function( code ){
		//更新列表
		var i = code.indexOf("<script>GtableUpdate({");
		if(i > 0){
			var v = code.substring(i+8,code.length);
			v = v.substring(0,v.indexOf("})</script>"));
			code = v+"});";
			eval(code);
		}
	},failureFun:function(state){
		//请求失败
	}});
	var ckall = $("checkboxall");
	if(ckall && ckall.checked){			//翻页后,如果之前选中了全选,就取消选中
		ckall.checked = false;
	}
}
/**
 * 更新Gtable	跳转到第一页.也就刷新了数据嘛...原先版本还不是一样么?
 * @param tabID
 * @return
 */
function GtableUpdateByID(tabID){
	var obj = $(tabID+"_page");
	if(obj){
		showPageData(tabID,1,obj.getAttribute("pageSize")*1);
	}
}
/**
 * 计算合计行,显示合计行
 */
function getSummary( tabID ){
	var list = GtableObj[tabID+"_summary"];	//得到对应table合计列属性{col:哪一列,type:什么类型(int或者float),dataformat:数据格式}
	if(list && list.length > 0){
		var rows = $(tabID+"_body").rows;		//表格的所有行.
		var vv,sy,sum = 0,tr,td,span,value,summaryTr = $(tabID+'_summary_tr');
		var start = 0,end = rows.length;
		summaryTr.style.display = "";	//显示合计行
		var xsw = 0;	//小数位
		for(var i=0;i<list.length;i++){
			sy = list[i];
			if(sy.dataformat.length > 0){
				xsw = sy.dataformat.indexOf(".");
				if(xsw != -1){
					xsw = sy.dataformat.length - xsw - 1;
				}else{
					xsw = 0;
				}
			}
			while(start <= end){
				tr = rows[start++];
				if(tr){
					span = tr.cells[sy.col].children[0];
					if(span){
						value = span.getAttribute("value");
						if(value.length > 0){
							vv = value.indexOf(".")===-1 ? parseInt(value) : parseFloat(value);
							if(!vv) vv = 0;
							sum = (parseFloat(sum) + parseFloat(vv)).toFixed(xsw);//格式化数据,跟合计列的数据格式一致
						}
					}
				}
			}
			td = summaryTr.cells[sy.col];
			td.setAttribute("align",sy.align);
			span = td.children[0];
			span.setAttribute("value",sum);
			span.innerHTML = sum;
			start = sum = 0;
		}
	}
}
/**
 * Gtable的头部点击事件
 * tabID哪个表,gcid取数据的key,col哪一列,cols多少列
 */
function GtableColClick(tabID,gcid,col,cols){
	var img = $(tabID+"_0_"+col+"_i"),temp;
	var isDown = false;//之后的排序所用判断什么方式排序
	if(img){
		for(var i=0;i<cols;i++){
			if(i!=col){
				temp = $(tabID+"_0_"+i+"_i");
				if(temp){temp.style.display = "none";}
			}
		}
		img.style.display = "";
		var src = img.src,i = src.indexOf("arrow_down.gif");
		if( i != -1 ){
			src = src.replace("arrow_down.gif","arrow_up.gif");
		}else{
			isDown = true;
			src = src.replace("arrow_up.gif","arrow_down.gif");
		}
		img.src = src;
	}
	GtableObj.sortType = $(tabID+"_"+gcid+"_0_td").getAttribute("datatype");
	Gsort(tabID,col,isDown);//排序操作
}
/**
 * 表格的内容部分
 * columnList是列的配置信息
 * data是一个对象{tabID:是哪个表格的,list:数据集合,page:这是哪一页的数据,pageSize:多少行}
 */
function getGtableContext( columnList, data ){
	var tabID = data.tabID,pageSize = data.pageSize,page = data.page;	//tabID,page,pageSize,list
	var list = data.list,lh = list.length;
	var objS,objN = [],id,j,html='',gcolumns = columnList.gcolumn;
	pageSize = pageSize < lh ? lh : pageSize;	//如果传来的数据大于指定大小了.就换过来.
	var rowClick = columnList.growclick;
	for(var i=0;i<pageSize;i++){
		id = tabID+"_g@r"+(i+1);
		html += '<tr class="default_body"';
		if(i < lh){
			objS = list[i];						//key 取值方式
			j=0;
			for(var item in objS){
				objN[j++] = objS[item];			//下标取值方式
			}
			html +=' id="'+id+'" onmouseover="trOver(\''+tabID+'\',this,'+(i+1)+',event);" onmouseout="trOut(this);" '
			+'onMouseDown="initCBselected(\''+tabID+'\',this,'+(i+1)+',event)"'+
			(rowClick.length > 0 ? 'onclick="Gtable.rowClick(\''+tabID+'\','+(i+1)+');'+getGcolumnValue(objS,objN,rowClick)+'">' : '>');
			html += getGtableTd(tabID,objS,objN,gcolumns,i+1,columnList.greadonly,columnList.gtype)+'</tr>';		//tr的id,名字取值,数字取值,行号
		}else{
			var td = ">",columnSize = gcolumns.length;
			for(var t=0;t<columnSize;t++){
				if(gcolumns[t].headtype === "HIDDEN"){
					td+='<td style="display:none;">&nbsp;</td>';
				}else{
					td+='<td>&nbsp;</td>';
				}
			}
			html += td+'</tr>';
		}
	}
	return html;
}
/**
 * 根据行,行对象得出行的td
 */
function getGtableTd(tabID,objS,objN,colList,row,greadonly,gtype){
	var html = '',id,lh = colList.length,value,obj,isIE = !+ [ 1, ];
	var isCross = gtype === "CROSS" ? true : false;
	var trSummary = 0;
	var xsw = 0;		//小数位
	for(var i=0;i<lh;i++){
		obj = colList[i];
		if(obj.dataformat.length > 0){
			 xsw = obj.dataformat.indexOf(".");
			 if(xsw != -1){
				 xsw = obj.dataformat.length - xsw - 1;
			 }
		}
		id = tabID+"_"+obj.name+"_"+row;
		if(obj.type === "CHECKBOX"){
			id = tabID+"_selcheckbox_"+row;
		}else
		if(obj.name === "rowid" || (obj.gcid == "0" && obj.headtext.indexOf("号")!=-1)){
			id = tabID+"_"+obj.name+"_"+row;
		}
		if(obj.gcid === "-1"){
			value = obj.value;
			id = tabID+"_"+obj.name+"_"+row;
		}else{
			value = getTdValue( objS, objN, obj);
			if(value === "null")value = "";
		}
		html += '<td id="'+id+'_td" align="'+obj.align+'" type="'+obj.type+'" ';
		if(obj.headtype === "HIDDEN"){ //显示隐藏
			html += "style='display:none;' "
		}
		if(obj.gstyle.length > 1){	//自定义列样式
			html += "class='"+obj.gstyle+"' ";
		}
		if(obj.bgcolor.length > 1){ //处理背景色问题
			var vv = getBgColor(objS,objN,obj);
			if(vv != null){
				html += "bgcolor='"+vv+"' ";
			}
		}
		if(obj.gspace.lnegth > 1){	//按实际空格数量显示
			html += "gspace='"+obj.gspace+"' ";
		}
		if(obj.gscript.length > 1){
			html += getGcolumnValue(objS,objN,obj.gscript).replace(/[&&]/g," ")+" ";
		}
		if(isCross && obj.name === "__GCRSSMY"){
			value = trSummary;
		}
		html += '><span id="'+id+'_s'+'" class="default_span" value="'+value+'">';
		switch(obj.type){
			case "CHECKBOX": {
				html += '<input type="checkbox" id="'+tabID+'_checkbox_'+row+'" name="'+tabID+'_checkbox_'+row+'" '+(isIE ? 'onpropertychange' : 'onchange')+'="GtableCheckBoxFun(\''+tabID+'\',this,'+row+');" value="'+value+'" rowid="'+row+'" />';
				break;
			}
			case "SORT":
			case "TEXT":{ 
				value = getTextValue(obj,value);
				if(value === "null")value = "";
				html += value;
				if(isCross && obj.gcid.indexOf("G_")==0 && value.length > 0){
					trSummary = (parseFloat(trSummary) + parseFloat(value*1)).toFixed(xsw);
				}
				break;
			}
			case "LINK":{ 
				html +='<a id="'+id+'_a" class="default_a" href="'+getTypeValue(objS,objN,obj)+'">'+value+'</a>';
				break;
			}
			case "SCRIPT":{
				break;
			}
			case "INPUT":{
				html += '<input type="text" id="'+id+'" name="'+id+'" class="default_input" style="width:'+obj.width
				+';TEXT-ALIGN:'+obj.align+';" value="'+value+'" onfocus="this.select()" '+(greadonly === "TRUE" ? "disabled='disabled'" : "")+'/>'
				break;
			}
			case "BUTTON":{
				html += '<input type="text" id="'+id+'" name="'+id+'" class="default_input" style="width:'+obj.width
				+';TEXT-ALIGN:'+obj.align+';" value="'+value+'" onfocus="this.select()" '+(greadonly === "TRUE" ? "disabled='disabled'" : "")+'/>'
				break;
			}
			case "SELECT":{
				html += getTypeSelect(id,obj.typevalue,greadonly);	
				break;
			}
			case "MASK":{
				html += getMaskValue(objS,objN,obj);
				break;
			}
			case "IMAGE":{
				html += getTypeImage(id,obj,value,greadonly);
				break;
			}
			case "GPROGRESS":{
				html +='<div style="width:100%" class="default_GPROGRESS"><div style="width:'+value+'%"><span>'+value+'%</span></div></div>';
				break;
			}
		}
		html +='</span></td>';
	}
	return html;
}
/**
 * 控制图片
 * typevalue中四个参数,minwidth:20/maxwidth:400/minheigth:20/maxheigth:300
 * 注意顺序,不用alt,原因是事件被覆盖了.根本不会提示.
 */
function getTypeImage(id,obj,value){
	var tv = obj.typevalue;
	var minW = 20,mxaW = 400,minH = 20,maxH = 300,alt="";
	var vs = tv.split("/");
	if(vs.length>3){
		minW = vs[0].split(":")[1];
		maxW = vs[1].split(":")[1];
		minH = vs[2].split(":")[1];
		maxH = vs[3].split(":")[1];
	}
	return '<img id="'+id+'" width="'+minW+'" height="'+minH+'" src="'+value+'" maxW="'+maxW+'" maxH="'+maxH+'" onload="GtabImageLoad(this)" '+(greadonly === "TRUE" ? "disabled='disabled'/>" : "/>");
}
/**
 * 图片控制
 */
function GtabImageLoad(obj){						//IE下显示不正常
	var w = obj.width; 
    var tw = obj.width;   	//图片实际宽度
    var th = obj.height;  	//图片实际高度
    var me = tw / w;  		//图片缩小(放大)的倍数
    obj.width = w;  		//图片显示的可视宽度
    obj.height = th / me;  	//图片显示的可视高度
    var h = obj.getAttribute("maxH")*1;
    w = obj.getAttribute("maxW")*1;
    var showDiv = $("Gtable_showImgDiv");
    var wh = " width='"+w+"px'";
	var ht = " height='"+h+"px'";
    var isMove = true,t,l;
    obj.onmousemove = function(e){
    	var ev;
    	if(e);else e = event || window.event;
    	ev = e;
		if(isMove){
			isMove = false;
			showDiv.style.display = "block";
			showDiv.innerHTML = '<img src="' + this.src + '"'+wh+ht+'/>';
		}
		t = document.body.scrollTop + ev.clientY + 20;
		l = document.body.scrollLeft + ev.clientX + 10;
		if(l+w > document.body.offsetWidth)l-=w;
		if(t+h > document.body.clientHeight)t-=h;
		showDiv.style.top  =  t+ "px";
		showDiv.style.left =  l+ "px";
	}
	obj.onmouseout = function(){
		isMove = true;
		showDiv.innerHTML = "";
		showDiv.style.display = "none";
	}
	obj.onclick = function(){
		window.open( this.src );
	}
}
/**
 * 如果dataformat有值就进行处理下.
 * obj是列配置对象,value是已经得出的值.
 */
function getTextValue(obj,value){
	if(obj.gspace === "TRUE"){
		var vv = value;
		if(value.length > 1){
			vv = value.replace(/ /g,'&nbsp;');
		}
		return vv; 
	}else{
		return value;
	}
}
/**
 * 选择框
 * tv = typevalue = Y:是/N:否/U:无    这种格式的数据
 */
function getTypeSelect( id, tv, greadonly ){
	var html = '<select id="'+id+'" name="'+id+'" class="default_select" '+(greadonly === "TRUE" ? "disabled='disabled'>" : ">");
	var vs = tv.split("/"),vv;
	for(var i=0;i<vs.length;i++){
		vv = vs[i].split(":");
		html += '<option value="'+vv[0]+'">'+vv[1]+'</option>';
	}
	return html+'</select>'; 
}
/**
 * 名字取值,数字取值,分页td对象,行,列
 * 分页td对象是用来进行计算翻页后的序号的.
 */
function getTdValue(objS,objN,obj){
	if(obj.name == "rowid" || (obj.gcid == "0" && obj.headtext.indexOf("号")!=-1)){
		return objS["__rowid"]; 
	}else{
		return getDataFormat(obj,getObjValue(objS,objN,obj.gcid));
	}
}
/**
 * 格式化数据,处理dataformat属性.
 * obj是列的配置
 * value是已经从数据得出td的值.
 */
function getDataFormat(obj,value){
	var format = obj.dataformat;
	if(format.length === 0){
		return value;
	}
	if(value === "null"){
		return "";
	}
	if(obj.datatype === "STRING"){
		return value;
	}else
	if(obj.datatype === "NUMBER"){		
		var i = format.indexOf("."),j = 0,bool = false; 
		if( i != -1 ){
			j = format.length - i - 1; //得到小数位数
		}
		if(format.charAt(format.length-1)=='%'){
			j--;
			bool = true;
		}
		var f = parseFloat(value);
		if(!f || f == 0){
			if(obj.isSum)	//计算合计行的时候返回数值
				return 0;
			else
				return "";
		}
		f = f.toFixed(j);
		if(bool) {
			return f+"%";
		}
		return f;
	}else
	if(obj.datatype === "DATETIME"){
		if(value.length < 15)return value;
		var ds = value.split("-");
		var ts = ds[2].split(" ")[1].split(":");
		var o = { 
			"M+" : ds[1], 				//月
			"d+" : ds[2].split(" ")[0], //日
			"H+" : ts[0], 	//时
			"m+" : ts[1], 	//分 
			"s+" : ts[2].split(".")[0], 	//秒 
			"q+" : Math.floor((ds[1]*1+3)/3), //季度
			"S"  : ts[2].split(".")[1] 	//毫秒
		};
		if(/(y+)/.test(format)) { 
			format = format.replace(RegExp.$1, (ds[0]).substr(4 - RegExp.$1.length)); 
		}
		for(var k in o) { 
			if(new RegExp("("+ k +")").test(format)) { 
				format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
			}
		}
		return format;
	}
	return value;
}
/**
 * bgcolor=gcolumn[2]>=gcolumn[1]:blue/gcolumn[sum]<100:red....
 * 从左到右一个成立立马返回
 */
function getBgColor(objS,objN,obj){
	var tv = obj.bgcolor;
	tv = getGcolumnValue(objS,objN,tv);
	var vs = tv.split("/"),vv;
	if(vs.length === 1 && tv.indexOf(":")==-1){	//无条件的情况下
		return tv;
	}
	var ii = -1;
	for(var i=0;i<vs.length;i++){
		vv = vs[i].split(":");
		ii = vv[0].indexOf("=");
		if(ii!=-1){
			var c = vv[0].charAt(ii-1);
			if(c != '!' || c != '<' || c != '>'){
				vv[0] = "'"+vv[0].substring(0,ii)+"'=='"+vv[0].substring(ii+1)+"'";
			}
		}
		if(eval(vv[0])){
			return vv[1];
		}
	}
	return null;
}
/**
 * type=mask
 * typevalue=01:头单/11:翻单/21:备料
 */
function getMaskValue(objS,objN,obj){
	var tv = obj.typevalue;
	var vv = getObjValue(objS,objN,obj.gcid)+"";
	var i = tv.indexOf(vv+":");
	if(i!=-1){
		return tv.substring(i+vv.length+1,tv.length).split("/")[0];
	}else{
		return vv;
	}
}
/**
 * 根据配置的类型,解析obj.typevalue中的值.
 * 里面有gcolumn[xxx],将其翻译.
 * XXX可以是key可能是数字下标
 * 
 */
function getTypeValue( objS,objN,obj ){
	var tv = obj.typevalue;
	if(tv.length > 1){
		return getGcolumnValue(objS,objN,tv);
	}else{
		return tv;
	}
}
/**
 * 将一个带有gcolumn[id],gcolumn[3]...
 * 其中的gcolumn[xxx]翻译
 */
function getGcolumnValue(objS,objN,value){
	var va = value.split("gcolumn[");
	var vu = [];
	var j = -1,k=0;
	for(var i=0;i<va.length;i++){
		j = va[i].indexOf("]");
		if(j!=-1){
			vu[k++] = va[i].substring(0,j);
		}
	}
	for(var i=0;i<k;i++){
		vv = getObjValue(objS,objN,vu[i]);
		value = value.replace("gcolumn["+vu[i]+"]",vv);
	}
	return value;
}
/**
 * 返回取值,解决可能是key可能是数字取值问题公共方法.
 */
function getObjValue(objS,objN,key){
	var vv = objS[key];
	if(vv == undefined){
		vv = objN[key];
	}
	return vv;
}
/**
 * 复选框选择事件
 * tabID那个表格
 * obj当前点击的checkbox对象
 * rows如果是全选的话該值为0,其他无值
 */
function GtableCheckBoxFun(tabID,obj,rows){
	if(rows === "all"){//全部操作
		var cvalue = obj.checked;
		var tbody = $(tabID+"_body"),ck;
		var i=-1,length = tbody.rows.length;
		while(i++ < length){
			ck = $("checkbox"+i);
			if(ck){
				ck.checked = cvalue;
			}
		}
	}
}
/**
 * 获取指定table的checkbox选中项
 * tabID:	指定table
 */
function getGtableSelected( tabID ){
	var tbody = $(tabID+"_body");
	if(tbody){
		var value = "",i=0,length = tbody.rows.length,ck;
		while(i++ < length){			//这里不能用行标来进行选中判断.得先早出当前页显示的有哪些.
			ck = $(tabID+"_checkbox_"+i);
			if(ck && ck.checked){
				value += ck.value+",";
			}
		}
		if(value.length > 1){
			value = value.substring(0,value.length-1);	//去掉最后一个;
		}
		return value;
	}
	return "";
}
/**
 * 进入行
 */
function trOver( id,obj,row,e){
	obj.className = "default_sel";
	if(window.isMoveSelect){
		var cb = $(id+"_checkbox_"+row);
		if(cb){
			cb.focus();
			cb.checked = window.isSelectYvalue < e.clientY ? true : false;
			window.isSelectYvalue = e.clientY;
		}
	}
}
/**
 * 离开行
 */
function trOut( obj ){
	obj.className = "default_body";
}
/**
 * 准备移动选中,鼠标按下的时候触发
 */
function initCBselected(id,obj,row,e){
	var obj = e.srcElement || e.target;
	if(obj.tagName === "TD" || obj.tagName === "SPAN"){
		window.isMoveSelect = true;
		window.isSelectYvalue = e.clientY;
		var cb = $(id+"_checkbox_"+row);
		if(cb){
			cb.checked = !cb.checked;
			document.onmouseup = function(){
				window.isMoveSelect = false;
				document.onmouseup = null;
				document.body.focus();
			};
			obj.focus();
		}
	}
};
/**
 * 右击事件,弹出菜单
 */
function getColumn(e){
	if(e);else{e = event;}
	var obj = e.srcElement ? e.srcElement : e.target;
	if(obj){
		while(obj && obj.tagName != "TD"){
			obj = obj.parentNode;
		}
		if(obj){
			if(obj.id.length == 0 )return false;	//没有ID编号的就是个空的,或者尾部
		}else return false;
		var cellIndex = obj.cellIndex;
		if(!+ [ 1, ]){	//IE下会计算当前列的方式有点问题.隐藏的也得算进去.不然操作错误.
			var tr = obj.parentNode,tds=tr.cells,hideN=0;
			for(var i=0,j=tds.length;i<j;i++){
				if(obj.id === tds[i].id)break;
				if(tds[i].style.display === "none"){
					hideN++;
				}
			}
			cellIndex+=hideN;
		}
		GtableObj.GtableMenu.style.top = e.clientY;
		GtableObj.GtableMenu.style.left = e.clientX;
		GtableObj.GtableMenu.style.display = "";
		if(GtableObj.copyObj == null)initCopyJS();	//初始化复制对象
		GtableObj.copyObj.show();
		initCopyText(); //准备要复制的数据
		GtableObj.tabID = obj.id.split("_")[0]; //这里有问题
		GtableObj.columnN = cellIndex;
		GtableObj.sortType = obj.getAttribute("datatype");
	}
	return false;
}
/**
 * 菜单
 */
function createDiv(){
	var div = document.createElement("div");
	div.id = GtableObj.tabID+"_menu";
	div.style.zIndex = 1001;
	div.style.backgroundColor = "#E6F0FC";
	div.style.textAlign = "left";   //对齐方式
	div.style.border = "#73D1F7 2px solid";	//边框颜色
	div.style.position = "absolute";
	div.style.display = "none";
	div.innerHTML = '<button onclick="GtableCDtd(\'SX\')">将此列升序</button><br>'
		+'<button onclick="GtableCDtd(\'JX\')">将此列降序</button><br>'
		+'<button id="'+GtableObj.tabID+'_copyBtn">复制选中值</button><br>'
		+'<button onclick="GtableCDtd(\'hide\')">隐藏当前列</button><br>'
		+'<button onclick="GtableCDtd(\'show\')">显示附近列</button><br>'
		+'<button onclick="GtableCDtd(\'showAll\')">显示所有列</button>';
	div.onmouseover = function(){
		GtableObj.menuHide = false;
		GtableObj.copyObj.div.style.display = this.style.display = "";
	}
	div.onmouseout = function(e){
		if(e);else{e = event;}
		var obj = e.srcElement ? e.srcElement : e.target;
		if(obj.name != "copyBtnDiv"){
			this.style.display = "none";
			GtableObj.menuHide = true;
			setTimeout(function(){
				if(GtableObj.menuHide){
					var obj = $(GtableObj.tabID+"_menu");
					GtableObj.copyObj.div.style.display = obj.style.display = "none";
				}
			},500);
		}
	}
	GtableObj.GtableMenu = div;
	document.body.appendChild(div);
}
/**
 * 菜单中的操作
 */
function GtableCDtd(type){
	if(type === "showAll"){
		var cells = $(GtableObj.tabID+"_table").rows[0].cells;
		for(var i=0;i<cells.length;i++){
			Gfilter(GtableObj.tabID,i,false);
		}
	}else
	if(type === "show"){
		Gfilter(GtableObj.tabID,GtableObj.columnN-1,false);
		Gfilter(GtableObj.tabID,GtableObj.columnN+1,false);
	}else
	if(type === "hide"){
		Gfilter(GtableObj.tabID,GtableObj.columnN,true);
	}else
	if(type === "JX"){
		Gsort(GtableObj.tabID,GtableObj.columnN,false);
	}else
	if(type === "SX"){
		Gsort(GtableObj.tabID,GtableObj.columnN,true);
	}
	GtableObj.GtableMenu.style.top = -200;//隐藏和鼠标进入事件冲突.用这个.
}
/**
 * 准备复制的内容到一个地方.等待触发
 */
function initCopyText(){
	var sv;
	if(document.selection){
		sv = document.selection.createRange().text;
	}else{
		var selecter = window.getSelection();
        var data = selecter.anchorNode.data;
        sv = data.substring(selecter.anchorOffset,selecter.focusOffset);
	}
	if(sv.length > 0){
		GtableObj.copyText = sv;
		GtableObj.copyObj.setText(sv);
	}
}
/**
 * 初始化复制组件
 */
function initCopyJS(){
	ZeroClipboard.setMoviePath(GtableObj.URL+"/js/copy/ZeroClipboard.swf");
	GtableObj.copyObj = new ZeroClipboard.Client();
	GtableObj.copyObj.glue(GtableObj.tabID+"_copyBtn");
	GtableObj.copyObj.addEventListener( "complete", function(){
		var obj = $(GtableObj.tabID+"_menu");
		obj.style.display = GtableObj.copyObj.div.style.display = "none";
	    alert("已复制["+GtableObj.copyText+"]到剪贴板!");
	});
	GtableObj.copyObj.addEventListener( "mouseOver", function(client) {
		GtableObj.menuHide = false;
		var obj = $(GtableObj.tabID+"_menu");
		obj.style.display = "";
	});
	GtableObj.copyObj.addEventListener( "mouseOut", function(client) {
		GtableObj.menuHide = false;
		var obj = $(GtableObj.tabID+"_menu");
		if(obj.style.display === "none"){
			GtableObj.copyObj.div.style.display = "none";
			GtableObj.menuHide = null;
		}
	});
	GtableObj.copyObj.div.name = "copyBtnDiv";
}
/**
 * 加载复制所需的组件
 */
function loadCopyJS(){
	if($("copyJS") == null){
		var lt = window.location;
		var name = lt.pathname;
		var url = lt.protocol+"//"+lt.host+"/"+name.split("/")[1];
		window.GtableObj = {URL:url,copyObj:null};
		var js = document.createElement("script");
		js.type = "text/javascript";
		js.id = "copyJS"
		js.src = url+"/js/copy/ZeroClipboard.js";
		document.getElementsByTagName("HEAD").item(0).appendChild(js);
	}
}
loadCopyJS();
/**
 * 过滤
 * tabID = Gtable的ID
 * columnN = 第几列
 * type = true隐藏,false显示
 */
function Gfilter( tabID, columnN, type ){
	var rows = $(tabID+"_table").rows;
	var td = rows[0].cells[columnN];
	if(columnN < 0 && rows[0].cells.length <= columnN)return;
	if(td.style.display == "none"){
		if(type)return;
	}else{
		if(!type)return;
	}
	if(td.getAttribute("type") === "HIDDEN"){	//这是Gtable生成的要求隐藏的.
		return;		
	}
	for(var i=0,j=rows.length-1;i<j;i++){
		rows[i].cells[columnN].style.display = type ? "none" : "";
	}
}
/**
 * 排序 	
 * tabID = Gtable的ID
 * columnN = 第几列
 * type = false降序 | true升序
 */
function Gsort( tabID, columnN, type ){
	var tbody = $(tabID+"_body");
	if(tbody);else return;
	var trs = tbody.rows;
	var jlh = trs.length,index,v1,v2;
	var ilh = trs.length-1;
	columnN*=1;
	if(columnN < 0 && trs[0].cells.length <= columnN)return;
	for(var i=0;i<ilh;i++){
		index = i;
		for(var j=i+1;j<jlh;j++){
			if(trs[index].id.length == 0 || trs[j].id.length == 0)break;
			v1 = trs[index].cells[columnN].children[0].getAttribute("value");
			v2 = trs[j].cells[columnN].children[0].getAttribute("value");
			if(sortCheck(v1,v2,type,columnN) < 0){	//如果返回是个负数就说明要求更换位置
				index = j;	//只到最后一个再来交换.
			}
		}
		if(index != i){	//是否要交换TR
			moveRow(tbody,i,index);
		}
	}
}
/**
 * 判断
 * type = false降序 | true升序
 */
function sortCheck(a,b,type,columnN){
	var sortType = GtableObj.sortType;
	if(sortType === "STRING" || sortType === "DATETIME"){
		if(columnN < 2){ //0,1  为什么不转换数字,0大多是多选框也有可能是其他数据,1一样.
			if(a.length == b.length){
				//去执行下面的for
			}else if(a.length > b.length){
				return type ? -1 : 1;
			}else{
				return type ? 1 : -1;
			}
		}
		if(a == b) return 0;
		for(var i=0,j=a.length; i<j; i++){   
			 if(a.charCodeAt(i) > b.charCodeAt(i)){
				 return type ? -1 : 1;
			 }else if(a.charCodeAt(i) < b.charCodeAt(i)){
				 return type ? 1 : -1;
			 }
		}
	}else{
		sortType = a.indexOf(".")!=-1 ? "float" : "int"
		var A,B;
		if(sortType === "int"){
			A = parseInt(a);
			B = parseInt(b);
		}else
		if(sortType === "float"){
			A = parseFloat(a);
			B = parseFloat(b);
		}
		if(A == B) return 0;
		if(A > B){
			return type ? -1 : 1;
		}else{
			return type ? 1 : -1;
		}
	}
	return 0;
}
/**
 * TR行替换位置
 * table对象,行,目标行
 */
function moveRow(pNode, sri, tri) {
	if(sri == tri)return;
    var temp,sr,tr,trnr;
    for(var i=0;i<2;i++){
    	if(i > 0){
    		temp = sri;
    		sri = tri + (sri<tri ? -1 : 1);
    		tri = temp;
    	}
	    sr = pNode.rows[sri];
	    tr = pNode.rows[tri];
	    if (sr == null || tr == null) return false;
	    trnr = sri > tri ? false : getTRNode(tr, 'nextSibling');
	    if (trnr === false) pNode.insertBefore(sr, tr); //后面行移动到前面，直接insertBefore即可
	    else {//移动到当前行的后面位置，则需要判断要移动到的行的后面是否还有行，有则insertBefore，否则appendChild
	        if (trnr == null) pNode.appendChild(sr);
	        else pNode.insertBefore(sr, trnr);
	    }
    }
}
/**
 * 和上面函数一起的
 * @param nowTR
 * @param sibling
 * @return
 */
function getTRNode(nowTR, sibling) { 
	while (nowTR = nowTR[sibling]) if (nowTR.tagName == 'TR') break; return nowTR; 
}

function init(){
	window.xmlHttpList = []
	window.isIE = (!+ [ 1, ]) ? true : false;
	window.ajaxConnection = 0;
}

/**
 * ajax连接池
 * @return
 */
function getXmlHttp(){
	var bool = window.xmlHttpList.length === 0,i;
	var length = window.xmlHttpList.length > 0 ? window.xmlHttpList.length : 5;
	for(i=0;i<length;i++){
		if(bool){
			window.xmlHttpList.push(isIE ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest()); 
		}else{
			if(window.ajaxConnection > length){//高并发时候,少了就添加连接
				window.xmlHttpList.push(isIE ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest());
				i = length;
				break;
			}
			if(window.xmlHttpList[i].readyState === 0)break;
		}
	}
	return window.xmlHttpList[bool ? 0 : i];
}
/**
 * Ajax
 * @param obj	{type:post||get,cache:true||false,data:{参数对象},successFun:成功的函数,failureFun:失败的函数}
 * @return
 */
function ajax( obj ){
	ajaxConnection++;
	obj.cache = obj.cache ? obj.cache : true;
	var xmlHttp = getXmlHttp(),c = obj.url.indexOf("?") === -1 ? '?' : '&';
	obj.url += c + (obj.cache ? "cache=true" : "cache="+new Date().getTime());
	if(obj.data){
		for(var name in obj.data){
			obj.url += "&"+name+"="+ obj.data[name];
		}
	}
	xmlHttp.open(obj.type, obj.url, true);
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			if( obj.successFun && typeof obj.successFun === 'function' ){
				obj.successFun( xmlHttp.responseText );
			}
			xmlHttp.abort();
			ajaxConnection --;
		}else{
			if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
				if( obj.failureFun && typeof obj.failureFun === 'function' ){
					obj.failureFun( xmlHttp.readyState );
				}
				xmlHttp.abort();
				ajaxConnection --;
			}
		}
	};
	xmlHttp.send(null);
}
//兼容gversion=2的JS部分,原则是重新实现之前的JS,调用方法一致.
var Gtable = {
	rowClick : function(gid,row){	//行点击,选中checkbox
		var ch = $(gid+"_checkbox_"+row);
		if(ch){
			var bool = ch.checked;
			ch.checked = !bool;
		}
	},
	getselectid : function(gid){	//取得checkbox列的选定行的checkbox.value的值
		var id;
		if(typeof (gid) != "string"){
			id = gid.id;
		}else{
			id = gid;
		}
		return getGtableSelected(id);
	},
	getcolvalues : function(gid,colname){//取得表格指定列的所有行的值，以”#@#”符号组分隔行值
		var tbody;
		if(typeof (gid) != "string"){
			tbody = $(gid.id+"_body");
		}else{
			tbody = $(gid+"_body");
		}
		if(tbody){
			var i=0,length = tbody.rows.length,span,value="";
			while(i++ < length){
				if(value.length > 0)value+="#@#";
				span = $(gid+"_"+colname+"_"+i+"_s");
				if(span){
					value += span.getAttribute("value");
				}
			}
			return value;
		}
		return "";
	},
	getsinglevalue : function(gid,colname,row){//取得表格指定列的指定行的值
		var span;
		if(typeof (gid) != "string"){
			span = $(gid.id+"_"+colname+"_"+row+"_s");
		}else{
			span = $(gid+"_"+colname+"_"+row+"_s");
		}
		if(span){
			return span.getAttribute("value");
		}
		return "";
	},	
	setsinglevalue : function(gid,colname,row,value){//设定表格指定列的指定行的值
		var span;
		if(typeof (gid) != "string"){
			span = $(gid.id+"_"+colname+"_"+row+"_s");
		}else{
			span = $(gid+"_"+colname+"_"+row+"_s");
		}
		if(span){
			span.setAttribute("value",value);
			var obj = span.children.length > 0 ? span.children[0] : span;
			if(obj.tagName === "INPUT"){
				obj.value = value;
			}else
			if(obj.tagName === "SPAN"){
				obj.innerHTML = value;
			}
			return true;
		}
		return false;
	},
	getselcolvalues : function(gid,colname){//取得表格选定行的指定列的值，以”#@#”符号组分隔行值
		var tbody;
		if(typeof (gid) != "string"){
			tbody = $(gid.id+"_body");
		}else{
			tbody = $(gid+"_body");
		}
		if(tbody){
			var i=0,length = tbody.rows.length,span,value="";
			while(i++ < length){
				ck = $(gid+"_checkbox_"+i);
				if(ck && ck.checked){
					if(value.length > 0)value+="#@#";
					span = $(gid+"_"+colname+"_"+i+"_s");
					if(span){
						value += span.getAttribute("value");
					}
				}
			}
			return value;
		}
		return "";
	},
	getHeadValue : function(gid,value){
		var headtr = $(gid+"_g@r0");
		if(headtr){
			var colls = headtr.childNodes,vv="";
			for(var i=0;i<colls.length;i++){
				if(vv.length > 0)vv+=",";
				vv += colls[i].childNodes[0].getAttribute(value);
			}
			return vv;
		}
		return "";
	},
	getCOLDATATYPE : function(gid){//获取GTABLE的列的数据类型
		return Gtable.getHeadValue(gid,"datatype");
	},
	getCOLHEADTEXT : function(gid){//获取GTABLE的列的标题目录
		return Gtable.getHeadValue(gid,"text");
	},
	getCOLNAME : function(gid){//获取GTABLE的列的列名
		return Gtable.getHeadValue(gid,"value");
	},
	getSQL : function(gid){//获取GTABLE的查询SQL语句（如交叉表类型，则得到的是处理后SQL语句）
		var obj = typeof (gid) == "string" ? $(gid) : gid;
		var sqlDiv = $(obj.id + "_SQL");
		return sqlDiv.innerHTML;
	},
	getUpdateinfo : function(gid){//获取GTABLE的更新SQL语句
		
	},
	startResize : function (gtableid, obj, evt) {
		var e = evt;
		if (Gtable.resizebegin) {
			if (window.isIE) {
				obj.setCapture();
			} else {
				e.preventDefault();
				document.addEventListener("mouseup", Gtable.stopResize, true);
				document.addEventListener("mousemove", function(e){Gtable.Resizing(e)}, true);
			}
			Gtable.X = e.clientX;
			Gtable.id = gtableid;
			Gtable.tdObj = obj;
			Gtable.lineObj = $(gtableid + "_line");
			Gtable.showline(e.clientX,true);
		}
	},
	Resizing :　function (gtableid, obj, evt) {
		var e = evt ? evt : window.event;
		if(e);else(e = gtableid);
		Gtable.checkedge(obj,e);
		if (Gtable.resizeable) {
			Gtable.newwidth = e.clientX - Gtable.X;
			Gtable.lineObj.style.left = e.clientX + window.document.body.scrollLeft;
			window.document.body.style.cursor = "e-resize";
		}
	},
	stopResize : function (gtableid, obj, evt) {
		if(Gtable.resizeable){
			if(window.isIE){
				obj.releaseCapture();
			}else{
				document.removeEventListener("mouseup", Gtable.stopResize, true);
				document.removeEventListener("mousemove", Gtable.Resizing, true);
			}
			var v = Gtable.newwidth+(Gtable.newwidth/4);
			Gtable.tdObj.style.width = (Gtable.tdObj.offsetWidth+v)+"px";
			var obj = $(Gtable.id);
			obj.style.width = obj.offsetWidth+v;
			obj = $(Gtable.id+"_table");
			obj.style.width = obj.offsetWidth+v;
			Gtable.showline(0,false);
			Gtable.tdObj = null;
		}
	},
	showline : function (x,visibled) {
		var divlive = Gtable.lineObj;
		if (visibled) {
			divlive.style.left = x + window.document.body.scrollLeft;
			divlive.style.height = divlive.parentNode.offsetHeight - 2;
			divlive.style.display = "";
		} else {
			divlive.style.display = "none";
			window.document.body.style.cursor = "default";
		}
		Gtable.resizeable = visibled;
		return divlive;
	},
	checkedge : function (obj,e) {
		var mousex =e.clientX + window.document.body.scrollLeft;
		mousex -= window.isIE ? 10 : 5;
		var calx;
		if(obj){
			calx = obj.offsetLeft + obj.offsetWidth;
		}else{
			return "";
		}
		if (mousex > calx-3 && mousex < calx+3) {
			Gtable.resizebegin = true;
			window.document.body.style.cursor = "e-resize";
		}else{
			Gtable.resizebegin = false;
			window.document.body.style.cursor = "default";
		}
	}
};