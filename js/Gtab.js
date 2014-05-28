//显示tab（tabHeadId：tab头中当前的超链接；tabContentId要显示的层ID）
var showTab = function(tabHeadId,tabContentId) {
	//tab层
	var tabBody = $("tabsBody");
	//将tabBody层中所有的内容层设为不可见
	//遍历tabBody层下的所有子节点
	var taContents = tabBody.childNodes;
	for(i=0; i<taContents.length; i++) {
	    //将所有内容层都设为不可见
	    if(taContents[i].id!=null){
	        taContents[i].className = 'hidetab_body';
	    }
	}

	//将要显示的层设为可见
	$(tabContentId).className = 'curtab_body';
	//遍历tab头中所有的超链接

	var tabHeads = $('tabsHead').getElementsByTagName('a');
	for(i=0; i<tabHeads.length; i++){ 
	    //将超链接的样式设为未选的tab头样式
	    tabHeads[i].className='tabs'; 
	}

	//将当前超链接的样式设为已选tab头样式
	$(tabHeadId).className='curtab';
	$(tabHeadId).blur();
}