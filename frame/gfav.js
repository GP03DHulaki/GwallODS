
/***************************** 右键菜单 开始 *****************************/

function GMenu(_object, _menu) {
	this.IEventHander = null;
	this.IMenuHander = null;
	this.IContextMenuHander = null;
	this._GMenu = _menu
	
	// SHOW MENU
	this.Show = function (_menu) {
		var e = window.event || arguments.callee.caller.arguments[0];
		if (e.button == 2) {
			if (window.document.all) {
				this.IContextMenuHander = function () {
					return false;
				};
				document.attachEvent("oncontextmenu", this.IContextMenuHander);
			} else {
				this.IContextMenuHander = document.oncontextmenu;
				
				document.oncontextmenu = function () {
					return false;
				};
			}
			
			window.GMenu$Object = this;
			this.IEventHander = function () {
				window.GMenu$Object.Hide(_menu);	
			};
			
			if (window.document.all) {
				document.attachEvent("onmousedown", this.IEventHander);
			} else {
				document.addEventListener("mousedown", this.IEventHander, false);
			}
			
			obj = e.srcElement ? e.srcElement : e.target;
			$("selid").value = obj.parentNode.id ;
			
			_menu.style.left = e.clientX - 10;
			_menu.style.top = e.clientY;
			_menu.style.display = "";

			if ($(this.IMenuHander)) {
				var _iMenumain = $(this.IMenuHander);
				_iMenumain.style.left = e.clientX;
				_iMenumain.style.top = e.clientY;
				_iMenumain.style.height = _menu.offsetHeight;
				_iMenumain.style.width = _menu.offsetWidth;
				_iMenumain.style.display = "none";
			}
		}
	};
	
	// HIDE MENU
	this.Hide = function (_menu) {
		var e = window.event || arguments.callee.caller.arguments[0];
		var _element = e.srcElement ? e.srcElement : e.target;;
		do {
			if (_element == _menu) {
				return false;
			}
		} while ((_element = _element.offsetParent));
		
		if (window.document.all) {
			document.detachEvent("on" + e.type, this.IEventHander);
		} else {
			document.removeEventListener(e.type, this.IEventHander, false);
		}
				
		if ($(this.IMenuHander)) {
			$(this.IMenuHander).style.display = "none";;
		}
		
		_menu.style.display = "none";
		if (window.document.all) {
			document.detachEvent("oncontextmenu", this.IContextMenuHander);
		} else {
			document.oncontextmenu = this.IContextMenuHander;
		}
	};
	
	// _object 要弹出右键的HTML对象,_menu 要显示的菜单
	this.initialize = function (_object, _menu) {
		window._GMenu$Object = this;
		var _eventHander = function () {
			window._GMenu$Object.Show(_menu);
		};

		_menu.style.position = "absolute";
		_menu.style.display = "none";
		_menu.style.zIndex = "1000000";
		
		if (window.document.all) {
			var _gmenumain = document.createElement("div");
			$(_object).appendChild(_gmenumain);
			//document.body.insertBefore(_gmenumain, document.body.firstChild);
			_gmenumain.id = _menu.id + "_main";
			
			this.IMenuHander = _gmenumain.id;
			
			_gmenumain.className = "gmenu_menu_favorites";
			
			//GaddEvent(this.WHGObj,"mousedown",this.MouseDown,false);
			
			_object.attachEvent("onmouseup", _eventHander);
		} else {
			_object.addEventListener("mouseup", _eventHander, false);
		}
	};
	
	this.initialize(_object, _menu);
}

/***************************** 右键菜单 结束 *****************************/