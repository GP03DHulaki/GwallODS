var Gwallregion = new function() {
	this.regionshow = function(obj){
		obj = typeof(obj)=='string'?document.getElementById(obj):obj;
		if (obj.className == "ctrl_show"){
			obj.className = "ctrl_hide";
			var objid = obj.id;
			var keypos = objid.indexOf("_ctrl");
			if (keypos>0){
				var node = document.getElementById(objid.substring(0,keypos));
				node.style.display = "none";
			}
		} else if (obj.className == "ctrl_hide"){
			obj.className = "ctrl_show";
			var objid = obj.id;
			var keypos = objid.indexOf("_ctrl");
			if (keypos>0){
				var node = document.getElementById(objid.substring(0,keypos));
				node.style.display = "block";
			}
		}
	}
}
