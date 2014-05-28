<%@ page contentType="text/xml; charset=UTF-8"%>
<%@ page language="java"%>
<%@ page import="java.sql.*"%>
<%@ page import="java.io.*"%>
<%@ page import="com.gwall.core.GDatabase"%>
<%@page import="org.apache.commons.io.FileUtils"%>

<%
	out.clear();                                        //清空当前的输出内容（空格和换行符）
    String parentId = request.getParameter("parentId"); //获取要加载的节点编号
    String userid=(String)session.getAttribute("userid");
    //创建用于保存xmlTree信息的StringBuffer对象
    StringBuffer xmlTree= new StringBuffer("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
    xmlTree.append("<tree>");                           //xmlTree根节点为<tree>
 	String sql=" Select moid ,mona,wind,pmid,sort,moty from f_getmodule('"+userid+"','PC') Where pmid='"+parentId+"' order by sort,moid";
 	GDatabase DB = new GDatabase();
 	ResultSet rs = null;  				   				//声明ResultSet对象
    
    try {
        rs = DB.executeQuery(sql);				        //执行查询，返回结果集      
        while (rs.next()) {                 			//遍历结果集创建item节点
			xmlTree.append("<item id=\"");
            xmlTree.append(rs.getString("moid"));     
			xmlTree.append("\" isFolder=\"");
			
            if(rs.getString("moty").equals("SF") || rs.getString("moty").equals("UF")){
           		xmlTree.append("true");
            }else{
           		xmlTree.append("false");         		
            }
            String link = rs.getString("wind");
            //当link字段数据存在时才加入link属性信息
            if (link != null && !"".equals(link)) {
                xmlTree.append("\" link=\"");
                xmlTree.append(link);
            }            
            xmlTree.append("\">");
            xmlTree.append(rs.getString("mona"));
            xmlTree.append("</item>");
        }
    } catch (SQLException e) {
        System.out.println(e.toString());
    } finally {
	    if(DB!=null){
			DB.close();
		}
    }
    xmlTree.append("</tree>");    						//xmlTree根节点的结束标签
    out.print(xmlTree.toString()); 						//输出xmlTree

%>