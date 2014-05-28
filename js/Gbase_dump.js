
var oEventUtil = new Object();
//事件处理
oEventUtil.AddEventHandler = function(oTarget,sEventType,fnHandler)
{
	//如果是FF
	if(oTarget.addEventListener){
		oTarget.addEventListener(sEventType,fnHandler,false);
	} 
	//如果是IE
	else if(oTarget.attachEvent){
		oTarget.attachEvent('on'+sEventType,fnHandler);
	} else{
		oTarget['on'+sEventType] = fnHandler;
	}
};
