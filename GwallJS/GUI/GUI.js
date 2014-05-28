;var GUI = {
		List:{},Ajax:{},Form:{selectBuffer:[],selectCount:0,validationState:{}},Msg:{},Util:{},jsBean:{},
		F5:{t:5,m:new Date().getMinutes(),s:new Date().getSeconds()},
		State:{list:'init',form:'init',win:'hidden',subset:{list:'init',form:'init',win:'hidden'}}		//XXX 目前只设置了win状态
};
//GUI.State是存放所有界面状态,list列表,form表单,subset子集.其中状态值:init(还在初始化),loading(正在载入数据),complete(完成),特殊win(窗口状态):hidden,add,edit,view
GUI.init = function( id, et ){		//id表示div的编号,et表示jsBean是否加密了
	if(GUI.jsBean.table){	//存在就继续
		
		if(GUI.jsBean.classPath == undefined)GUI.jsBean.classPath = null;
		GUI.jsBean.ET = et ? "T" : "F";		//是否加密了,在总的ajax.submit中加入这个参数,CP也是在哪里传递
		GUI.Form.init( id );
		GUI.List.init( id );
	}
};
////////////////////////////////////////////
GUI.List.init = function( id ){			//主表数据列表
	var list = document.createElement("div");
	list.id = id+"_list";
	list.innerHTML = GUI.List.getListHtml({type:'t'});
	var div = $("GUI_"+id);
	div.appendChild(list);
	GUI.List.getListData();
};
GUI.List.getListData = function(){		//刷新,获取,加载
	GUI.List.fnGetListData({tj:'',type:'t'});
};
////////////////////////////////////////////
GUI.Form.init = function( id ){ 		//初始化表单,创建界面
	if(GUI.jsBean && Gwin){
		GUI.Gwin = Gwin;
		var layout = GUI.jsBean.layout;
		GUI.Form.FunHTML = ' onmouseover="GUI.Form.fnMover(event)" onmouseout="GUI.Form.fnMout(event)" ';
		if(layout === "form"){	GUI.Form.layoutForm(GUI.jsBean,id);  }
	}
};
//GUI.Form.selectBuffer下拉框的数据缓存
GUI.List.loadSelectData = function(){	//开始加载下拉框的数据
	var obj;
	for(var i=0;i<GUI.Form.selectBuffer.length;i+=1){
		obj = GUI.Form.selectBuffer[i];
		GUI.Form.AddSelectItem( obj.id, obj.data );
	}
};
GUI.Form.add = function(){	
	var obj = $("Subset_Buttons");
	if(obj)obj.style.display = "none";	//隐藏子集,使其不能操作子集.没有主表的主键,不能操作子集.
	var name = GUI.jsBean.tableName;
	obj = $("reset_"+name);
	obj.style.display = "";	//显示重置按钮
	obj = $("save_"+name);
	obj.style.display = "";	//显示保存按钮
	GUI.Form.fnResetForm(name,"T");
	Gwin.open({
		id:name,title:'新增',contextType:"ID",context:name+"_div",
		width:850,height:GUI.isIE ? 430 : 450,dom:document,autoLoad:false,lock:true,showbt:false,autoRsize:false
	}).show(name).setLoadok(name);
	GUI.State.win = "add";
	if(GUI.jsBean.subset != undefined){
		var pkv = $(GUI.jsBean.subset.valuePK+"_t");	//关联主表中一个字段
		pkv.readOnly = false;
	}
	obj = $("T_"+name+"_Form");
	for(var i=0;i<obj.length;i+=1){
		obj[i].disabled = false;
	}
	Gwin.autoReSize();	//自动调整大小
	GUI.Form.validationForm( 't', 'add' );
};
GUI.Form.edit = function( pk ){	//根据PK查出数据填充到表单.
	var obj = $("Subset_Buttons");
	if(obj)obj.style.display = "";	//隐藏子集,使其不能操作子集.没有主表的主键,不能操作子集.
	var name = GUI.jsBean.tableName;
	obj = $("reset_"+name);
	obj.style.display = "none";	//隐藏重置按钮
	obj = $("save_"+name);
	obj.style.display = "";	//显示保存按钮
	Gwin.open({
		id:name,title:'编辑',contextType:"ID",context:name+"_div",
		width:850,height:GUI.isIE ? 430 : 450,dom:document,autoLoad:false,lock:true,showbt:false,autoRsize:false
	});
	GUI.State.win = "edit";
	GUI.Form.onLoadData( pk, 'edit' );	//表单界面生成完成.这个函数完成准备操作
};
GUI.Form.view = function( pk ){
	var obj = $("Subset_Buttons");
	if(obj)obj.style.display = "";	//隐藏子集,使其不能操作子集.没有主表的主键,不能操作子集.
	var name = GUI.jsBean.tableName;
	obj = $("save_"+name);
	obj.style.display = "none";	//隐藏保存按钮
	obj = $("reset_"+name);
	obj.style.display = "none";	//隐藏重置按钮
	Gwin.open({
		id:name,title:'查看',contextType:"ID",context:name+"_div",
		width:850,height:GUI.isIE ? 430 : 450,dom:document,autoLoad:false,lock:true,showbt:false,autoRsize:false
	});
	GUI.State.win = "view";
	GUI.Form.onLoadData( pk, 'view' );	//表单界面生成完成.这个函数完成准备操作
};
GUI.Form.del = function( pks ){ //删除指定PKS
	GUI.Form.fnDelListByPKS('t',pks);
};
GUI.Form.onLoadData = function( pk, type ){		//界面生成完成,完成准备主子操作, type=edit||view
	GUI.Form.fnGetFormDataByPK(pk,'t',type,function(isOK){
		if(isOK){	//成功了
			if(type === "edit" || type === "view"){
				GUI.Form.validationForm( 't', type );
			}
			if(GUI.jsBean.subset){	//如果有子集
				GUI.Form.fnGetSubsetData();	//开始加载子集数据
				var pkv = $(GUI.jsBean.subset.valuePK+"_t");	//关联主表中一个字段
				pkv.readOnly = true;
				var obj = $(GUI.jsBean.subset.field+"_s");	//将主表中的一个字段值放入子表的这个字段
				if(pkv.value && pkv.value.length > 0 && pkv.value != "null"){	//是否存在主键
					obj.value = pkv.value;	//主子关系,1对多
				}else{	//不存在就把子集隐藏.
					var obj = $("Subset_Buttons");
					if(obj)obj.style.display = "none";	//隐藏子集,使其不能操作子集.没有主表的主键,不能操作子集.
				}
			}
			Gwin.autoReSize();	//自动调整大小
		}
	});
};
GUI.Form.layoutForm = function( jsBean,id ){ //表单布局form方式
	var div = document.createElement("div");
	div.className = "GUI_Form_Box";
	div.style.display = "none";
	div.id = jsBean.tableName+"_div";
	var size = jsBean.table.length;
	var row = size / 2; col = 2;
	if(size%2 != 0)row+=1;
	var form = '<form id="T_'+jsBean.tableName+'_Form" action="GUI?doType=submit&TS=T" onsubmit="return GUI.Form.fnCheckForm(\'t\');" method="post" target="'+jsBean.tableName+'_Iframe">'
		+'<input type="hidden" id="classPath" name="classPath" value="'+jsBean.classPath+'"/>'	//表单事件类
		+'<input type="hidden" id="ET" name="ET" value="'+jsBean.ET+'"/>';	//数据是否加密了
	var html = '<table>';
	var obj,j=0,colspan="";
	for(var i=0;i<size;i+=1){
		obj = jsBean.table[i];
		if(obj.isPK){
			form += '<input type="hidden" id="T_PK" name="PK" value="'+obj.field+'"/>';	//告诉谁是主键
		}
		if(!obj.listShow && (obj.isPK || obj.showType === "hidden")){ //主键或者隐藏的就放在table外面
			form += '<input type="hidden" id="'+obj.field+'_t" name="'+i+'_F_'+obj.field+'" value="'+(obj.value ? obj.value : null)+'"/>';
			continue;
		}
		if(obj.valueType && obj.valueType === "url"){  //是要求通过url进行获取数据项
			obj.type = 't';
			GUI.Form.selectCount+=1;
			GUI.Form.getSelectData(obj);			//放在缓冲区中,等待加载
		}
		if(j%col == 0 && colspan.length ==0){		//布局是多少列
			if(j != 0) html += '</tr>';
			html += '<tr onselectstart="return false;">';
		}
		if(obj.showType != 'hidden'){
			html += '<td class="GUI_Form_Lable">'+obj.name+'</td>';
			colspan = GUI.Form.getColspan( obj,col );
			html += '<td '+colspan+'class="GUI_Form_Value">'+GUI.Form.getShowType( obj, i, 't' )+'</td>';
			colspan.length > 0 ? html += '</tr><tr>' : j+=1; 	//是text就占用一行
		}
	}
	html += '<tr><td colspan='+(col*2)+' class="GUI_List" id="Subset_Buttons">'+GUI.List.getListHtml({type:'s'})+"</td></tr>";
	html += '<tr onselectstart="return false;"><td colspan='+(col*2)+' class="GUI_Form_Btn">'
		+'<input type="hidden" id="T_name" name="T_name" value="'+jsBean.tableName+'"/>'
		+'<input id="save_'+jsBean.tableName+'" type="submit" value="保存" class="buttons" onmouseover="this.className=\'button_over\'" onmouseout="this.className=\'button_out\'"/>'
		+'<input id="reset_'+jsBean.tableName+'" type="reset" value="重置" class="buttons" onmouseover="this.className=\'button_over\'" onmouseout="this.className=\'button_out\'"/>'
		+'<input type="button" value="关闭" onclick="GUI.Form.closeWin(\''+jsBean.tableName+'\')" class="buttons" onmouseover="this.className=\'button_over\'" onmouseout="this.className=\'button_out\'"/></td></tr>';
	html += '</table></form><iframe name="'+jsBean.tableName+'_Iframe" onload="GUI.Form.fnReturnValue(this,true)" id="'+jsBean.tableName+'_Iframe"></iframe>';
	div.innerHTML = form+html;
	var guidiv = $("GUI_"+id)
	guidiv.appendChild(div);
	GUI.Form.getSubsetHtml( id );						//创建子集窗口界面
};
/**
 * obj{type:'s || t',btnsHTML:'按钮栏HTML',btnAdd:true加在已有的后面,false直接清空已有的,用这个}	XXX 自定义按钮栏
 */
GUI.List.getListHtml = function( obj ){
	if(obj.type === "s" && GUI.jsBean.subset === undefined)return;
	var list = obj.type == "t" ? GUI.jsBean.table : GUI.jsBean.subset.table;
	var name = obj.type == "t" ? GUI.jsBean.tableName : GUI.jsBean.subset.tableName;
	var html = '<table><tr onselectstart="return false;" class="table_headbgcolor"><td align="left" style="border-right:0;">'
			+'<input id="GUI_Form_add_'+obj.type+'" type="button" onclick="GUI.Form.fnListBtns_'+obj.type+'(\'add\')" class="buttons" onmouseover="this.className=\'button_over\'" onmouseout="this.className=\'button_out\'" value="新增"/>'
			+'<input id="GUI_Form_edit_'+obj.type+'" type="button" onclick="GUI.Form.fnListBtns_'+obj.type+'(\'edit\')" class="buttons" onmouseover="this.className=\'button_over\'" onmouseout="this.className=\'button_out\'" value="编辑"/>'
			+'<input id="GUI_Form_del_'+obj.type+'" type="button" onclick="GUI.Form.fnListBtns_'+obj.type+'(\'del\')" class="buttons" onmouseover="this.className=\'button_over\'" onmouseout="this.className=\'button_out\'" value="删除"/>'
			+'<input id="GUI_Form_view_'+obj.type+'" type="button" onclick="GUI.Form.fnListBtns_'+obj.type+'(\'view\')" class="buttons" onmouseover="this.className=\'button_over\'" onmouseout="this.className=\'button_out\'" value="查看"/>'
			+'<input id="GUI_Form_refresh_'+obj.type+'" type="button" onclick="GUI.Form.fnListBtns_'+obj.type+'(\'refresh\')" class="buttons" onmouseover="this.className=\'button_over\'" onmouseout="this.className=\'button_out\'" value="刷新"/></td>'
			+'<td align="right" style="border-left:0;"><a class="GUI_Form_Menu_right_top" href="javascript:void(0);" onclick="GUI.Form.fnListShowHide(this,\''+name+'\');" title="隐藏列表"></a></td></tr></table>'
			+'<table id="table_list_'+name+'"><tr class="table_headbgcolor" onselectstart="return false;">';
	for(var i=0;i<list.length;i+=1){
		if(list[i].isPK){
			html += '<td width="5%" align="center"><input type="checkbox" id="tr_chexkbox_all" '+(GUI.isIE ? "onpropertychange" : "onchange")+'="GUI.Form.fnCheckBoxAll(event,\''+obj.type+'\')" value="all"/></td>';
			if(list[i].listShow); else continue;
		}
		html += '<td width="'+list[i].width+'" style="'+(list[i].listShow ? "" : "display:none;")+'" align="center"><b>'+list[i].name+'</b></td>';
	}
	html += '</tr>';
	html += '<tbody onselectstart="return false;" id="GUI_Tbody_'+name+'">'	
	html += '</tbody></table>';
	html += '<table id="GUI_Form_List_page_'+name+'"><tr class="table_headbgcolor" onselectstart="return false;"><td align="left" style="border-right:0;">&nbsp;&nbsp; '
		+'<span onclick="GUI.Form.showPage(\'start\',\''+name+'\');" class="GUI_Form_Page_lefts"></span> '
		+' <span onclick="GUI.Form.showPage(-1,\''+name+'\');" class="GUI_Form_Page_left"></span>'
		+'<span class="GUI_Form_Page_number" id="page_number_'+name+'">0/0</span> '
		+' <span onclick="GUI.Form.showPage(1,\''+name+'\');" class="GUI_Form_Page_right"></span> '
		+' <span onclick="GUI.Form.showPage(\'end\',\''+name+'\');" class="GUI_Form_Page_rights"></span>'
		+' <span class="GUI_List_PageGo"></span>'
		+'</td><td align="right" style="border-left:0;" id="page_msg_'+name+'">每页 0 条,共 0  条</td></tr></table>';
	return html;
};
GUI.Form.closeWin = function( name ){
	GUI.Util.hiddenTip();	//关闭验证提醒
	Gwin.close(name);			//关闭窗口
};
GUI.Form.showPage = function( n,name ){
	var si,ei,page,size,pages,tbodyID,pageC;
	var obj = $("page_number_"+name);
	if(obj){
		pages = obj.getAttribute("showCount")*1;
		size = obj.getAttribute("size")*1;
		page = obj.getAttribute("page")*1;
		tbodyID = obj.getAttribute("tbodyID");
		pageC = obj.getAttribute("pageCount")*1;
	}else return;
	if(n === "start"){	//首页
		if(page === 1)return;
		page = 1;
		si = 0;
		ei = pages-1;
	}else
	if(n === "end"){	//尾页
		if(page === pageC || page > pageC)return;
		page = pageC;
		si = (page-1)*pages;
		ei = si+pages;
	}else
	if(n === 1){	//下一页
		if(page >= pageC)return;
		si = (page)*pages;	//起始位置
		ei = si+pages-1;
		page+=1;
	}else
	if(n === -1){  //上一页
		if(page <= 1)return;
		ei = (page-1)*pages;	//起始位置
		si = ei - pages;
		ei-=1;
		page-=1;
	}
	var tbody = $(tbodyID);
	if(tbody){
		var list = tbody.childNodes,tr;
		for(var i=0;i<list.length;i+=1){
			tr = list[i];
			if(i<=ei && i>=si){
				tr.style.display = "";
			}else{
				tr.style.display = "none";
			}
		}
		obj.setAttribute("page",page);
		obj.innerHTML = page+"/"+pageC;
	}
};
GUI.Form.fnListShowHide = function( obj, tname ){	//控制子集列表的显示和隐藏
	var tab = $("table_list_"+tname);
	var page = $("GUI_Form_List_page_"+tname);
	if(tab){
		if(tab.style.display == "none"){
			obj.title = "隐藏列表";
			obj.className = "GUI_Form_Menu_right_top";
			page.style.display = tab.style.display = "";
		}else{
			obj.title = "显示列表";
			obj.className = "GUI_Form_Menu_right_down";
			page.style.display = tab.style.display = "none";
		}
		Gwin.autoReSize();
	}
};
GUI.Form.getColspan = function( obj, showCol ){	//计算是否要合并列
	if(obj.showType && obj.showType === "text"){
		return 'colspan='+(showCol*2-1)+' ';
	}else{
		return '';
	}
};
GUI.Form.getShowType = function( obj, i, type ){
	if(obj.value == undefined){
		if(obj.definedValue && obj.definedValue.length > 0){
			obj.value = obj.definedValue;
		}else{
			obj.value = "";
		}
	}
	if(obj.showType == undefined || obj.showType.length==0)return obj.value;
	if("radiocheckbox".indexOf(obj.showType)!=-1){
		GUI.Form.validationState[obj.field+"_"+type+"_0"] = {state:false,vfun:obj.validation};
	}else{
		GUI.Form.validationState[obj.field+"_"+type] = {state:false,vfun:obj.validation};
	}
	var publicHtml = 'onfocus="GUI.Form.fnFocus(event,\''+obj.validation+'\')" onblur="GUI.Form.fnBlur(event,\''+obj.validation+'\')" id="'
	+obj.field+'_'+type+'"'+(obj.isReadonly ? ' readonly="readonly"' : '');
	if("selectdateimagetext".indexOf(obj.showType)!=-1){
		switch (obj.showType) {
		case "date":
			return '<input '+publicHtml+' name="'+i+'_F_'+obj.field+'" readonly="readonly" value="'+obj.value+'" type="text" class="GUI_Form_input"'+GUI.Form.FunHTML+' dateFormat="'+obj.valueFormat+'" showType="date"/> <span id="'+obj.field+'_'+type+'_icon" class="GUI_Form_YZ_false"></span>';
		case "image":
			return '<img '+publicHtml+' src="'+obj.value+'"'+GUI.Form.FunHTML+'/>';
		case "select":
			var html = obj.valueType === "url" ? obj.valueFormat : '';
			return '<select '+publicHtml+' name="'+i+'_F_'+obj.field+'" value="'+obj.value+'"'+GUI.Form.FunHTML+' action="'+html+'">'
			+'</select> '+(html.length > 1 ? '<span id="'+obj.field+'_'+type+'_icon" onclick="GUI.Form.fnSelectRefresh(\''+obj.field
			+'\',\''+type+'\',event)" class="GUI_Form_select_loading"></span>' : '<span id="'+obj.field+'_'+type+'_icon" class="GUI_Form_YZ_false"></span>');
		case "text":
			return '<textarea '+publicHtml+' name="'+i+'_F_'+obj.field+'" rows="4"'+GUI.Form.FunHTML+'>'+obj.value+'</textarea> <span id="'+obj.field+'_'+type+'_icon" class="GUI_Form_YZ_false"></span>';
		default:
			return obj.value;
		}
	}else{
		if("inputpasswordfile".indexOf(obj.showType)!=-1){
			return '<input '+publicHtml+' name="'+i+'_F_'+obj.field+'" value="'+obj.value+'" type="'+obj.showType
			+'"'+GUI.Form.FunHTML+'class="GUI_Form_input"/> <span id="'+obj.field+'_'+type+'_icon" class="GUI_Form_YZ_false"></span>';
		}else{
			if("radiocheckbox".indexOf(obj.showType)!=-1){
				if(obj.valueType === "mask" && obj.valueFormat.length >0){
					var strs = obj.valueFormat.split(","),ss;
					var html = '';
					for(var j=0;j<strs.length;j+=1){
						ss = strs[j].split("=");
						html += '<input name="'+i+'_F_'+obj.field+'" '+(obj.defaultValue==ss[0] ? 'checked=true' : '')
							 +' type="'+obj.showType+'" id="'+obj.field+"_"+type+"_"+j+'" value="'+ss[0]
						     +'" onchange="GUI.Form.fnRCbox(event,\''+obj.validation+'\')"/><label for="'+obj.field+"_"+type+"_"+j+'">'+ss[1]+'</label>';
					}
					return html+' <span id="'+obj.field+'_'+type+"_0"+'_icon" class="GUI_Form_YZ_false"></span>';
				}else{
					return '<input '+publicHtml+' name="'+i+'_F_'+obj.field+'" value="'+obj.valueFormat+'" type="'+obj.showType+'"/> <span id="'+obj.field+'_'+type+'_icon" class="GUI_Form_YZ_false"></span>';
				}
			}
		}
	}
};
GUI.Form.getSubsetHtml = function( id ){	//创建子集表单界面
	if(GUI.jsBean.subset === undefined)return;
	var tname = GUI.jsBean.subset.tableName;
	var div = document.createElement("div");
	div.className = "GUI_Form_Box";
	div.style.display = "none";
	div.id = tname+"_div";
	var list = GUI.jsBean.subset.table,obj;
	var form = '<form id="S_'+tname+'_Form" action="GUI?doType=submit&TS=S" onsubmit="return GUI.Form.fnCheckForm(\'s\');" method="post" target="'+tname+'_Iframe">'
			+'<input type="hidden" name="classPath" value="'+GUI.jsBean.classPath+'"/>'	//表单事件类	
			+'<input type="hidden" name="ET" value="'+GUI.jsBean.ET+'"/>';	//是否加密了
	var html = '<table>';
	var size = list.length;
	var row = size / 2; j=0,col = 2,colspan="";
	for(var i=0;i<size;i+=1){
		obj = list[i];
		if(obj.isPK){
			form += '<input type="hidden" id="S_PK" name="PK" value="'+obj.field+'"/>';	//告诉谁是主键
		}
		if(!obj.listShow && (obj.isPK || obj.showType === "hidden")){ //主键或者隐藏的就放在table外面
			form += '<input type="hidden" id="'+obj.field+'_s" name="'+i+'_F_'+obj.field+'" value="'+(obj.value ? obj.value : null)+'"/>';
			continue;
		}
		if(obj.valueType && obj.valueType === "url"){  //是要求通过url进行获取数据项
			obj.type = 's';
			GUI.Form.selectCount+=1;
			GUI.Form.getSelectData(obj);			//放在缓冲区中,等待加载
		}
		if(j%col == 0 && colspan.length ==0){		//布局是多少列
			if(j != 0) html += '</tr>';
			html += '<tr>';
		}
		if(obj.showType != 'hidden'){
			html += '<td class="GUI_Form_Lable">'+obj.name+'</td>';
			colspan = GUI.Form.getColspan( obj,col );
			html += '<td '+colspan+'class="GUI_Form_Value">'+GUI.Form.getShowType( obj, i, 's' )+'</td>';
			colspan.length > 0 ? html += '</tr><tr>' : j+=1; 	//是text就占用一行
		}
	}
	html += '<tr><td colspan='+(col*2)+' class="GUI_Form_Btn">'
	+'<input type="hidden" id="T_name" name="T_name" value="'+tname+'"/>'
	+'<input id="save_'+tname+'" type="submit" value="保存" class="buttons" onmouseover="this.className=\'button_over\'" onmouseout="this.className=\'button_out\'"/>'
	+'<input type="button" value="关闭" onclick="GUI.Form.closeWin(\''+tname+'\')" class="buttons" onmouseover="this.className=\'button_over\'" onmouseout="this.className=\'button_out\'"/></td></tr>';
	html += '</table></form><iframe name="'+tname+'_Iframe" onload="GUI.Form.fnReturnValue(this,false)" id="'+tname+'_Iframe"></iframe>';
	div.innerHTML = form+html;
	var guidiv = $("GUI_"+id)
	guidiv.appendChild(div);
	var obj = $(GUI.jsBean.subset.field+"_s");
	obj.readOnly = true;	//编号不能修改
};
GUI.Form.fnListBtns_t = function(type){	//主表弹出窗口事件
	var vs;
	if(type === "add"){
		GUI.Form.add();
	}else
	if(type === "edit"){
		vs = GUI.Form.fnGetSubsetSelected(1,'t');	//从主表单选
		if(vs != null){
			obj = $("GUI_Form_add_s");
			obj.style.display = "";
			obj = $("GUI_Form_edit_s");
			obj.style.display = "";
			obj = $("GUI_Form_del_s");
			obj.style.display = "";
			GUI.Form.edit(vs);
		}
	}else
	if(type === "del"){			
		vs = GUI.Form.fnGetSubsetSelected(5,'t'); 	//从主表多选
		if(vs != null){
			var c = vs.split(",").length;
			GUI.Msg.confirm("确认要删除已选的"+c+"记录吗?",'确认,取消',function( lable, index ){
				if(index === 1 || lable === "确认"){  //点击了确认按钮
					GUI.Form.del(vs);//ajax删除指定子集合
				}
			});
		}
	}else
	if(type === "view"){
		vs = GUI.Form.fnGetSubsetSelected(1,'t');	//从主表单选
		if(vs != null){
			obj = $("GUI_Form_add_s");
			obj.style.display = "none";
			obj = $("GUI_Form_edit_s");
			obj.style.display = "none";
			obj = $("GUI_Form_del_s");
			obj.style.display = "none";
			GUI.Form.view(vs);
		}
	}else{
		GUI.Msg.confirm("确认要刷新列表吗?",'确认,取消',function( t, i ){  //刷新
			if(i === 1){  //点击了确认按钮
				GUI.List.fnGetListData({tj:'',type:'t',loadFn:function(isOk){
					if(isOk){
						GUI.Msg.alert("列表已刷新!","Y",1);
					}
				}});		
			}
		});
	}
	
};
GUI.Form.fnListBtns_s = function(type){	//子集按钮弹出自己窗口事件
	var tname = GUI.jsBean.subset.tableName;
	GUI.Form.fnResetForm(tname,"S");	//重置子集表单
	var title = type ==="add" ? "新增" : (type === "edit" ? "编辑" : (type === "del" ? "删除" : "刷新"));	//实现之后在考虑国际化
	Gwin.open({
		id:tname,title:title,contextType:"ID",context:tname+"_div",
		width:600,height:300,dom:document,autoLoad:false,lock:true,showbt:false
	});
	var obj = $("save_"+tname),temp;	//编辑就不要重置了.
	if(type === "add"){
		Gwin.show(tname).setLoadok(tname);
		GUI.State.subset.win = "add";
		obj.style.display = "";	//保存按钮
		obj = $(GUI.jsBean.subset.field+"_s");	//子集主键值
		temp = $(GUI.jsBean.subset.valuePK+"_t"); //主表主键值
		obj.value = temp.value;
		obj = $("S_PK");
		temp = $(obj.value+"_s");
		temp.value = "null";	//防止点击编辑后,再点新增重置表单无效,变成修改操作.
		GUI.Form.validationForm( 's', 'add' );
	}
	else{
		var vs;
		if(type === "edit"){
			vs = GUI.Form.fnGetSubsetSelected();	//单选
			if(vs != null){
				obj.style.display = "";	//保存按钮
				GUI.Form.fnGetFormDataByPK(vs,'s',"edit",function(isok){
					if(isok){
						GUI.Form.validationForm( 's', 'edit' );
					}
				});	//ajax载入指定子集
				GUI.State.subset.win = "edit";
			}
		}else if(type === "del"){
			vs = GUI.Form.fnGetSubsetSelected(5); 	//多选
			if(vs != null){
				var c = vs.split(",").length;
				GUI.Msg.confirm("确认要删除已选的"+c+"记录吗?",'确认,取消',function( lable, index ){
					if(index === 1 || lable === "确认"){  //点击了确认按钮
						GUI.Form.fnDelListByPKS('s',vs);//ajax删除指定
					}
				});
			}
		}else if(type === "view"){
			vs = GUI.Form.fnGetSubsetSelected();	//单选
			if(vs != null){
				GUI.Form.validationForm( 's', 'view' );
				obj.style.display = "none";	//保存按钮
				GUI.Form.fnGetFormDataByPK(vs,'s','view');	//ajax载入指定子集
				GUI.State.subset.win = "view";
			}
		}else{
			GUI.Msg.confirm("确认要刷新子集列表吗?",'确认,取消',function( t, i ){  
				if(i === 1){  //点击了确认按钮
					GUI.Form.fnRefreshSubset(tname);		//刷新子集合
				}
			});
		}
	}
};
GUI.Form.setFieldValue = function( vObj, ts, type ){ //值对象,子集s主表t,是编辑还是查看
	var list = ts === "t" ? GUI.jsBean.table : GUI.jsBean.subset.table;
	var obj,field;
	for(var i=0;i<list.length;i+=1){
		field = list[i].field;
		if("radiocheckbox".indexOf(list[i].showType)!=-1){ //单选框,复选框赋值
			var ss = list[i].valueFormat.split(",");
			for(var j=0;j<ss.length;j+=1){
				obj = $(field+"_"+ts+"_"+j);
				if(obj){
					if(obj.value === vObj[field]){
						obj.checked = true;
					}
					obj.disabled = type === "edit" ? false : true;
				}
			}
		}else{
			obj = $(field+"_"+ts);
			if(obj){
				if(list[i].showType == undefined && list[i].isPK){
					obj.value = vObj[field];
				}else
				if("hiddeninputselectpasswordtextdate".indexOf(list[i].showType)!=-1){
					obj.value = vObj[field];
				}else
				if(list[i].showType === "img"){
					obj.src = vObj[field];
				}
				obj.disabled = type === "edit" ? false : true;
			}
		}
	}
	Gwin.setLoadok(ts === "t" ? GUI.jsBean.tableName : GUI.jsBean.subset.tableName);
};
GUI.Form.fnGetFormDataByPK = function( pk, ts, type, loadFn ){	//通过Ajax查询指定表的指定主键数据并加载到界面-表单
	var tname = ts == "t" ? GUI.jsBean.tableName : GUI.jsBean.subset.tableName;
	Gwin.show(tname);
	var pkN = $(ts == "t" ? "T_PK" : "S_PK");
	var list = (ts == "t" ? GUI.jsBean.table : GUI.jsBean.subset.table),fields = '';
	for(var i=0;i<list.length;i+=1){
		if(i != 0) fields += ',';
		fields += list[i].field;
	}
	GUI.Ajax.submit({type:"post",url:"GUI?doType=getFormData&pkN="+pkN.value+"&pkV="+pk+"&T="+tname+"&FS="+fields+"&TS="+ts.toUpperCase(),fnSuccess:function(data){
		var list;
		try{
			list = GUI.Util.toJson(data);
			if(list.length == 1){
				GUI.Form.setFieldValue( list[0], ts, type );	//进行表单赋值操作,setLoadok在其中完成了
				if(GUI.isFun(loadFn))loadFn(true);
			}else{
				GUI.Form.closeWin(tname);
				GUI.Msg.alert("失败","加载数据异常,请重试!","X");
				if(GUI.isFun(loadFn))loadFn(false);
			}
		}catch(e){
			GUI.Form.closeWin(tname);
			GUI.Msg.alert("失败","加载数据失败,处理时候出现异常!"+data,"X");
			if(GUI.isFun(loadFn))loadFn(false);
		}
	},fnFailure:function(state){
		GUI.Form.closeWin(tname);
		Gwin.alert("系统提示","加载指定表单数据异常,请重试!",'X',document);
		if(GUI.isFun(loadFn))loadFn(false);
	}});
};
GUI.Form.fnDelListByPKS = function(type,pks){	//删除指定数据
	var tname = type === "t" ? GUI.jsBean.tableName : (GUI.jsBean.subset ? GUI.jsBean.subset.tableName : undefined);
	var sname = GUI.jsBean.subset ? GUI.jsBean.subset.tableName : undefined;
	var pkN = $(type=="t" ? "T_PK" : "S_PK");
	var url = "GUI?doType=delListData&pkN="+pkN.value+"&pkVS="+pks+"&T="+tname+"&TS="+type.toUpperCase();	//默认子集
	if(tname === undefined)return;
	if(type === "t" && sname != undefined){
		url += "&S="+sname+"&SpkN="+GUI.jsBean.subset.field;
		if(pks.split(",").length > 1){
			Gwin.alert("当前存在子集模式,不允许批量删除!");
			return;
		}
	}
	Gwin.progress("正在删除...", 30, document);
	GUI.Ajax.submit({type:"post",url:url,fnSuccess:function(data){
		Gwin.close("progress_id");		//关闭
		var obj;
		try{
			obj = GUI.Util.toJson(data)[0];
			if(obj.state){
				if(type === "s"){
					GUI.Form.fnGetSubsetData();	//更新列表
				}else{
					GUI.List.fnGetListData({tj:'',type:'t'});
				}
				GUI.Msg.alert("成功","成功删除了"+obj.countY+"条记录!","Y");
			}else{
				GUI.Msg.alert("失败","成功删除"+obj.countY+"条记录,"+obj.countX+"条删除失败!","X");
			}
		}catch(e){
			GUI.Msg.alert("失败","删除操作失败,处理时候出现异常!"+data,"X");
		}
	},fnFailure:function(state){
		Gwin.alert("系统提示","删除数据异常:"+state+",请重试!",'X',document);
	}});
};
GUI.Form.fnRefreshSubset = function(tname){	//刷新子集列表
	var tbody = $("GUI_Tbody_"+tname);			
	if(tbody){
		Gwin.progress("正在加载...", 3, document);
		GUI.Form.fnGetSubsetData("refresh");
	}else{
		Gwin.alert("系统提示","明细不存在,请重新打开此单据!","X",document);
	}
};
GUI.Form.fnGetSubsetSelected = function(n,type){	//获取列表中选中项
	var i = 0,count=0,v="";
	if(type == undefined)type = "s";
	while(obj = $(type+"_tr_checkbox_"+(i+=1))){
		if(obj.checked){
			count+=1;
			if(count > 1)v+=",";
			v += obj.value;
		}
	}
	if(n && n > 1){	//多选
		if(count > 0){
			return v;
		}else{
			Gwin.alert("系统提示",(count === 0 ? "请选择记录后再操作!" : "只能选择一条记录操作!"),"X",document);
			return null;
		}
	}else{	//单选
		if(count === 1){
			return v;
		}else{
			Gwin.alert("系统提示",(count === 0 ? "请选择记录后再操作!" : "只能选择一条记录操作!"),"X",document);
			return null;
		}
	}
};
GUI.Form.fnCheckBoxAll = function(e,type){	//全选当前页
	var obj = GUI.isIE ? e.srcElement : e.target; 
	var bool = obj.checked;
	var i = 0;	
	while(obj = $(type+"_tr_checkbox_"+(i+=1))){
		if(bool && obj.offsetWidth > 0){	//隐藏的就不选中了
			obj.checked = true;
		}else{
			obj.checked = false;
		}
	}
};
GUI.Form.fnTRdbClick = function(obj){	//查看消息信息
	var ts = obj.getAttribute("TS");
	obj = $(ts+"_tr_checkbox_"+(obj.rowIndex));
	obj.checked = true;
	if(ts === "t"){
		GUI.Form.fnListBtns_t("view");
	}else{
		GUI.Form.fnListBtns_s("view");
	}
};
GUI.Form.fnTRclick = function(obj){		//选中行
	var c = false,type = obj.getAttribute("TS");
	if(obj.className == "GUI_Form_TR_Click"){
		obj.className = obj.rowIndex%2 ==1 ? "GUI_Form_TR_2" : "";		//rowIndex从0开始
	}else{
		obj.className = "GUI_Form_TR_Click";
		c = true;
	}
	obj = $(type+"_tr_checkbox_"+(obj.rowIndex));
	if(obj){
		obj.checked = c;
	}
};
GUI.Form.fnTRout = function(obj){
	if(obj.className != "GUI_Form_TR_Click"){
		obj.className = obj.rowIndex%2 == 0 ? "GUI_Form_TR_2" : "";		//rowIndex从0开始
	}
};
GUI.Form.fnTRover = function(obj){
	if(obj.className != "GUI_Form_TR_Click"){
		obj.className = "GUI_Form_TR_Over";
	}
};
GUI.Form.fnMover = function(e){
	var obj = GUI.isIE ? e.srcElement : e.target; 
	obj.style.border="#00FF00 2px solid";
};
GUI.Form.fnMout = function(e){
	var obj = GUI.isIE ? e.srcElement : e.target; 
	obj.style.border="";
};
/**
 * obj={tj:'',tbody:element对象,loadFn:执行后的函数带个是否成功的参数, *  
 *  type:'s || t',
 *  rwin:true,false,	//是否完成后自动调整下窗口
 * }
 */
GUI.List.fnGetListData = function( obj ){ //获取数据列表
	var jsBean = GUI.jsBean;
	var table = obj.type == 't' ? jsBean.tableName : jsBean.subset.tableName;	
	var list = (obj.type == 't' ? jsBean.table : jsBean.subset.table),fields = '';
	for(var i=0;i<list.length;i+=1){
		if(i != 0) fields += ',';
		fields += list[i].field;
	}
	var url = "GUI?doType=getListData&T="+table+"&FS="+fields+"&TS="+obj.type.toUpperCase();
	if(obj.tj)url += "&TJ="+obj.tj; else url+= "&TJ= ";
	Gwin.progress("正在加载...", 30, document);
	GUI.Ajax.submit({type:"post",url:url,fnSuccess:function(data){
		Gwin.close("progress_id");	//关闭
		GUI.List.setTbodyHtml({data:GUI.Util.toJson(data),type:obj.type ? 't' : 's'});
		if(GUI.isFun(obj.loadFn)){
			obj.loadFn(true);
		}
	},fnFailure:function(state){
		Gwin.alert("系统提示","加载数据异常,请重试!",'X',document);
		if(GUI.isFun(obj.loadFn)){
			obj.loadFn(false);
		}
	}});
};
GUI.Form.fnGetSubsetData = function(state){	//加载子集数据,state=refresh表示用户点击了刷新按钮,其他就是程序调用刷新
	var jsBean = GUI.jsBean;
	var temp = $(jsBean.subset.valuePK+"_t");
	var pkV = null;		//当前主表单的主键值
	if(temp)pkV = temp.value; else{
		Gwin.alert("没有找到关联值!");
		return;
	}
	var pkN = jsBean.subset.field;	//要匹配的字段
	var table = jsBean.subset.tableName;	//子集表名称
	var list = jsBean.subset.table,fields = '';
	for(var i=0;i<list.length;i+=1){
		if(i != 0) fields += ',';
		fields += list[i].field;
	}
	GUI.Ajax.submit({type:"post",url:"GUI?doType=getSubset&pkN="+pkN+"&pkV="+pkV+"&TS=S&T="+table+"&FS="+fields,fnSuccess:function(data){
		GUI.List.setTbodyHtml({data:GUI.Util.toJson(data),type:'s'});
		if(state === "refresh"){//是主动要求刷新
			Gwin.close("progress_id");	//关闭
			GUI.Msg.alert("列表已刷新!","Y",1);
		}
	},fnFailure:function(state){
		Gwin.alert("系统提示","加载子集数据异常,请重试!",'X',document);
	}});
};
GUI.Form.getSelectData = function( obj ){	//加载下拉框的数据放在缓存对象中.等待界面初始化完成就载入数据
	GUI.Ajax.submit({type:"post",url:obj.valueFormat+"&ID="+obj.field+"_"+obj.type+"&TS="+obj.type.toUpperCase(),fnSuccess:function(data){//[{lable:显示文本,value:值},{...},...]
		GUI.Form.selectCount-=1;
		var dtobj = GUI.Util.toJson(data);
		if(dtobj && dtobj.length === 1){
			GUI.Form.selectBuffer.push(dtobj[0]); //{id:'selectID',data:[...]}
			if(GUI.Form.selectCount <= 0){	//全部搞定
				GUI.List.loadSelectData();
			}
		}
	},fnFailure:function(state){
		Gwin.alert("系统提示","加载"+obj.name+"的数据异常,请重试!",'X',document);
	}});
};
/* obj={data:数据集合,type:'s'表示子集列表用,'t'表示主表列表用 */
GUI.List.setTbodyHtml = function( obj ){	//更新Table中的tbody
	var name = obj.type == "s" ? GUI.jsBean.subset.tableName : GUI.jsBean.tableName;
	var tbody = $("GUI_Tbody_"+name);
	if(tbody == null){Gwin.alert("没找到Tbody对象!");return;}
	var showCount = obj.type == 's' ? GUI.jsBean.subset.pageCount : GUI.jsBean.pageCount;
	var list = obj.type == 's' ? GUI.jsBean.subset.table : GUI.jsBean.table,html = '',data = obj.data,length = data.length,tp = length%showCount;	//每页显示多少;
	if(length < showCount) length = showCount;		//执行显示条,其他分页处理
	var page = parseInt(data.length / showCount),count=0,state='';
	if(tp!=0){
		page+=1;	
		tp = showCount - tp;	//得到;分页后,剩余要添加的空行
	}
	length += tp;
	var pageObj = $("page_number_"+name);
	pageObj.innerHTML = page > 0 ? "1/"+page : "0/"+page;
	pageObj.setAttribute("page", 1);	//当前第几页
	pageObj.setAttribute("showCount", showCount);	//每页多少
	pageObj.setAttribute("size", data.length);	//数据多少
	pageObj.setAttribute("pageCount", page);	//多少页
	pageObj.setAttribute("tbodyID", tbody.id);	//tbodyID
	pageObj = $("page_msg_"+name);
	pageObj.innerHTML = "每页 "+showCount+" 条,共 "+data.length+" 条,有 "+page+" 页";
	for(var j=0;j<length;j+=1){
		count+=1;
		for(var i=0;i<list.length;i+=1){
			if(count > showCount)state='style="display:none;" ';
			if(i===0){
				if(j>0)html+='</tr>';
				if(j < data.length){
					html += '<tr height=20 '+state+(j%2==1 ? 'class="GUI_Form_TR_2"' : "")+' TS="'+obj.type+'" VALUE="'+data[j][list[i].field]+'" ondblclick="GUI.Form.fnTRdbClick(this);" onclick="GUI.Form.fnTRclick(this)" onmouseover="GUI.Form.fnTRover(this)" onmouseout="GUI.Form.fnTRout(this)">'
					+'<td align="center"><input type="checkbox" id="'+obj.type+'_tr_checkbox_'+(j+1)+'" value="'+data[j][list[i].field]+'"/></td>'
				}else{
					html += '<tr height=20 '+state+(j%2==1 ? 'class="GUI_Form_TR_2"' : "")+'><td align="center"> </td>';
				}
			}else{
				if(j >= data.length){
					html += '<td width="'+list[i].width+'" style="'+(list[i].listShow ? "" : "display:none;")+'" align="'+list[i].align+'"> </td>';
				}else{
					html += '<td width="'+list[i].width+'" style="'+(list[i].listShow ? "" : "display:none;")+'" align="'+list[i].align+'">'+GUI.List.showValue(list[i],data[j][list[i].field])+'</td>';
				}
			}
		}
	}
	try{
		tbody.innerHTML = html;
	}catch(e){	//IE不兼容用以下方式.
		 var dc = document.createElement('div');
		 dc.innerHTML = '<table><tbody>'+html+'</tbody></table>';
		 while(tbody.firstChild) tbody.removeChild(tbody.firstChild);
		 var tb = dc.firstChild.firstChild;
		 while(tb.firstChild) tbody.appendChild(tb.firstChild);
	}
	if(obj.type == "s")Gwin.autoReSize();	//设置窗口的大小
};
GUI.Form.buffer = {};
GUI.List.showValue = function(obj,value){
	if(value.length === 0)return "";
	if(obj.showType === "select"){
		if(GUI.Form.buffer[obj.field] == undefined){
			GUI.Form.buffer[obj.field] = {};
			var selectO = $(obj.field+"_"+obj.type);
			if(selectO){
				for(var i=0;i<selectO.length;i+=1){
					GUI.Form.buffer[obj.field][selectO.options[i].value] = selectO.options[i].text;
				}
			}else{
				return value;
			}
		}
		return GUI.Form.buffer[obj.field][value] ? GUI.Form.buffer[obj.field][value] : value;
	}else
	if(obj.valueType === "mask"){
		if(GUI.Form.buffer[obj.field] == undefined){
			GUI.Form.buffer[obj.field] = {};
			var ss = obj.valueFormat.split(","),vs;
			for(var i=0;i<ss.length;i+=1){
				vs = ss[i].split("=");
				GUI.Form.buffer[obj.field][vs[0]] = vs[1];
			}
		}
		return GUI.Form.buffer[obj.field][value] ? GUI.Form.buffer[obj.field][value] : value;
	}
	return value;
};
GUI.Form.AddSelectItem = function( id, dtobj ){	//往select中添加项,下拉框的数据填充
	if(id && dtobj){
		var obj = $(id);
		if(obj != null) {
			obj.options.length = 0;
			for ( var i = 0; i < dtobj.length; i += 1) {
				obj.options.add(new Option(dtobj[i].lable, dtobj[i].value));
			}
			obj = $(obj.id + "_icon");
			if (obj)
				obj.className = "GUI_Form_select_refresh";
		}else{
			Gwin.alert("没有找到填充对象!");
		}
	}
};
GUI.Form.fnSelectRefresh = function( id, ts, e ){
	var obj = $(id+"_"+ts);
	if(obj){
		e.target.className = "GUI_Form_select_loading";
		var url = obj.getAttribute("action");
		GUI.Ajax.submit({type:"post",url:url+"&TS="+ts.toUpperCase(),cache:false,fnSuccess:function( data ){
			GUI.Form.AddSelectItem(obj.id,GUI.Util.toJson(data));
		},fnFailure:function( state ){
			Gwin.alert("系统提示","加载数据异常,请重试!",'X',document);
		}});
	}
};
GUI.Form.fnRCbox = function(e,fname){	//单选框,复选框,change事件
	var obj = GUI.isIE ? e.srcElement : e.target;
	var ss = obj.id.split("_"),id = ss[0]+"_"+ss[1],cln = "GUI_Form_YZ_";
	var bool = GUI.Form.validation(obj,fname);
	GUI.Form.validationState[id+"_0"].state = bool;
	obj = $(id+"_0_icon");
	if(obj){
		obj.className = "GUI_Form_YZ_"+bool;
	}
};
GUI.Form.fnFocus = function(e,fname){
	var obj = GUI.isIE ? e.srcElement : e.target; 
	var bool = GUI.Form.validation(obj,fname);
	var id = obj.id;
	GUI.Form.validationState[id].state = bool;
	if(id){
		if(obj.getAttribute("showType")==="date" && e.type){
			WdatePicker({dateFmt:obj.getAttribute("dateFormat")});
		}
		obj = $(id+"_icon");
		if(obj){
			obj.className = "GUI_Form_YZ_"+bool;
		}
	}
};
GUI.Form.fnBlur = function(e,fname){
	var obj = GUI.isIE ? e.srcElement : e.target; 
	var bool = GUI.Form.validation(obj,fname);
	var id = obj.id;
	GUI.Form.validationState[id].state = bool;
	if(id){
		obj = $(id+"_icon");
		if(obj){
			obj.className = "GUI_Form_YZ_"+bool;
		}
	}
};
GUI.Form.fnReturnValue = function( obj, isT ){
	var winID = obj.id.split("_Iframe")[0];
	Gwin.close("progress_id");//关闭进度条
	if(obj){
		var state = obj.contentWindow.document.getElementById("state");
		if(state){
			if(state.value === "T"){
				if(isT){	//是主表的保存
					GUI.List.getListData();	//刷新列表
					GUI.Form.closeWin(winID);
				}else{	//子集操作保存成功后就关闭
					GUI.Form.fnGetSubsetData();	//更新列表
					GUI.Form.closeWin(winID);
				}
				Gwin.alert("系统提示","操作成功!",'Y',document);
			}else{
				Gwin.alert("系统提示","操作失败!"+(state.value != "F" ? state.value : ""),'X',document);
			}
		}else{
			//加载时候的一次调用.无用!
		}
	}else{
		Gwin.alert("系统提示","404错误,找不到服务器!",'X',document);
	}
};
GUI.Form.fnCheckForm = function( ts ){	//form编号,子集S,主单T
	if(GUI.Form.validationForm( ts, 'check' )){
		for(var id in GUI.Form.validationState){
			GUI.Form.validationState[id].state = false;
		}
		Gwin.progress("正在保存...", 15, document);
		return true;
	}
	return false;
};
GUI.Form.fnResetForm = function( id, str ){ //form编号,子集S,主单T
	var obj = $(str+"_"+id+"_Form");
	if(obj)obj.reset();
};
GUI.Ajax.submit = function( obj ){
	this.ajaxConnection+=1;
	obj.cache = obj.cache ? obj.cache : true; 
	var xmlHttp = this.getXmlHttp(),c = obj.url.indexOf("?") === -1 ? '?' : '&';
	obj.url += c + (obj.cache ? "cache=true" : "cache="+new Date().getTime());
	obj.url += "&CP="+GUI.jsBean.classPath+"&ET="+GUI.jsBean.ET;
	xmlHttp.open(obj.type, obj.url, true);
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			if( obj.fnSuccess && typeof obj.fnSuccess === 'function' ){
				obj.fnSuccess( xmlHttp.responseText );
			}
			xmlHttp.abort();
			GUI.Ajax.ajaxConnection -=1;
		}else{
			if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
				if( obj.fnFailure && typeof obj.fnSuccess === 'function' ){
					obj.fnFailure( xmlHttp.status );
				}
				xmlHttp.abort();
				GUI.Ajax.ajaxConnection -=1;
			}
		}
	};
	xmlHttp.send(null);
};
GUI.Ajax.getXmlHttp = function(){
	var bool = this.xmlHttpList.length === 0,i;
	var length = this.xmlHttpList.length > 0 ? this.xmlHttpList.length : 3;
	for(i=0;i<length;i+=1){
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
};
GUI.Ajax.init = function(){
	this.xmlHttpList = [];
	this.ajaxConnection = 0;
	this.getXmlHttp();
};
GUI.Util.load = function( fun, dom ){
	dom.onreadystatechange = function(){
		if(dom.readyState == "complete"){
			fun( dom );
			dom.onreadystatechange = null;
		}
	}
};
GUI.Util.toJson = function(str){return (new Function("return " + str))();};	//将字符串解析为json对象


//****************************验证*******************************//
GUI.Form.validation = function( obj, fname ){		//obj=当前对象 fname=用户自定义函数
	if(fname != undefined){
		var vname = GUI.Util.getObjVname( obj );
		if(fname.length > 0){
			//传递当前对象,	取值属性名称,	T(主表) || S(子集)
			var msg = eval(fname+"('"+obj.id+"','"+vname+"','"+(obj.id.indexOf("_t") ? 'T' : 'S')+"')");
			if(msg && msg.length > 0){
				GUI.Util.showTip( obj, msg );
			}else{
				GUI.Util.hiddenTip( obj );
				return true;
			}
		}else{	//默认执行不为空验证
			if(vname === "value" && obj[vname].length > 0){
				GUI.Util.hiddenTip( obj );
				return true;
			}else
			if(vname === "checked"){
				var i=0,temp,ss = obj.id.split("_");
				var id = ss[0]+"_"+ss[1];
				while(true){
					temp = $(id+"_"+i);
					i+=1;
					if(temp){
						if(temp.checked){
							GUI.Util.hiddenTip( obj );
							return true;
						}
					}else{
						GUI.Util.showTip(obj, "此项不能为空!");
						return false;
					}
				}
			}else{
				GUI.Util.showTip(obj, "此项不能为空!");
			}
		}
	}
	return false;
};
GUI.Form.validationForm = function( ts, type ){	//验证表单,成功返回true,失败返回false,第一个失败还是会将其它验证. type=什么操作
	var obj,bool = true,fid = null;
	for(var id in GUI.Form.validationState){
		if(id.indexOf("_"+ts) > 0){
			if(type === "view"){	//是查看模式就隐藏所有验证图标
				obj = $(id+"_icon");
				if(obj)obj.className = "";
			}else{
				obj = $(id);
				if(obj != null){
					GUI.Form.fnFocus((GUI.isIE ? {srcElement:obj} : {target:obj}),GUI.Form.validationState[id].vfun);
					if(GUI.Form.validationState[id].state === false){ bool = false;fid = id;}
				}
			}
		}
	}
	if(type != "view" && type != "check"){
		GUI.Util.hiddenTip();	//隐藏tip
	}else
	if(fid != null){	//如果有10个,当第3个验证错误.后面全部成功,就会出现不显示tip问题,这里将解决.(注:共用的是1个tip对象)
		obj = $(fid);
		GUI.Form.fnFocus((GUI.isIE ? {srcElement:obj} : {target:obj}),GUI.Form.validationState[id].vfun);
	}
	return bool;
};
GUI.Util.getObjVname = function( obj ){		//根据对象标签名称判断应该取哪个属性进行取值
	switch (obj.tagName) {
	case "INPUT":{
		var type = obj.type.toLowerCase();
		if(type == "text" || type == "password"){
			return "value";
		}else
		if(type == "checkbox" || type == "radio"){
			return "checked";
		}else{
			return "value";
		}
	}
	default:{return "value";}
}
};
GUI.Util.showTip = function( obj, msg ){		//显示
	var tipobj = GUI.Util.getFormTipObj( obj, false );
	if(tipobj.tip){
		tipobj.tip.innerHTML = msg;
		tipobj.tip.style.display = tipobj.tipin.style.display = tipobj.tipout.style.display = "";
	}
};
GUI.Util.hiddenTip = function( obj ){			//隐藏
	var tipobj = GUI.Util.getFormTipObj( obj, true );
	if(tipobj.tip){
		tipobj.tip.style.display = tipobj.tipin.style.display = tipobj.tipout.style.display = "none";
	}
};
GUI.Util.formTipBuffer = {id:'',tipobj:{}};		//缓存起来
GUI.Util.getFormTipObj = function( obj, isHidden ){		//如果是隐藏操作要获取tip对象时候,可以通过isHidden优化
	if(obj == undefined){	//不传递任何参数直接隐藏
		return {tip:$("GUI_FormTip_tip"),tipin:$("GUI_FormTip_in"),tipout:$("GUI_FormTip_out")};
	}
	if(obj.id === GUI.Util.formTipBuffer.id){
		return GUI.Util.formTipBuffer.tipobj;
	}
	var tip = $("GUI_FormTip_tip"),tipin,tipout;
	if(tip){
		tipin = $("GUI_FormTip_in");
		tipout = $("GUI_FormTip_out");
	}else{
		tip = document.createElement("div");
		tip.id = "GUI_FormTip_tip";
		tipout = document.createElement("div");
		tipout.id = "GUI_FormTip_out";
		tipin = document.createElement("div");
		tipin.id = "GUI_FormTip_in";
		tipout.onclick = tipin.onclick = tip.onclick = function(){
			tipout.style.display = tipin.style.display = tip.style.display = "none";
		}
		GUI.Util.setStyle(tip,{
			position:"absolute",
			border:"2px solid red",
			backgroundColor: "#FFFFCC",
			width: "123px",
			height: "50px",
			fontSize:"12px",
			fontWeight:"bold",
			align:"center",
			zIndex:9999,
			display:"none"
		});
		document.body.appendChild(tip);
		document.body.appendChild(tipin);
		document.body.appendChild(tipout);
	}
	if(isHidden){
		return {tip:tip,tipin:tipin,tipout:tipout};
	}
	var objxy = GUI.Util.getObjXY( obj );
	var temp = obj.type.toLowerCase();
	if(temp == "checkbox" || temp == "radio"){
		objxy.x -= 61.5 - (GUI.isIE ? 12 : 8);
	}
	var y = objxy.y - (temp == "textarea" ? 20 : obj.offsetHeight) - 50 + (GUI.isIE ? 12 : -2);
	var cssobj = {
			border:"12px solid transparent",
			position:"absolute",
			display:"none"
		};
	var tiphh = 0;
	if(y < 0){
		tiphh = GUI.isIE ? 40 : 22; 
		objxy.y = objxy.y + obj.offsetHeight+10;
		cssobj.borderBottomColor = "#FFFFCC";
	}else{
		tiphh = GUI.isIE ? 48 : 51; 
		objxy.y = y+8;
		cssobj.borderTopColor = "#FFFFCC";
	}
	GUI.Util.setStyle(tip,{backgroundColor: "#FFFFCC"});
	tip.style.left = objxy.x;
	tip.style.top = objxy.y;
	objxy.x += 48;
	GUI.Util.setStyle(tipout,cssobj);
	GUI.Util.setStyle(tipin,cssobj);
	if(y < 0){
		GUI.Util.setStyle(tipout,{
			borderBottomColor: "red",
			zIndex:9998,
			top:objxy.y - tiphh - 2,
			left:objxy.x
		});
		GUI.Util.setStyle(tipin,{
			zIndex:9999,
			top:objxy.y - tiphh,
			left:objxy.x
		});
	}else{
		GUI.Util.setStyle(tipout,{
			borderTopColor: "red",
			zIndex:9998,
			top:objxy.y + tiphh + 2,
			left:objxy.x
		});
		GUI.Util.setStyle(tipin,{
			zIndex:9999,
			top:objxy.y + tiphh,
			left:objxy.x
		});
	}
	GUI.Util.formTipBuffer = {id:obj.id,tipobj:{tip:tip,tipin:tipin,tipout:tipout}};	//缓存起来
	return GUI.Util.formTipBuffer.tipobj;
};
GUI.Util.setStyle = function( obj, css ){		//设置对象style属性
	for(var i in css){obj.style[i] = css[i];}
};
GUI.Util.getObjXY = function( obj ){		//获取该控件在界面上的坐标
	var xy,objxy = {x:0,y:0};
	xy = obj.offsetLeft; 
	var left = obj,top = obj;
	while(left = left.offsetParent){ //如果在某个对象中,那就要加上
		xy += left.offsetLeft; 
	}
	objxy.x = xy;
	xy = top.offsetTop; 
	while(top = top.offsetParent){ 
		xy += top.offsetTop; 
	}
	objxy.y = xy;
	return objxy;
};
/**
 * alert('提示信息')
 * alert('提示信息',function(id){id=窗口的编号})
 * alert('信息','提示信息')
 * alert('提示信息','Y,!,?,X')
 * alert('提示信息','Y,!,?,X',function(id){id=窗口的编号})
 * alert('提示信息','Y,!,?,X',3)		//定时关闭
 * alert('提醒','提示信息','Y,!,?,X')
 * alert('提醒','提示信息','Y,!,?,X',function(id){id=窗口的编号})
 */
GUI.Msg.alert = function(t,m,i,fn){
	if(GUI.Gwin != undefined){
		var winid= ""+new Date().getTime();
		var lh = arguments.length,dom;
		if(lh === 1){m=t;t='系统提示';i='!';}else
		if(lh === 2){
			if(GUI.isFun(m)){
				fn = m;	m = t; i = '!'; t = '系统提示';
			}else{
				if("Y,!,?,X,".indexOf(m) != -1){
					i=m;m=t;t='系统提示';
				}else{	i='!';	}
			}
		}else
		if(lh === 3){
			if(GUI.isFun(i)){
				fn = i;i=m;m=t;t='系统提示';
			}else{
				if("Y,!,?,X,".indexOf(i) == -1 && i > 0 && i < 600){  //是定时关闭
					var time = i;
					i=m;m=t;t="提醒("+time+"秒后自动关闭)";
					setTimeout("Gwin.close(\'"+winid+"\')",time*1000);
				}
			}
		}
		Gwin.open({
			id:winid,type:"message",title:t,icon:i,
			width:400,height:120,context:m,lock:true,dom: document,
			buttons:[{lable:'确定',click:function(){
				if(GUI.isFun(fn)){
					if(fn( winid ) === false)return false;
				}
				Gwin.close(winid);
			}}]
		}).show(winid);
	}
	return this;
};
/**
 * confirm('提醒内容',function( t ){ t == 1 })
 * confirm('提醒内容','确认,取消,',function( t ){ t == 1 })
 * confirm('提醒','提醒内容','确认,中断,暂停,下一步,取消,',function( t ){ t == 1 })
 */
GUI.Msg.confirm = function( title, msg, btns, fun, d ){
	var winid= ""+new Date().getTime();
	var lh = arguments.length;
	var backFun = function(){
		if(fun( this.lable, this.index ) != false){
			Gwin.close(winid);
		}
	};
	var btn = [];
	if(lh === 2 && GUI.isFun(msg)){
		fun = msg;
		msg = title;
		title = '询问';
		btns = '';
		btn.push({lable:'确认',index:1,click:backFun});
		btn.push({lable:'取消',index:2,click:backFun});
	}else
	if(lh === 3 && GUI.isFun(btns)){
		fun = btns;
		btns = msg;
		msg = title;
		title = '询问';
	}else
	if(lh != 4)return this;
	var btnList = btns.length > 2 ? btns.split(",") : [];
	for(var i=0,l=btnList.length;i<l;i+=1){
		btn.push({lable : btnList[i],index:i+1,click : backFun });
	}
	Gwin.open({
		id:winid,type:"message",title:title,icon:'?',width:400,height:120,context:msg,
		lock:true,dom: document,buttons:btn
	}).show(winid);
	return this;
};
///////////////////////////////////////////////
GUI.isIE = ((!+ [ 1, ]) ? true : false);
GUI.isFun = function( fn ) {
	return fn instanceof Function;
};
GUI.Ajax.init();
var $ = function(id){return document.getElementById(id);}	//根据ID取对象
document.onkeydown = function(e){	//F5刷新控制,防止无聊刷新
	if(e.keyCode === 116){				//F5		间隔设置在GUI.F5.t	默认5秒
		var dt = new Date();
		if(GUI.F5.m === dt.getMinutes()){	//同一分钟
			if(dt.getSeconds() - GUI.F5.s >= GUI.F5.t){
				GUI.F5.m = dt.getMinutes();
				GUI.F5.s = dt.getSeconds();
				return true;
			}
		}else{
			GUI.F5.m = dt.getMinutes();
			GUI.F5.s = dt.getSeconds();
			return true;
		}
		if(GUI.State.win != "hidden" || GUI.State.subset.win != "hidden"){
			GUI.Msg.confirm("当前弹出有窗口,确认要刷新吗?",'确认,取消',function( lable, index ){
				if(index === 1 || lable === "确认"){  //点击了确认按钮
					window.location.reload();
				}
			});
		}else{
			GUI.Msg.alert("您刷新速度过快,当前设置每隔"+GUI.F5.t+"秒允许刷新一次!","!",1); 
		}
		e.keyCode = 0;
		e.cancelBubble = true;
		return false;
	}
};