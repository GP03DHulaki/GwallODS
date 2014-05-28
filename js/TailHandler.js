var TailHandler = function (inout) {
	var isBlur = 1;//数量是否允许输入
	var batp = '04';//条码类型
	var batpId = 'edit:batp';//条码类型元素id
	var batpNo = '0';//条码类型默认checked
	var qty = 'edit:qty';//数量对象id
	var baco = 'edit:baco';//条码对象id
	var dwhid = 'edit:dwhid';//库位对象id
	var addButton = 'edit:addDBut';//添加按钮id
	var tabCount = 2;//循环切换最大数量
	var autoItem = 'edit:autoItem';//自动添加明细元素id
	var isAutoAdd = 0;//设置是否自动添加明细
	var setBarId = 'edit:setCode4DBean';
	var iBatpId = batpId+':'+batpNo;
	
	var lastElement = dwhid;//设置触发点击添加按钮的元素
	
	var firstElement = baco;//设置触发点击添加按钮的元素
	
	var keyPressHandler = function(event){
		var e=window.event||event;
	    var key=window.event?e.keyCode:e.which;
	    if(key==120) {//如果为F9则触发切换条码类型
	    	$(baco).focus();
	    	batpNo++;
	    	if(batpNo == tabCount || !$(batpId+':'+batpNo)){
	    		batpNo = '0';
	    	}
	    	$(batpId+':'+batpNo).checked = true;
	    	$(batpId+':'+batpNo).onclick();
	    }
	};
	
	var tailEle = new Array(); 
	if(inout=='in'){
		tailEle.push(baco);
		tailEle.push(qty);
		tailEle.push(dwhid);
		lastElement = dwhid;
	}else if(inout=='out'){
		tailEle.push(dwhid);
		tailEle.push(baco);
		tailEle.push(qty);
		lastElement = baco;
	}
	
	document.onkeydown = keyPressHandler;//注册页面键盘事件
	
	return {
		// 明细元素定位
		elementFocus : function (){
			for(i=0;i<tailEle.length;i++){
				if(tailEle[i]==qty){
					if(isBlur==1){
						if(this.objFocus($(tailEle[i]))==0)return 0;
					}
				}else{
					if(this.objFocus($(tailEle[i]))==0)return 0;
				}
			}	
			
			//$(addButton).onclick();
			
			/*
			if(isBlur!=1){
				$(lastElement).focus();
				return;
			}
			*/
		},
		
		keyPressDeal : function(obj){
			var e=window.event||event;
		    var key=window.event?e.keyCode:e.which;
		    if(key==13){
		    	if(batp=='02' && obj.id==baco && obj.value!=''){//如果为箱,则查询箱条码
		    		$(setBarId).onclick();
		    	}else{
		    		if(this.elementFocus() != 0){
			    		if(obj.id==lastElement && obj.value.Trim()!=''){
			    			$(addButton).onclick();
			    		}
			    	}
			    	
			    	if(isAutoAdd!=1 && obj.id!=lastElement){
			    		$(lastElement).focus();
			    		return;
			    	}
		    	}
		    }
		},
		
		// 
		objFocus : function(obj){
			if(obj){
				if(obj.value == ''){
					obj.focus();
					return 0;
				}
			}
			return 1;
		},
		// 设置光标是否允许定位
		canFocus : function(obj){
			if(isBlur!=1){
				obj.blur();
			}	
		},
		// 
		batyClick : function(obj){
			batp = obj.value;
			iBatpId = obj.id;
			if(obj.value == '04'){
				isBlur = 1;
			}else{
				isBlur = 0;
			}
			if((obj.value == '03') || (obj.value == '04' && isAutoAdd==1)){
				if($(qty)){
					$(qty).value='1';
				}
				return;
			}
			if(obj.value == '04' && isAutoAdd==0){
				if($(qty)){
					$(qty).value='';
				}
				return;
			}
		},
		
		initClick : function(){
			$(iBatpId).onclick();
		},
		
		keyPressToObj : function(obj,focusoid){
			var e=window.event||event;
		    var key=window.event?e.keyCode:e.which;
		    if(key==13){
		    	if(obj.value.Trim()!=''){
		    		$(focusoid).focus();
		    	}
		    }
		},
		
		setCode4DBean : function(obj){
			if($(baco).value!=''){
				$(setBarId).onclick();
			}	
		},
		
		
		/**set内部变量公共方法*/
		setIsBlur : function(val){
			isBlur = val;
		},
		
		setBatp : function(val){
			batp = val;
		},
		
		setBatpId : function(val){
			batpId = val;
		},
		
		setBatpNo : function(val){
			batpNo = val;
		},
		
		setQty : function(val){
			qty = val;
		},
		
		setBaco : function(val){
			baco = val;
		},
		
		setDwhid : function(val){
			dwhid = val;
		},
		
		setAddButton : function(val){
			addButton = val;
		},
		
		setTabCount : function(val){
			tabCount = val;
		},
		
		setIsAutoAdd : function(val){
			isAutoAdd = val;
			if(batp=='04' && isAutoAdd=='1'){
				if($(qty)){
					$(qty).value=1;
				}
			}
			if(batp=='04' && isAutoAdd=='0'){
				if($(qty)){
					$(qty).value='';
				}
			}
		},
		
		setAutoItem : function(val){
			autoItem = val;
		},
		
		setLastElement : function(val){
			lastElement = val;
		},
		
		setFirstElement : function(val){
			firstElement = val;
		},
		
		/**get内部变量公共方法*/
		getBatp : function(){
			return batp;
		},
		
		getBaco : function(){
			return baco;
		},
		
		getQty : function(){
			return qty;
		},
		
		getIsAutoAdd : function(){
			return isAutoAdd;
		}
		
	};
	
};

