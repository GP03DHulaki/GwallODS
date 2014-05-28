<%@ page contentType="text/html; charset=UTF-8"%>
<%@page import="com.gwall.util.MBUtil"%>
<%@page import="com.gwall.view.TBbaseMB"%>
<%@page import="com.gwall.ods.taobao.entity.TBBaseEntity"%>
<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h"%>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f"%>
<%@ taglib uri="https://ajax4jsf.dev.java.net/ajax" prefix="a4j"%>
<%@ taglib uri="/WEB-INF/GWallTag" prefix="g"%>


<html>
	<head>
		<title>淘宝基础信息实体</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">

		<link href="<%=request.getContextPath()%>/gwall/all.css"
			rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/gtab.css"
			rel="stylesheet" type="text/css" />
		<script type="text/javascript" src="tbbase.js"></script>
		<script type="text/javascript"
			src='<%=request.getContextPath()%>/gwall/all.js'></script>
			<script type="text/javascript"
			src='<%=request.getContextPath()%>/js/Gwallwin.js'></script>
	</head>
	<f:view>
		<body id=mmain_body>
			<div id=mmain_nav>
				基础资料&gt;&gt;
				<b>淘宝基础信息实体</b>
				<br>
			</div>
			<div id=mmain>
				<h:form id="list">
					<div id=mmain_opt>
						<a4j:commandButton id="saveButton" value="新增" onclick="addDiv();"
							onmouseover="this.className='a4j_over'"
							onmouseout="this.className='a4j_buton'" rendered="#{tbbaseMB.ADD}"
							styleClass="a4j_but" tabindex="5" />
						
						<a4j:commandButton id="delButton" value="删除" type="button"
							action="#{tbbaseMB.delete}" rendered="#{tbbaseMB.DEL}"
							onclick="if(!deleteAll(gtable2)){return false};"
							reRender="outTable,msg" oncomplete="endDo();" requestDelay="50"
							onmouseover="this.className='a4j_over'"
							onmouseout="this.className='a4j_buton'" styleClass="a4j_but" />
						
							<a4j:commandButton id="query" value="查询"
								action="#{tbbaseMB.search}"
								onmouseover="this.className='search_over'"
								onmouseout="this.className='search_buton'" styleClass="but"
								reRender="outTable" onclick="startDo();"
								oncomplete="Gwin.close('progress_id');" />
							<a4j:commandButton value="重置"
								onmouseover="this.className='a4j_over'"
								onmouseout="this.className='a4j_buton'" styleClass="a4j_but"
								onclick="clearData();" reRender="out_List" />
					
					</div>
					<div id=mmain_cnd>
						
					 appkey:
						<h:inputText id="appkey" value="#{tbbaseMB.appkey}"
							styleClass="inputtextedit" />
							secret:
						<h:inputText id="secret" value="#{tbbaseMB.secret}"
							styleClass="inputtextedit" />
							sessionKey:
						<h:inputText id="sessionKey" value="#{tbbaseMB.sessionKey}"
							styleClass="inputtextedit" />
							url:
						<h:inputText id="url" value="#{tbbaseMB.url}"
							styleClass="inputtextedit" />	
					</div>
					<h:panelGrid id="outTable">
						<g:GTable gid="gtable2" gtype="grid" gversion="2"
							gselectsql="select ID,appkey,secret,sessionKey,url from tb_base
								Where 1=1 #{tbbaseMB.searchSQL}"
							gpage="(pagesize = 20)"
							gcolumn="gcid = id(headtext = selall,name = selall,width = 30,headtype = checkbox,align = center,type = checkbox,datatype=string);
						        gcid = 0(headtext = 行号,name = rowid,width = 30,headtype = sort,align = center,type = text,datatype=string);
							    gcid = -1(headtext = 操作,value=编辑,name = opt,width = 40,headtype = sort,align = center,type = link,linktype = script,typevalue = javascript:Edit(gcolumn[id]),datatype=string);
							    gcid = appkey(headtext = appkey,name = bran,width = 90,headtype = sort,align = left,type = text,datatype=string);
						     	gcid = secret(headtext = secret,name = brde,width = 120,headtype = sort,align = left,type = text,datatype=string);
						        gcid = sessionKey(headtext = sessionKey ,name = stat,width = 60,headtype = sort , align = center , type = mask,typevalue={1:有效/0:注销} , datatype = string); 
						        gcid = url(headtext = url,name = rema,width = 200,headtype = sort,align = left,type = text,datatype=string);
						" />
					</h:panelGrid>
					<a4j:outputPanel id="renderArea">
						<h:inputHidden id="sellist" value="#{tbbaseMB.sellist}" />
						<h:inputHidden id="msg" value="#{tbbaseMB.msg}"></h:inputHidden>
					</a4j:outputPanel>
				</h:form>
			</div>

			<div id="edit" style="display: none">
				<h:form id="edit">
					<div id=mmain_hide>
						<a4j:commandButton id="editbut" value="编辑" type="button"
							action="#{tbbaseMB.getSimpleBean}" reRender="editpanel,outTable"
							oncomplete="edit_show();" />
						<h:inputHidden id="selid" value="#{tbbaseMB.selid}" />
						<h:inputHidden id="updateflag" value="#{tbbaseMB.updateflag}"></h:inputHidden>
					</div>
					<a4j:outputPanel id="editpanel">
						<table align=center>
							<tr>
								<td>
									appkey：
								</td>
								<td>
									<h:inputText id="appkey" value="#{tbbaseMB.bean.appkey}"
										styleClass="inputtext" onfocus="this.select()" />
									<span style="">*</span>
								</td>
								<td>
									secret：
								</td>
								<td>
									<h:inputText id="secret" value="#{tbbaseMB.bean.secret}"
										styleClass="inputtext" onfocus="this.select()" />
									<span style="">*</span>
								</td>
							</tr>
							<tr>
								<td>
									sessionKey：
								</td>
								<td>
									<h:inputText id="sessionKey" value="#{tbbaseMB.bean.sessionKey}"
										styleClass="inputtext" onfocus="this.select()" />
									<span style="">*</span>
								</td>
								<td>
									url：
								</td>
								<td>
									<h:inputText id="url" value="#{tbbaseMB.bean.url}"
										styleClass="inputtext" onfocus="this.select()" />
									<span style="">*</span>
								</td>
							</tr>
							<tr>
								<td colspan="4" align="center">
									<a4j:commandButton id="saveid" action="#{tbbaseMB.save}"
										value="保存" reRender="output,outTable,msg,tree,out_List"
										onclick="if(!formCheck()){return false};"
										oncomplete="endDo();" onmouseover="this.className='a4j_over'"
										onmouseout="this.className='a4j_buton'" styleClass="a4j_but"
										rendered="#{tbbaseMB.MOD}" />
									<a4j:commandButton onmouseover="this.className='a4j_over'"
										onmouseout="this.className='a4j_buton'" styleClass="a4j_but"
										value="返回" onclick="hideDiv();" />
								</td>
							</tr>
						</table>

					</a4j:outputPanel>
				</h:form>

			</div>
		</body>
	</f:view>
</html>