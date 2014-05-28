	
	var isInitSynchronous = true;	//是载入界面时候的同步.不给出提示框
	/**
	 * 界面载入事件
	 * @return
	 */
	function init(){
		$("list:synchronousBtn").click();	//同步一下数据
	}

	//定时的控制设置的方式按钮
	function InputTimeFun(e){
		var its = $("InputTime_span");
		var sts = $("SelectTime_span");
		if(its.style.display === "none"){
			its.style.display = "";
			sts.style.display = "none";
			e.srcElement.value = "选择";
		}else{
			its.style.display = "none";
			sts.style.display = "";
			e.srcElement.value = "输入";
		}
	}
	//选择定时
	function getSelect(){
		var value = $("time_m").value +" "+$("time_f").value+" "+$("time_h").value+" "+$("time_r").value+" "+$("time_y").value+" "+$("time_z").value;
		getTimeMsg(value);
	}
	//得到设置的定时含义
	function getTimeMsg( value ){
		var vs = value.split(" ");
		var sjhy = $("sjhy"),msg="<font color='red' size=1>",msgend = "</font>";
		if(vs.length != 6 ){
			sjhy.innerHTML = msg+"格式错误,应该是6段,并以空格分隔."+msgend;
			return;
		}
		var tz = ["星期天","星期一","星期二","星期三","星期四","星期五","星期六"];
		var t_m = vs[0];
		var t_f = vs[1];
		var t_h = vs[2];
		var t_r = vs[3];
		var t_y = vs[4];
		var t_z = vs[5];
		if(t_z === "?" && t_r === "?"){
			msg += "错误,日和周不能同时出现不限制!";
			sjhy.innerHTML = msg+msgend;
			return;
		}
		if(t_y === "*"){
			msg += "每个月的";
		}else{
			msg += t_y+"月";
		}
		if(t_r === "?"){
			msg += t_z === "?" ? "每一天" : ((t_y != "*" ? "中所有的" : "")+(tz[(t_z*1)])+",");
		}else{
			msg += t_r+"号" + (t_z != "?" ? "并且"+t_r+"号是"+(tz[(t_z*1)])+"的时候," : "");
		}
		if(t_h === "*" && t_f === "*" && t_m === "*"){
			msg += "运行一整天!";
			sjhy.innerHTML = msg+msgend+"&nbsp;&nbsp;&nbsp;&nbsp;"+value;
			$("edit:jotm").value = $("inputTime").value = value;
			return;
		}
		if(t_h === "*"){
			msg += "每小时";
		}else{
			var th = t_h*1;
			if(th > 8 && th < 12) msg +="上午";else
			if(th > 11 && th < 14) msg +="中午";else
			if(th > 13 && th < 17) msg +="下午";else
			if(th > 17 && th < 19) msg +="傍晚";else
			if(th > 18 && th < 24) msg +="晚上";else
			if(th === 0) msg +="午夜";else
			if(th > 0  && th < 6) msg +="凌晨";else
			if(th > 5 && th < 9) msg +="早上";
			msg += (th === 0 ? "" : (th+"点"));
		}
		if(t_f === "*"){
			msg += "每分钟";
		}else{
			if(t_f === "30") msg += "半";else msg += "过"+t_f+"分";
		}
		if(t_m === "*"){
			msg += "的每一秒都执行!";
		}else{
			msg += "第"+t_m+"秒的时候执行!";
		}
		$("edit:jotm").value = $("inputTime").value = value;
		sjhy.innerHTML = msg+msgend+"&nbsp;&nbsp;&nbsp;&nbsp;"+value;
	}
	//提取公共
	function checkValue(obj){
		if(obj.value.length == 0){
			return false;
		}
		var v = obj.value;
		if(v.charAt(v.length-1) == ";")obj.value = v.substring(0,v.length-1);
		if(v.indexOf(":")!=-1){
			alert("不能包含:符号!");
			return false;
		}
		return true;
	}
	/**
	 * 添加邮箱地址
	 *  不传tip就是验证
	 * @return
	 */
	function AddEmail( obj,tip ){
		if(!checkValue(obj))return false;
		var list = obj.value.split(";");
		var count = 0,bool = true;
		for(var item in list){
			if(isEmail(list[item])){
				count ++;
			}else{
				if(tip){
					alert(list[item]+"格式错误!");
				}else{
					return false;
				}
			}
		}
		return true;
	}
	/**
	 * 添加方法
	 *  不传tip就是验证
	 * @return
	 */
	function AddClass( obj,tip ){
		if(!checkValue(obj))return false;
		var list = obj.value.split(";");
		var count = 0,bool = true,v;
		for(var item in list){
			v = list[item];
			if(v.indexOf(".")!=-1 && v.indexOf("(")!=-1 && v.indexOf(")")!=-1){
				count ++;
			}else{
				if(tip){
					alert(list[item]+"格式存在错误!");
				}else{
					return false;
				}
			}
		}
		return true;
	}
	/**
	 * Email
	 */
	function isEmail (str) {   
        var reg = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;   
        var bool = reg.test(str);
        MSG = bool ? "Email验证通过!" : "请输入正确的Email!";
        return bool;   
    }   
	
	
	
	function startDo(){
		Gwallwin.winShowmask("TRUE");
	}

	function endDo(st){
		Gwallwin.winShowmask("FALSE");
		var message = $("edit:msg").value;
		if(st){	//是同步时候
			if(!isInitSynchronous){//是主动的就提醒
				alert(message);
			}else{
				isInitSynchronous = false;//一次就够了
			}
		}else{
			if(message.indexOf("成功!")!=-1){
				hideDiv();
			}
			alert(message);
		}
	}
	function setState(obj,type){
		var arr=Gtable.getselectid(obj);
		var msg = "确定要"+(type =="pause" ? "暂停" : (type == "start" ? "启动" : (type == "stop" ? "终止" : (type == "resume" ? "恢复" : "立即执行一次"))))
		+"当前选中的作业吗?";
		var endmsg = "如果当前距离上次暂停期间耽搁了N(N>0)次正常执行.恢复后就会立即弥补一次执行!";
		if(type == "pause" || type == "resume") msg+=endmsg;
	    if(arr.length>0){		    	
	    	if(!confirm(msg)){
				return false;
			}else{
				$("list:sellist").value=arr;
				startDo();
			}
		}else{
		   	alert("请选择作业!");
		   	return false;
		}
		return true;	
	}
    function deleteAll(obj){		
		var arr=Gtable.getselectid(obj);
	    if(arr.length>0){		    	
	    	if(!confirm('确定删除当前记录吗?')){
				return false;
			}else{
				$("list:sellist").value=arr;
				startDo();
			}
		}else{
		   	alert("请选择要删除的记录!");
		   	return false;
		}
		return true;		
	}
	// 验证id="edit"的form表单
	function formCheck(){	
		var obj = $("edit:joid");
		if(obj.value==null ||obj.value.length<=0){
			alert("作业编码不能为空!");
			obj.focus();
			return false;
		}
		obj = $("edit:jona");
		if(obj.value==null ||obj.value.length<=0){
			alert("作业名称不能为空!");
			obj.focus();
			return false;
		}
		obj = $("edit:jogn");
		if(obj.value==null ||obj.value.length<=0){
			alert("所在组不能为空");
			obj.focus();
			return false;
		}
		obj = $("rema");
		if(obj.value==null ||obj.value.length<=0){
			alert("此任务说明不能为空!");
			obj.focus();
			return false;
		}
		//创建人  com.gwall.job.GwallJob.test().test("123",223.21);com.gwall.job.GwallJob.test(1,'32fff')
		//测试是更新JS后的调用方法,和发送邮件方法是否有问题!  124259568@qq.com;594828209@qq.com
		$("edit:ctna").value = $("userName").value;	
		//动作
		var type = $("edit:joty").value = "Run" + ($("joty2").checked ? ";"+$("joty2").value : "");
		//作业说明
		var v = $("rema").value;
		for(var i=0;i<v.length;i++){
			if(i%40 == 0)v=v.substring(0,i)+"\n"+v.substring(i,v.length);
		}
		$("edit:rema").value = v; 
		//调用方法,邮箱地址
		var cp = $("classPath").value, ed = $("emailAddress").value;
		if(cp.length >0){v = cp = "RunClass:"+cp;}else v = "";
		if(ed.length >0){if(v.length>0){v+="##@@##";}v += "ToEmail:"+ed;}
		$("edit:jopm").value = v;
		return true;
	}

	function addDiv(){
		$("edit:joid").value = $("edit:jogn").value = $("edit:jona").value = "";
		$("edit:updateflag").value = "ADD";
		getSelect();
		showDiv("新增");
		setDisabled(false);
		$("edit:saveBtn").style.display = "";
	}
	
	// 浏览
	function viewFun(id){
		$("edit:selid").value = id;
		$("edit:updateflag").value = "VIEW";
		Gwallwin.winShowmask("TRUE");
		$("edit:view").click();	
	}
	
	// 点击详细角色按钮时调用的方法
	function view_show(){
		Gwallwin.winShowmask("FALSE");
		showDiv("查看");// 显示层
		setDisabled(true);
	}
	/**
	 * 是新增就false,是浏览就true
	 * @param bool
	 * @return
	 */
	function setDisabled(bool){
		bool ? $("edit:jotmBtn").click() : false;	// 进入输入模式
		$("edit:joid").disabled=bool;
		$("edit:jogn").disabled=bool;
		$("edit:jona").disabled=bool;
		$("edit:stat").disabled=bool;
		var obj,jopm = $("edit:jopm").value.split("##@@##");
		var nlist = ["RunClass","ToEmail"],ilist = ["classPath","emailAddress"];
		for(var j=0;j<nlist.length;j++){
			for(var i=0;i<jopm.length;i++){
				if(jopm[i].indexOf(nlist[j])!=-1){
					obj = $(ilist[j]);
					obj.value = bool ? jopm[i].split(":")[1] : "";
					obj.disabled = bool;
					if(ilist[j] == "emailAddress" && bool){
						obj.parentNode.style.display = "";
					}
				}
			}
		}
		obj = $("rema");
		obj.value = bool ? $("edit:rema").value : "";
		obj.disabled = bool;
		$("edit:saveBtn").style.display = bool ? "none" : "";
		var it = $("inputTime");
		it.value = bool ? $("edit:jotm").value : "";	// 得到间隔数据
		if(it.offsetWidth > 0){
			it.focus();
			it.blur();	// 生成含义
		}
		it.disabled=bool;	//间隔
		$("edit:jotmBtn").disabled = bool;
		$("actionAdd").style.display = bool ? "none" : "";
		var sp = $("actionView");
		sp.style.display = bool ? "" : "none";
		sp.innerHTML = $("edit:joty").value;
	}

	// 显示层
	function showDiv(title){
		Gwallwin.winShow("edit",title,640,370,20,20);
	}
	
	// 隐藏层
	function hideDiv(){
		Gwallwin.winClose();		
	}