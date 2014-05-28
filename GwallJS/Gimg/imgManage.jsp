<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>图片管理</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<META http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<script type="text/javascript" src="GwallJS/Gimg/GimgCode.js"></script>
	<style type="text/css">
		input{BORDER-RIGHT: #7b9ebd 1px solid; PADDING-RIGHT: 2px; BORDER-TOP: #7b9ebd 1px solid; 
		PADDING-LEFT: 2px; FONT-SIZE: 12px; FILTER: progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr=#ffffff, EndColorStr=#cecfde); 
		BORDER-LEFT: #7b9ebd 1px solid; CURSOR: hand; COLOR: black; PADDING-TOP: 2px; BORDER-BOTTOM: #7b9ebd 1px solid
		}
		iframe{display:none;}b{font-size: 12;}		
		.loading{width:200;height:20;background-color:#EEEEF3;border:#7b9ebd 1px solid;}
		.loading2{text-align:center;font:14px;width:0;height:20;background-color:#99FF99;}
	</style>
	<script type="text/javascript">
		var color = parent.parent.Gskin ? parent.parent.Gskin.skinObj.color : "#DEE8F4";
		document.write('<style type="text/css">');
		document.write('.tabcss{width:100%;background-color:'+color+'}');
		document.write('#upFileBox{width:100%;border:'+color+' 2px solid;padding:2px;}');
		document.write('#upbox{border-top:'+color+' 2px solid;border-right:'+color+' 2px solid;border-left:'+color+' 2px solid;padding:2px;}');
		document.write('.divcss{border-bottom:'+color+' 2px solid;border-right:'+color+' 2px solid;border-left:'+color+' 2px solid;padding:2px;}');
		document.write('</style>');
	</script>
  </head>
  <body onload="Gimg.init('<%=request.getParameter("savePath")%>')" style="margin:0;">
  	<div id="winBox">
  		<div id="viewbox" align="center" style="display:none;padding:0;">
    		<img src="" id="viewimg" ondblclick="Gimg.showImg()" oncontextmenu="return Gimg.showImg();"/>
    	</div>
    	<div id="imgbox">
    		<table><tr><td valign="top">
			    	<div id="upbox" style="display:none;height:auto;">
			    		<table id="imgboxtitle" class="tabcss"><tr>
			    		<td align="left"><b>可选图片列表【<span id="imgscount">0</span>】</b></td>
			    		<td align="right">
			    			<input type="button" value="刷新" onclick="Gimg.refreshImgList()"/>
			    			<input type="button" value="删除" onclick="Gimg.delImgFiles()"/>
			    			<input type="button" value="上传" onclick="Gimg.addImgFiles(this)"/>
			    		</td></tr></table>
			    		<span id="loadingMsg" style="display:none;width:100%;height:100%;padding:100px;text-align:center;font-size:12;"><b>请稍等,正在努力加载图片...</b></span>
			    		<div id="imgList" style="padding:2px;overflow-y:auto;"></div>
			    	</div>
	    			<table height="20" class="tabcss">
	    			<tr><td align="left" width="30%"><b>已选图片【<span id="selectcount">0</span>】</b></td>
		    			<td id="updownbtn" align="center" width="38%" style="display:none">
			    			<input type="button" value="向下" onclick="Gimg.downClick()"/>
			    			<input type="button" value="向上" onclick="Gimg.upClick()"/>
		    			</td>
		    			<td align="right" width="26%">
		    				<input type="button" value="清空选择" onclick="Gimg.clearSelectImg()"/>
		    				<input type="button" value="添加" onclick="Gimg.showAllImg(this)"/>
		    		</td></tr></table>
			    	<div id="selectList" style="overflow-y:auto;" class="divcss"></div>
			    	<div id="bottombutton" align="center" class="divcss">
			    		<input type="button" value=" 确 认 " onclick="Gimg.getImgPathList()"/>
			    	</div>
		    </td><td valign="top">
		    	<div id="upFileBox" style="display:none;">
	    		<table class="tabcss"><tr><td align="left">
			    	<b>上传列表【<span id="upimgcount">0</span>】</b>
		   		</td><td align="right">
		    		<input type="button" value="开始上传" id="upimgbutton" onclick="Gimg.upImgFiles();"/>
		    	</td></tr></table>
		    	 <div style="font-size:14px;overflow-y:auto;">
			    	<form method="post" action="GwallJS/Gimg/upFile.jsp?upFile=1&savePath=<%=request.getParameter("savePath") %>" id="upImgForm1" name="upImgForm1" ENCTYPE="multipart/form-data" target="hidden_frame1">
						File1:<input id="upFile1" name="upFile1" type="file" class="fileInput" onchange="Gimg.selectFile(this)"/>
						<iframe name='hidden_frame1' onload="if(Gimg)Gimg.upFlieFinish(this)"  id="hidden_frame1"></iframe>
					</form>
					<form method="post" action="GwallJS/Gimg/upFile.jsp?upFile=2&savePath=<%=request.getParameter("savePath") %>" id="upImgForm2" name="upImgForm2" ENCTYPE="multipart/form-data" target="hidden_frame2">
						File2:<input id="upFile2" name="upFile2" type="file" class="fileInput" onchange="Gimg.selectFile(this)"/>
						<iframe name='hidden_frame2' onload="if(Gimg)Gimg.upFlieFinish(this)" id="hidden_frame2"></iframe>
					</form>
					<form method="post" action="GwallJS/Gimg/upFile.jsp?upFile=3&savePath=<%=request.getParameter("savePath") %>" id="upImgForm3" name="upImgForm3" ENCTYPE="multipart/form-data" target="hidden_frame3">
						File3:<input id="upFile3" name="upFile3" type="file" class="fileInput" onchange="Gimg.selectFile(this)"/>
						<iframe name='hidden_frame3' onload="if(Gimg)Gimg.upFlieFinish(this)" id="hidden_frame3"></iframe>
					</form>
					<form method="post" action="GwallJS/Gimg/upFile.jsp?upFile=4&savePath=<%=request.getParameter("savePath") %>" id="upImgForm4" name="upImgForm4" ENCTYPE="multipart/form-data" target="hidden_frame4">
						File4:<input id="upFile4" name="upFile4" type="file" class="fileInput" onchange="Gimg.selectFile(this)"/>
						<iframe name='hidden_frame4' onload="if(Gimg)Gimg.upFlieFinish(this)" id="hidden_frame4"></iframe>
					</form>
					<form method="post" action="GwallJS/Gimg/upFile.jsp?upFile=5&savePath=<%=request.getParameter("savePath") %>" id="upImgForm5" name="upImgForm5" ENCTYPE="multipart/form-data" target="hidden_frame5">
						File5:<input id="upFile5" name="upFile5" type="file" class="fileInput" onchange="Gimg.selectFile(this)"/>
						<iframe name='hidden_frame5' onload="if(Gimg)Gimg.upFlieFinish(this)" id="hidden_frame5"></iframe>
					</form>
				</div>
	    		<table class="tabcss"><tr><td align="left">
			    	<b>上传进度【<span id="loadimgcount">0</span>】</b>
		   		</td><td align="right">
					<input type="button" value="全部取消" id="cancelAll" onclick="Gimg.canceUpImg(this);"/>
		    	</td></tr></table>
		    	<div style="overflow-y:auto;">
			    	<table style="font-size:14px;">
			    		<tr><td>File1: </td><td><div class="loading"><div id="loading1" class="loading2"></div></div></td>
			    		<td> <input id="upFile11" type="button" value="取消" onclick="Gimg.canceUpImg(this);"/></td></tr>
			    		<tr><td> </td></tr>
			    		<tr><td>File2: </td><td><div class="loading"><div id="loading2" class="loading2"></div></div></td>
			    		<td> <input id="upFile22" type="button" value="取消" onclick="Gimg.canceUpImg(this);"/></td></tr>
			    		<tr><td> </td></tr>
			    		<tr><td>File3: </td><td><div class="loading"><div id="loading3" class="loading2"></div></div></td>
			    		<td> <input id="upFile33" type="button" value="取消" onclick="Gimg.canceUpImg(this);"/></td></tr>
			    		<tr><td> </td></tr>
			    		<tr><td>File4: </td><td><div class="loading"><div id="loading4" class="loading2"></div></div></td>
			    		<td> <input id="upFile44" type="button" value="取消" onclick="Gimg.canceUpImg(this);"/></td></tr>
			    		<tr><td> </td></tr>
			    		<tr><td>File5: </td><td><div class="loading"><div id="loading5" class="loading2"></div></div></td>
			    		<td> <input id="upFile55" type="button" value="取消" onclick="Gimg.canceUpImg(this);"/></td></tr>
			    	</table>
		    	</div>
		    	</div>
		    </td></tr></table>
    	</div>
    </div>	
  </body>
</html>
