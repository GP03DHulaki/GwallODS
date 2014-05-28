<%@ page language="java" import="java.util.*"
	pageEncoding="utf-8"%>
<%@ page language="java" import="java.io.*" %>
<%@page import="com.gwall.util.UpFile"%>
<% 
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		String type = request.getParameter("type");
		String value = request.getParameter("value");
		String svpath = getServletContext().getRealPath("/");
		String path = request.getParameter("savePath");
		if(path == null || path.equals("null")){
			path = "GwallJS/Gimg/images/";
		}
		UpFile upfile = null;
		if(type != null){ //获取文件列表
			upfile = new UpFile();
			if(type.equals("getFileList")){
				String names = upfile.getFileList( svpath+path, value );
				out.print(path+"@"+names);
			}else
			if(type.equals("delFile")){
				out.print(upfile.delFile( svpath, value ));
			}
		}else{//上传文件
			upfile = new UpFile( svpath+path, request.getInputStream() );
			String newName = upfile.upFile();
	        System.out.println("旧文件名:" + upfile.getFilePath());
	        System.out.println("新文件名:" + newName);
	        System.out.println("扩展名:" + upfile.getFileReam());  
	        System.out.println("上传到路径:"+svpath+path+newName);
	        out.print("<input id='upImgState' type='hidden' value="+path+newName+" />");
		}
%>

