<!--
function doSubmit()
	{	
		if(event.keyCode==13)
		{
			document.forms[0].submit();
		}
	}
function formsubmit(){
		if (event.keyCode==13)
		{
			var obj=$("list:sid");
			obj.onclick();
			return true;
		}
	}	
	
	function startDo(){
	    Gwin.progress("",10,document);
	}
	
	function addDiv(){
		alert(1);
		$("edit:appkey").disabled="";//"禁用".
		$("edit:updateflag").value = "ADD";
		showDiv("新增");
		clearText();
	}

	function clearText(){
		textClear('edit','appkey,secret,sessionKey,url','N');
		//$('edit:stat').value='1';
	}

	//显示层	function showDiv(title){
		Gwin.open({
			id:"brandWin",	
			title:title,
			contextType:"ID",
			context:"edit",
			dom:document,
			width:480,
			height:140,
			autoLoad:false,
			showbt:false,
			lock:true
		}).show("brandWin");
		if(title.indexOf("新增")!=-1)Gwin.setLoadok("brandWin");
	}
	
	//隐藏层	function hideDiv(){
		Gwin.close("brandWin");
	}
	
	//编辑回调
	function Edit(id){
		showDiv("编辑");
		$("edit:selid").value = id;
		$("edit:editbut").click();
	}

	//点击编辑按钮
	function edit_show(){
		$("edit:updateflag").value="EDIT";
		$("edit:appkey").disabled = "true";
		Gwin.setLoadok("brandWin");
	}
	var delstate = false;
	function deleteAll(obj)	{	
		if(delstate){
			delstate = false;
			return true;
		}else{
			var arr = Gtable.getselectid(obj);
			if(arr.length>0){
				Gwin.confirm("showMsg2","系统提示","确定要删除选中的数据吗?","?",document,
					[{lable:'确定',click:function(){
						$("list:sellist").value = arr;
						Gwin.progress("正在删除...",10,document);
						delstate = true;
						$("list:delButton").onclick();
						Gwin.close("showMsg2");
					}},
					{lable:'取消',click:function(){
						Gwin.close("showMsg2");
					}}]);
			}else{
				Gwin.alert("系统提示","请选择要需要删除的数据!","!",document);
		   }
		}
		return false;	
	}
	//验证form
	function formCheck(){
		var bran = document.getElementById("edit:appkey");
		if(bran==null || bran.value.Trim().length<=0){
			Gwin.alert("系统提示","appkey不能为空！","!",document);
			$("edit:appkey").focus();
			return false;
		}else{
			if(existzh_CN(bran.value)){
				Gwin.alert("系统提示","不能为中文!","!",document);
				bran.value="";
				bran.focus();
				return false;
			}
		}
		var secret = document.getElementById("edit:secret");
			if(secret==null || secret.value.Trim().length<=0){
			Gwin.alert("系统提示","品牌名称不能为空！","!",document);
			$("edit:secret").focus();
			return false;
		}
		Gwin.progress("正在保存...",10,document);
		return true;
	}	
	
	function endDo()
	{	
		Gwin.close("progress_id");
		var message = $("list:msg").value;
		var type = "Y";
		if(message.indexOf("成功")!=-1){
			clearText();
			Gwin.close("brandWin");
		}else{ 
			type = "X";
		}
		Gwin.alert("系统提示",message,type,document);
	}

	function clearData(){
		if($('list:appkey')!=null){
			$('list:appkey').value="";
			$('list:appkey').focus();
		}
		if($('list:url')!=null){
			$('list:url').value="";
			$('list:url').focus();
		}
		if($('list:secret')!=null){
			$('list:secret').value="";
			$('list:secret').focus();
		}
		if($('list:sessionKey')!=null){
			$('list:sessionKey').value="";
			$('list:sessionKey').focus();
		}
	}
	
//-->